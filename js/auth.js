/**
 * IronCoach Pro - Authentication & Multi-Tenant Subscription Manager
 * إدارة تسجيل الدخول، الصلاحيات (كوتش / متدرب)، وفحص عداد الـ 30 يوم والنسخ الاحتياطي
 */

const IronAuth = {
    ADMIN_USERNAME: "el_coach",
    ADMIN_PASSWORD: "123123",
    COACH_USERNAME: "coach",
    COACH_PASSWORD: "admin", // كلمة سر الحساب التجريبي (يتم التحقق عبر التشفير أو الإعدادات)

    // جلب جميع المشتركين من التخزين المحلي مع تأمين كلمات المرور المشفرة
    getAllTrainees() {
        const saved = localStorage.getItem("iron_trainees");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                let migrated = false;
                parsed.forEach(t => {
                    if (t.password && !String(t.password).startsWith("h$")) {
                        t.password = hashPassword(t.password);
                        migrated = true;
                    }
                });
                if (migrated) {
                    localStorage.setItem("iron_trainees", JSON.stringify(parsed));
                }
                return parsed;
            } catch (e) { }
        }
        const initial = IronConfig.defaultTrainees.map(t => ({
            ...t,
            password: hashPassword(t.password)
        }));
        localStorage.setItem("iron_trainees", JSON.stringify(initial));
        return initial;
    },

    saveAllTrainees(trainees) {
        const secured = trainees.map(t => ({
            ...t,
            password: t.password ? hashPassword(t.password) : hashPassword("123")
        }));
        localStorage.setItem("iron_trainees", JSON.stringify(secured));
    },

    // فحص وتحديث حالة الاشتراك وتحديث العداد
    refreshSubscriptionStatus(trainee) {
        const now = new Date();
        const joined = new Date(trainee.joinedDate);
        const diffMs = Math.max(0, now - joined);
        const daysPassed = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const rawSubDays = parseInt(trainee.subscriptionDays);
        const subDays = isNaN(rawSubDays) ? 30 : Math.max(0, rawSubDays);
        const daysLeft = Math.max(0, subDays - daysPassed);

        trainee.daysLeft = daysLeft;
        if (daysLeft === 0) {
            trainee.status = (subDays === 0 && !trainee.hasActivatedOnce) ? "pending" : "expired";
        } else if (daysLeft <= 3) {
            trainee.status = "expiring";
        } else {
            trainee.status = "active";
        }
        return trainee;
    },

    findExistingTrainee({ email = "", phone = "" } = {}) {
        const trainees = this.getAllTrainees();
        const cleanEmail = String(email || "").trim().toLowerCase();
        const cleanPhone = String(phone || "").replace(/\D/g, "");
        return trainees.find(t => {
            if (cleanEmail && t.email && t.email.toLowerCase() === cleanEmail) return true;
            if (cleanPhone && cleanPhone.length >= 7 && t.phone) {
                const tDigits = String(t.phone).replace(/\D/g, "");
                if (tDigits && tDigits === cleanPhone) return true;
            }
            return false;
        }) || null;
    },

    loginTraineeDirect(trainee) {
        if (!trainee) return { success: false };
        const refreshed = this.refreshSubscriptionStatus(trainee);
        this.updateTrainee(refreshed);

        const traineeUser = {
            role: "trainee",
            id: refreshed.id,
            name: refreshed.name,
            username: refreshed.username,
            status: refreshed.status,
            daysLeft: refreshed.daysLeft,
            traineeData: refreshed
        };

        localStorage.setItem("iron_session", JSON.stringify(traineeUser));
        sessionStorage.removeItem("iron_active_workout");
        return { success: true, user: traineeUser };
    },

    // تسجيل الدخول
    login(username, password) {
        username = (username || "").trim().toLowerCase();
        password = (password || "").trim();

        const config = getAppConfig();
        const adminUsername = (config.coachInfo && config.coachInfo.adminUsername) || "El_Coach";
        const adminStoredHash = (config.coachInfo && config.coachInfo.adminPasswordHash) || hashPassword(this.ADMIN_PASSWORD);
        const coachStoredHash = (config.coachInfo && config.coachInfo.passwordHash) || hashPassword(this.COACH_PASSWORD);

        // 1. فحص حساب الأدمن الرئيسي (El_Coach) أو حساب الكوتش التجريبي (coach)
        const isMainAdmin = username === adminUsername.toLowerCase() && verifyPassword(password, adminStoredHash);
        const isDemoCoach = username === this.COACH_USERNAME && verifyPassword(password, coachStoredHash);

        if (isMainAdmin || isDemoCoach) {
            const coachUser = {
                role: "coach",
                name: config.coachInfo.name || IronConfig.coachInfo.name,
                username: isMainAdmin ? adminUsername : "coach",
                title: config.coachInfo.title || IronConfig.coachInfo.title
            };
            localStorage.setItem("iron_session", JSON.stringify(coachUser));
            return { success: true, user: coachUser };
        }

        // 2. فحص حسابات المشتركين
        const trainees = this.getAllTrainees();
        let trainee = trainees.find(t => t.username.toLowerCase() === username && verifyPassword(password, t.password));

        if (!trainee) {
            const msg = typeof IronI18n !== "undefined" ? IronI18n.t("login_invalid") : "اسم المستخدم أو كلمة المرور غير صحيحة";
            return { success: false, message: msg };
        }

        // تحديث حالة الاشتراك
        trainee = this.refreshSubscriptionStatus(trainee);
        this.updateTrainee(trainee);

        const traineeUser = {
            role: "trainee",
            id: trainee.id,
            name: trainee.name,
            username: trainee.username,
            status: trainee.status,
            daysLeft: trainee.daysLeft,
            traineeData: trainee
        };

        localStorage.setItem("iron_session", JSON.stringify(traineeUser));
        sessionStorage.removeItem("iron_active_workout");
        return { success: true, user: traineeUser };
    },

    // العودة السريعة للوحة الكوتش أثناء معاينة حساب المتدرب
    returnToCoachDashboard() {
        const config = getAppConfig();
        const current = this.getCurrentUser();
        const coachUser = {
            role: "coach",
            name: config.coachInfo.name || IronConfig.coachInfo.name,
            username: (current && current.impersonatedBy) || (config.coachInfo && config.coachInfo.adminUsername) || "El_Coach",
            title: config.coachInfo.title || IronConfig.coachInfo.title
        };
        sessionStorage.removeItem("iron_active_workout");
        localStorage.setItem("iron_session", JSON.stringify(coachUser));
        window.location.reload();
    },

    // تسجيل الخروج
    logout() {
        localStorage.removeItem("iron_session");
        sessionStorage.removeItem("iron_active_workout");
        window.location.reload();
    },

    // جلب المستخدم الحالي
    getCurrentUser() {
        const session = localStorage.getItem("iron_session");
        if (session) {
            try {
                const user = JSON.parse(session);
                if (user.role === "coach") {
                    const config = getAppConfig();
                    user.name = config.coachInfo.name || user.name;
                    user.title = config.coachInfo.title || user.title;
                }
                // إذا كان متدرب، نحدث بياناته من قاعدة البيانات الخاصة به فقط
                if (user.role === "trainee") {
                    const trainees = this.getAllTrainees();
                    const fresh = trainees.find(t => t.id === user.id);
                    if (!fresh) {
                        localStorage.removeItem("iron_session");
                        return null;
                    }
                    const updated = this.refreshSubscriptionStatus(fresh);
                    user.name = updated.name;
                    user.username = updated.username;
                    user.status = updated.status;
                    user.daysLeft = updated.daysLeft;
                    user.traineeData = updated;
                }
                return user;
            } catch (e) { }
        }
        return null;
    },

    // تحديث بيانات متدرب (يدعم تمرير كائن كامل أو معرف + الحقول المعدلة مع مزامنة الجلسة)
    updateTrainee(traineeOrId, patchFields = null) {
        const trainees = this.getAllTrainees();
        const targetId = typeof traineeOrId === "string" ? traineeOrId : traineeOrId?.id;
        if (!targetId) return null;

        const index = trainees.findIndex(t => t.id === targetId);
        if (index === -1) return null;

        const updated = typeof traineeOrId === "string"
            ? { ...trainees[index], ...(patchFields || {}) }
            : traineeOrId;

        trainees[index] = updated;
        this.saveAllTrainees(trainees);

        // تحديث الجلسة النشطة إن كان المتدرب نفسه متصلاً الآن (بما فيها صورة البروفايل)
        try {
            const sessionStr = localStorage.getItem("iron_session");
            if (sessionStr) {
                const session = JSON.parse(sessionStr);
                if (session && session.role === "trainee" && session.id === targetId) {
                    session.name = updated.name;
                    session.traineeData = updated;
                    localStorage.setItem("iron_session", JSON.stringify(session));
                }
            }
        } catch (e) {}

        return updated;
    },

    // تعديل بيانات متدرب بواسطة الكوتش
    editTrainee(traineeId, fields) {
        const trainees = this.getAllTrainees();
        const index = trainees.findIndex(t => t.id === traineeId);
        if (index === -1) return null;

        const existing = trainees[index];
        existing.name = fields.name || existing.name;
        existing.username = (fields.username || existing.username).trim().toLowerCase();
        existing.phone = fields.phone !== undefined ? fields.phone : existing.phone;
        existing.weight = parseFloat(fields.weight) || existing.weight;
        existing.height = parseFloat(fields.height) || existing.height || 175;
        existing.age = parseInt(fields.age) || existing.age || 26;
        existing.gender = fields.gender || existing.gender || "male";
        existing.activity = parseFloat(fields.activity) || existing.activity || 1.55;
        existing.goal = fields.goal || existing.goal;
        existing.calories = parseInt(fields.calories) || existing.calories || 2000;
        existing.program = fields.program || existing.program;
        if (fields.coachNote !== undefined) {
            existing.coachNote = fields.coachNote.trim();
        }

        if (fields.newPassword && fields.newPassword.trim() !== "") {
            existing.password = hashPassword(fields.newPassword.trim());
        }

        if (fields.daysLeft !== undefined && fields.daysLeft !== "") {
            const targetDaysLeft = Math.max(0, parseInt(fields.daysLeft));
            existing.joinedDate = new Date().toISOString().split('T')[0];
            existing.subscriptionDays = targetDaysLeft;
            existing.daysLeft = targetDaysLeft;
        }

        if (typeof IronCalculator !== "undefined") {
            const proteinGrams = Math.round(existing.weight * 2.0);
            const fatGrams = Math.round((existing.calories * 0.25) / 9);
            const carbGrams = Math.max(0, Math.round((existing.calories - (proteinGrams * 4 + fatGrams * 9)) / 4));
            existing.macros = {
                protein: proteinGrams,
                fats: fatGrams,
                carbs: carbGrams
            };
        }

        this.refreshSubscriptionStatus(existing);
        trainees[index] = existing;
        this.saveAllTrainees(trainees);
        return existing;
    },

    // حذف متدرب من المنصة وتنظيف كافة بياناته المرتبطة
    deleteTrainee(traineeId) {
        const trainees = this.getAllTrainees();
        const target = trainees.find(t => t.id === traineeId);
        if (!target) return null;
        const filtered = trainees.filter(t => t.id !== traineeId);
        this.saveAllTrainees(filtered);

        // تنظيف سجلات المتدرب المحذوف الخاصة بالدايت والماء والتمارين والوجبات المخصصة
        try {
            const diets = JSON.parse(localStorage.getItem("iron_saved_diets") || "{}");
            if (diets[traineeId]) {
                delete diets[traineeId];
                localStorage.setItem("iron_saved_diets", JSON.stringify(diets));
            }
            const water = JSON.parse(localStorage.getItem("iron_water_logs") || "{}");
            Object.keys(water).forEach(k => {
                if (k.startsWith(`${traineeId}_`)) delete water[k];
            });
            localStorage.setItem("iron_water_logs", JSON.stringify(water));
            const logs = JSON.parse(localStorage.getItem("iron_workout_logs") || "[]");
            localStorage.setItem("iron_workout_logs", JSON.stringify(logs.filter(l => l.traineeId !== traineeId)));
            const customMeals = JSON.parse(localStorage.getItem("iron_custom_meals") || "[]");
            localStorage.setItem("iron_custom_meals", JSON.stringify(customMeals.filter(m => m.ownerId !== traineeId)));
        } catch (e) {}

        return target;
    },

    // إضافة متدرب جديد بواسطة الكوتش
    addTrainee(newTrainee) {
        const trainees = this.getAllTrainees();
        newTrainee.id = "tr_" + Date.now();
        newTrainee.joinedDate = new Date().toISOString().split('T')[0];
        newTrainee.subscriptionDays = parseInt(newTrainee.subscriptionDays) || 30;
        newTrainee.daysLeft = newTrainee.subscriptionDays;
        newTrainee.status = "active";
        newTrainee.weight = parseFloat(newTrainee.weight) || 75;
        newTrainee.height = parseFloat(newTrainee.height) || 175;
        newTrainee.age = parseInt(newTrainee.age) || 26;
        newTrainee.gender = newTrainee.gender || "male";
        newTrainee.activity = parseFloat(newTrainee.activity) || 1.55;
        newTrainee.goal = newTrainee.goal || "تنشيف وخسارة دهون";
        newTrainee.password = hashPassword(newTrainee.password || "123");

        if (typeof IronCalculator !== "undefined") {
            const goalOffset = newTrainee.goal.includes("تضخيم") ? 350 : newTrainee.goal.includes("تثبيت") ? 0 : -500;
            const calc = IronCalculator.calculate({
                gender: newTrainee.gender,
                age: newTrainee.age,
                weight: newTrainee.weight,
                height: newTrainee.height,
                activity: newTrainee.activity,
                goal: goalOffset
            });
            if (!newTrainee.calories) {
                newTrainee.calories = calc.targetCalories;
            }
            newTrainee.macros = {
                protein: calc.proteinGrams,
                fats: calc.fatGrams,
                carbs: calc.carbGrams
            };
        }

        newTrainee.history = [
            { date: newTrainee.joinedDate, weight: newTrainee.weight, waist: parseFloat(newTrainee.waist) || 80 }
        ];

        trainees.push(newTrainee);
        this.saveAllTrainees(trainees);
        return newTrainee;
    },

    // تسجيل عميل جديد عبر Google أو iCloud أو رقم الجوال OTP (بحالة بانتظار الدفع حتى تفعيل الـ 30 يوماً)
    registerClient(data) {
        const trainees = this.getAllTrainees();
        const existing = this.findExistingTrainee({ email: data.email, phone: data.phone });
        if (existing) {
            return this.loginTraineeDirect(existing);
        }

        const nowId = Date.now();
        const emailBase = data.email ? data.email.split("@")[0].replace(/[^a-z0-9_]/gi, "").toLowerCase() : "";
        const phoneDigits = String(data.phone || "").replace(/\D/g, "");
        const baseHandle = emailBase || (phoneDigits ? `user_${phoneDigits.slice(-6)}` : `client_${nowId.toString().slice(-5)}`);
        let uniqueUsername = baseHandle;
        let suffix = 1;
        while (trainees.some(t => t.username.toLowerCase() === uniqueUsername.toLowerCase())) {
            uniqueUsername = `${baseHandle}_${suffix++}`;
        }

        const weight = parseFloat(data.weight) || 75;
        const height = parseFloat(data.height) || 175;
        const age = parseInt(data.age) || 26;
        const gender = data.gender || "male";
        const activity = parseFloat(data.activity) || 1.55;
        const goal = data.goal || "تنشيف وخسارة دهون";
        const goalOffset = goal.includes("تضخيم") ? 350 : (goal.includes("تثبيت") || goal.includes("نحت")) ? 0 : -500;

        let targetCalories = parseInt(data.calories) || 2000;
        let macros = { protein: Math.round(weight * 2), fats: 55, carbs: 200 };
        if (typeof IronCalculator !== "undefined") {
            const calc = IronCalculator.calculate({ gender, age, weight, height, activity, goal: goalOffset });
            targetCalories = calc.targetCalories;
            macros = { protein: calc.proteinGrams, fats: calc.fatGrams, carbs: calc.carbGrams };
        }

        const todayStr = new Date().toISOString().split("T")[0];
        const newTrainee = {
            id: "tr_" + nowId,
            name: (data.name || uniqueUsername).trim(),
            username: uniqueUsername,
            email: (data.email || "").trim().toLowerCase(),
            phone: (data.phone || "").trim(),
            authProvider: data.authProvider || "phone",
            password: hashPassword(data.password || ("otp_" + nowId)),
            joinedDate: todayStr,
            subscriptionDays: 0,
            daysLeft: 0,
            status: "pending",
            hasActivatedOnce: false,
            weight,
            height,
            age,
            gender,
            activity,
            goal,
            calories: targetCalories,
            macros,
            program: data.program || "PPL (Push Pull Legs)",
            history: [{ date: todayStr, weight, waist: null }]
        };

        trainees.push(newTrainee);
        this.saveAllTrainees(trainees);
        return this.loginTraineeDirect(newTrainee);
    },

    // تجديد اشتراك متدرب مع إضافة الأيام للرصيد المتبقي
    renewSubscription(traineeId, additionalDays = 30, receiptInfo = null) {
        const trainees = this.getAllTrainees();
        const trainee = trainees.find(t => t.id === traineeId);
        if (trainee) {
            this.refreshSubscriptionStatus(trainee);
            const remaining = Math.max(0, parseInt(trainee.daysLeft) || 0);
            const totalDays = remaining + (parseInt(additionalDays) || 30);

            trainee.joinedDate = new Date().toISOString().split('T')[0];
            trainee.subscriptionDays = totalDays;
            trainee.daysLeft = totalDays;
            trainee.hasActivatedOnce = true;
            trainee.status = "active";
            if (receiptInfo) {
                trainee.lastRenewalReceipt = receiptInfo;
            }
            this.saveAllTrainees(trainees);
            return trainee;
        }
        return null;
    },

    // تصدير نسخة احتياطية كاملة لبيانات المنصة (JSON)
    exportBackupData() {
        return {
            app: "IronCoach Pro",
            version: "2.2.0",
            exportedAt: new Date().toISOString(),
            config: getAppConfig(),
            trainees: this.getAllTrainees(),
            customMeals: JSON.parse(localStorage.getItem("iron_custom_meals") || "[]"),
            workoutLogs: JSON.parse(localStorage.getItem("iron_workout_logs") || "[]"),
            savedDiets: JSON.parse(localStorage.getItem("iron_saved_diets") || "{}"),
            waterLogs: JSON.parse(localStorage.getItem("iron_water_logs") || "{}")
        };
    },

    // استيراد واستعادة نسخة احتياطية
    importBackupData(payload) {
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        if (!payload || !Array.isArray(payload.trainees)) {
            return { success: false, message: isEn ? "Invalid or corrupted backup JSON file" : "ملف النسخة الاحتياطية غير صالح أو تالف" };
        }
        if (payload.config) {
            saveAppConfig(payload.config);
        }
        this.saveAllTrainees(payload.trainees);
        if (Array.isArray(payload.customMeals)) {
            localStorage.setItem("iron_custom_meals", JSON.stringify(payload.customMeals));
        }
        if (Array.isArray(payload.workoutLogs)) {
            localStorage.setItem("iron_workout_logs", JSON.stringify(payload.workoutLogs));
        }
        if (payload.savedDiets && typeof payload.savedDiets === "object") {
            localStorage.setItem("iron_saved_diets", JSON.stringify(payload.savedDiets));
        }
        if (payload.waterLogs && typeof payload.waterLogs === "object") {
            localStorage.setItem("iron_water_logs", JSON.stringify(payload.waterLogs));
        }
        return { success: true, count: payload.trainees.length };
    }
};
