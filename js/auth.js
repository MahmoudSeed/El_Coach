/**
 * IronCoach Pro - Authentication & Multi-Tenant Subscription Manager
 * إدارة تسجيل الدخول، الصلاحيات (كوتش / متدرب)، وفحص عداد الـ 30 يوم
 */

const IronAuth = {
    COACH_USERNAME: "coach",
    COACH_PASSWORD: "admin", // كلمة سر الكوتش الافتراضية

    // جلب جميع المشتركين من التخزين المحلي
    getAllTrainees() {
        const saved = localStorage.getItem("iron_trainees");
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        const initial = IronConfig.defaultTrainees;
        localStorage.setItem("iron_trainees", JSON.stringify(initial));
        return initial;
    },

    saveAllTrainees(trainees) {
        localStorage.setItem("iron_trainees", JSON.stringify(trainees));
    },

    // فحص وتحديث حالة الاشتراك وتحديث العداد
    refreshSubscriptionStatus(trainee) {
        const now = new Date();
        const joined = new Date(trainee.joinedDate);
        const diffMs = now - joined;
        const daysPassed = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const daysLeft = Math.max(0, trainee.subscriptionDays - daysPassed);

        trainee.daysLeft = daysLeft;
        if (daysLeft === 0) {
            trainee.status = "expired";
        } else if (daysLeft <= 3) {
            trainee.status = "expiring";
        } else {
            trainee.status = "active";
        }
        return trainee;
    },

    // تسجيل الدخول
    login(username, password) {
        username = (username || "").trim().toLowerCase();
        password = (password || "").trim();

        // 1. فحص حساب الكوتش
        if (username === this.COACH_USERNAME && password === this.COACH_PASSWORD) {
            const coachUser = {
                role: "coach",
                name: IronConfig.coachInfo.name,
                username: "coach",
                title: IronConfig.coachInfo.title
            };
            localStorage.setItem("iron_session", JSON.stringify(coachUser));
            return { success: true, user: coachUser };
        }

        // 2. فحص حسابات المشتركين
        const trainees = this.getAllTrainees();
        let trainee = trainees.find(t => t.username.toLowerCase() === username && t.password === password);

        if (!trainee) {
            return { success: false, message: "اسم المستخدم أو كلمة المرور غير صحيحة" };
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
        return { success: true, user: traineeUser };
    },

    // تسجيل الخروج
    logout() {
        localStorage.removeItem("iron_session");
        window.location.reload();
    },

    // جلب المستخدم الحالي
    getCurrentUser() {
        const session = localStorage.getItem("iron_session");
        if (session) {
            try {
                const user = JSON.parse(session);
                // إذا كان متدرب، نحدث بياناته من قاعدة البيانات
                if (user.role === "trainee") {
                    const trainees = this.getAllTrainees();
                    const fresh = trainees.find(t => t.id === user.id);
                    if (fresh) {
                        const updated = this.refreshSubscriptionStatus(fresh);
                        user.status = updated.status;
                        user.daysLeft = updated.daysLeft;
                        user.traineeData = updated;
                    }
                }
                return user;
            } catch (e) { }
        }
        return null;
    },

    // تحديث بيانات متدرب
    updateTrainee(updatedTrainee) {
        const trainees = this.getAllTrainees();
        const index = trainees.findIndex(t => t.id === updatedTrainee.id);
        if (index !== -1) {
            trainees[index] = updatedTrainee;
            this.saveAllTrainees(trainees);
        }
    },

    // إضافة متدرب جديد بواسطة الكوتش
    addTrainee(newTrainee) {
        const trainees = this.getAllTrainees();
        newTrainee.id = "tr_" + Date.now();
        newTrainee.joinedDate = new Date().toISOString().split('T')[0];
        newTrainee.subscriptionDays = parseInt(newTrainee.subscriptionDays) || 30;
        newTrainee.daysLeft = newTrainee.subscriptionDays;
        newTrainee.status = "active";
        newTrainee.history = [
            { date: newTrainee.joinedDate, weight: newTrainee.weight, waist: newTrainee.waist || 80 }
        ];

        trainees.push(newTrainee);
        this.saveAllTrainees(trainees);
        return newTrainee;
    },

    // تجديد اشتراك متدرب بـ 30 يوماً إضافية
    renewSubscription(traineeId, additionalDays = 30) {
        const trainees = this.getAllTrainees();
        const trainee = trainees.find(t => t.id === traineeId);
        if (trainee) {
            trainee.joinedDate = new Date().toISOString().split('T')[0];
            trainee.subscriptionDays = additionalDays;
            trainee.daysLeft = additionalDays;
            trainee.status = "active";
            this.saveAllTrainees(trainees);
            return trainee;
        }
        return null;
    }
};
