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
        phone: "+966563055827",
        whatsapp: "966563055827",
        vodafoneCash: "01274300663",
        instapayUser: "mahmoudsaeed291997@instapay",
        stcPay: "966563055827",
        bankName: "مصرف الراجحي (Al Rajhi Bank)",
        bankIban: "SA4180000644608017933823",
        paymentLink: "",
        adminUsername: "El_Coach",
        adminPasswordHash: hashPassword("123123"),
        passwordHash: hashPassword("admin")
    },
    subscriptionPrice: {
        trialDay: 1,
        monthly: 139,
        twoMonths: 239,
        threeMonths: 299,
        currency: "ر.س",
        defaultDurationDays: 30,
        tiers: [
            { months: 0, days: 1, price: 1 },
            { months: 1, days: 30, price: 139 },
            { months: 2, days: 60, price: 239 },
            { months: 3, days: 90, price: 299 }
        ]
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

// استرجاع وحفظ الإعدادات من ذاكرة الكلاود السحابية (Supabase app_settings) بدون تخزين كلمات مرور محلياً
function getAppConfig() {
    if (typeof IronSupabase !== "undefined" && IronSupabase.cache && IronSupabase.cache.appConfig) {
        return IronSupabase.cache.appConfig;
    }
    return {
        appName: IronConfig.appName,
        appVersion: IronConfig.appVersion,
        coachInfo: { ...IronConfig.coachInfo },
        subscriptionPrice: { ...IronConfig.subscriptionPrice }
    };
}

async function loadAppConfigFromCloud() {
    if (typeof IronSupabase !== "undefined") {
        const loaded = await IronSupabase.loadAppSettings();
        if (loaded) return loaded;
    }
    return getAppConfig();
}

async function saveAppConfig(newConfig) {
    if (typeof IronSupabase !== "undefined") {
        IronSupabase.cache.appConfig = newConfig;
        return await IronSupabase.saveAppSettings(newConfig);
    }
    return { data: newConfig, error: null };
}
