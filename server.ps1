param([int]$Port = 8080)

$ip = [System.Net.IPAddress]::Parse("127.0.0.1")
$listener = [System.Net.Sockets.TcpListener]::new($ip, $Port)
$listener.Start()
Write-Host "IronCoach Server listening on http://localhost:$Port/"

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
}

try {
    while ($true) {
        try {
            $client = $listener.AcceptTcpClient()
            $stream = $client.GetStream()
            $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::UTF8)

            $requestLine = $reader.ReadLine()
            if (-not [string]::IsNullOrEmpty($requestLine)) {
                $parts = $requestLine.Split(' ')
                if ($parts.Length -ge 2 -and $parts[0] -eq "GET") {
                    $rawPath = $parts[1].Split('?')[0].TrimStart('/')
                    if ([string]::IsNullOrEmpty($rawPath)) { $rawPath = "index.html" }
                    $decodedPath = [System.Uri]::UnescapeDataString($rawPath).Replace('/', '\')
                    $fullPath = Join-Path (Get-Location) $decodedPath

                    if (Test-Path $fullPath -PathType Leaf) {
                        $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
                        $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
                        $bytes = [System.IO.File]::ReadAllBytes($fullPath)
                        
                        $header = "HTTP/1.1 200 OK`r`n" +
                                  "Content-Type: $contentType`r`n" +
                                  "Content-Length: $($bytes.Length)`r`n" +
                                  "Access-Control-Allow-Origin: *`r`n" +
                                  "Connection: close`r`n`r`n"
                        $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
                        $stream.Write($headerBytes, 0, $headerBytes.Length)
                        $stream.Write($bytes, 0, $bytes.Length)
                    } else {
                        $body = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 Not Found</h1>")
                        $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/html`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
                        $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
                        $stream.Write($headerBytes, 0, $headerBytes.Length)
                        $stream.Write($body, 0, $body.Length)
                    }
                }
            }
        } catch {
            # Ignore client disconnects / network aborts
        } finally {
            if ($null -ne $stream) { try { $stream.Close() } catch {} }
            if ($null -ne $client) { try { $client.Close() } catch {} }
        }
    }
} finally {
    $listener.Stop()
}
