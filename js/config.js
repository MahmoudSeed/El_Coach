/**
 * IronCoach Pro - Application Configuration & Initial State
 * إعدادات منصة أيرون كوتش والبيانات الأولية
 */

// دالة تشفير كلمات المرور محلياً لمنع تخزينها كنص صريح (WARN-4 FIX)
function hashPassword(raw) {
    const str = String(raw || "").trim();
    if (str.startsWith("h$")) return str;
    let h1 = 0xdeadbeef ^ str.length;
    let h2 = 0x41c6ce57 ^ str.length;
    for (let i = 0; i < str.length; i++) {
        const ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return "h$" + (h2 >>> 0).toString(16).padStart(8, "0") + (h1 >>> 0).toString(16).padStart(8, "0");
}

function verifyPassword(inputPassword, storedPassword) {
    const cleanInput = String(inputPassword || "").trim();
    const stored = String(storedPassword || "").trim();
    if (stored.startsWith("h$")) {
        return hashPassword(cleanInput) === stored;
    }
    return cleanInput === stored || hashPassword(cleanInput) === hashPassword(stored);
}

const IronConfig = {
    appName: "أيرون كوتش",
    appVersion: "2.1.0",
    coachInfo: {
        name: "الكوتش محمود",
        title: "مدرب معتمد NASM & خبير تغذية رياضية",
        phone: "+201000000000", // سيتمكن الكوتش من تعديله من لوحة التحكم
        whatsapp: "201000000000",
        vodafoneCash: "01000000000",
        instapayUser: "coach@instapay",
        stcPay: "0500000000",
        bankName: "البنك الأهلي / الراجحي",
        bankIban: "EG00000000000000000000000000",
        paymentLink: "https://buy.stripe.com/demo",
        adminUsername: "El_Coach",
        adminPasswordHash: hashPassword("123123"),
        passwordHash: hashPassword("admin")
    },
    subscriptionPrice: {
        monthly: 500, // EGP أو SAR حسب رغبة المدرب
        currency: "ج.م / ر.س",
        defaultDurationDays: 30
    },
    defaultTrainees: [
        {
            id: "tr_1",
            name: "أحمد علي",
            username: "ahmed",
            password: "123",
            phone: "+201011112222",
            joinedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            subscriptionDays: 30,
            daysLeft: 20,
            status: "active", // active | expiring | expired
            goal: "تنشيف وخسارة دهون",
            calories: 1950,
            program: "PPL (Push Pull Legs)",
            weight: 79.5,
            height: 176,
            age: 26,
            gender: "male",
            activity: 1.55,
            history: [
                { date: "2026-11-01", weight: 81.2, waist: 86 },
                { date: "2026-11-08", weight: 80.3, waist: 85 },
                { date: "2026-11-13", weight: 79.5, waist: 84 }
            ]
        },
        {
            id: "tr_2",
            name: "سارة محمد",
            username: "sara",
            password: "123",
            phone: "+201033334444",
            joinedDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            subscriptionDays: 30,
            daysLeft: 2,
            status: "expiring",
            goal: "نحت الجسم وتثبيت الوزن",
            calories: 1600,
            program: "Upper / Lower Split",
            weight: 62.0,
            height: 165,
            age: 24,
            gender: "female",
            activity: 1.375,
            history: [
                { date: "2026-10-15", weight: 63.5, waist: 72 },
                { date: "2026-11-12", weight: 62.0, waist: 70 }
            ]
        },
        {
            id: "tr_3",
            name: "خالد عبد الله",
            username: "khaled",
            password: "123",
            phone: "+201055556666",
            joinedDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            subscriptionDays: 30,
            daysLeft: 0,
            status: "expired",
            goal: "تضخيم وبناء عضلات",
            calories: 2750,
            program: "Arnold Split",
            weight: 74.0,
            height: 180,
            age: 29,
            gender: "male",
            activity: 1.725,
            history: [
                { date: "2026-10-05", weight: 72.0, waist: 80 },
                { date: "2026-11-05", weight: 74.0, waist: 81 }
            ]
        }
    ]
};

// حفظ واسترجاع الإعدادات من التخزين المحلي مع الترحيل التلقائي لحساب الأدمن
function getAppConfig() {
    const saved = localStorage.getItem("iron_coach_config");
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (!parsed.coachInfo) parsed.coachInfo = { ...IronConfig.coachInfo };
            if (!parsed.coachInfo.adminUsername || !parsed.coachInfo.adminPasswordHash) {
                parsed.coachInfo.adminUsername = parsed.coachInfo.adminUsername || "El_Coach";
                parsed.coachInfo.adminPasswordHash = parsed.coachInfo.adminPasswordHash || hashPassword("123123");
                localStorage.setItem("iron_coach_config", JSON.stringify(parsed));
            }
            return parsed;
        } catch (e) { }
    }
    localStorage.setItem("iron_coach_config", JSON.stringify(IronConfig));
    return IronConfig;
}

function saveAppConfig(newConfig) {
    localStorage.setItem("iron_coach_config", JSON.stringify(newConfig));
}
