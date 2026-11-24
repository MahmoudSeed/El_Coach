param([int]$Port = 8080)

$rootDir = (Get-Location).Path

$code = @'
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

public class IronHttpServer {
    private static readonly Dictionary<string, string> MimeTypes = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) {
        { ".html", "text/html; charset=utf-8" },
        { ".css",  "text/css; charset=utf-8" },
        { ".js",   "application/javascript; charset=utf-8" },
        { ".json", "application/json; charset=utf-8" },
        { ".png",  "image/png" },
        { ".jpg",  "image/jpeg" },
        { ".jpeg", "image/jpeg" },
        { ".gif",  "image/gif" },
        { ".svg",  "image/svg+xml" }
    };

    public static void Start(int port, string rootDir) {
        var listener = new TcpListener(IPAddress.Any, port);
        listener.Start(64);
        Console.WriteLine("IronCoach Server listening on http://localhost:" + port + "/ (and LAN IP)");

        while (true) {
            TcpClient client = listener.AcceptTcpClient();
            ThreadPool.QueueUserWorkItem(_ => HandleClient(client, rootDir));
        }
    }

    private static void HandleClient(TcpClient client, string rootDir) {
        NetworkStream stream = null;
        try {
            client.ReceiveTimeout = 2000;
            client.SendTimeout = 5000;
            stream = client.GetStream();
            var reader = new StreamReader(stream, Encoding.UTF8);
            string requestLine = reader.ReadLine();
            if (string.IsNullOrEmpty(requestLine)) return;

            string[] parts = requestLine.Split(' ');
            if (parts.Length < 2 || (parts[0] != "GET" && parts[0] != "HEAD")) return;

            string rawPath = parts[1].Split('?')[0].TrimStart('/');
            if (string.IsNullOrEmpty(rawPath)) rawPath = "index.html";
            string relPath = Uri.UnescapeDataString(rawPath).Replace('/', Path.DirectorySeparatorChar);
            string fullPath = Path.GetFullPath(Path.Combine(rootDir, relPath));

            if (!fullPath.StartsWith(Path.GetFullPath(rootDir), StringComparison.OrdinalIgnoreCase) || !File.Exists(fullPath)) {
                byte[] notFound = Encoding.UTF8.GetBytes("<h1>404 Not Found</h1>");
                string h404 = "HTTP/1.1 404 Not Found\r\nContent-Type: text/html\r\nContent-Length: " + notFound.Length + "\r\nConnection: close\r\n\r\n";
                byte[] hBytes = Encoding.ASCII.GetBytes(h404);
                stream.Write(hBytes, 0, hBytes.Length);
                if (parts[0] != "HEAD") stream.Write(notFound, 0, notFound.Length);
                return;
            }

            string ext = Path.GetExtension(fullPath);
            string mime = MimeTypes.ContainsKey(ext) ? MimeTypes[ext] : "application/octet-stream";
            byte[] data = File.ReadAllBytes(fullPath);

            string header = "HTTP/1.1 200 OK\r\n" +
                            "Content-Type: " + mime + "\r\n" +
                            "Content-Length: " + data.Length + "\r\n" +
                            "Cache-Control: no-cache\r\n" +
                            "Access-Control-Allow-Origin: *\r\n" +
                            "Connection: close\r\n\r\n";
            byte[] headerBytes = Encoding.ASCII.GetBytes(header);
            stream.Write(headerBytes, 0, headerBytes.Length);
            if (parts[0] != "HEAD") {
                stream.Write(data, 0, data.Length);
            }
            stream.Flush();
        } catch {
            // Ignore timeouts / disconnects cleanly
        } finally {
            if (stream != null) try { stream.Close(); } catch {}
            if (client != null) try { client.Close(); } catch {}
        }
    }
}
'@

Add-Type -TypeDefinition $code
[IronHttpServer]::Start($Port, $rootDir)
