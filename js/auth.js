/**
 * IronCoach Pro - Cloud Authentication & Multi-Tenant Subscription Manager (Supabase)
 * إدارة الجلسات والصلاحيات (كوتش / متدرب) واشتراكات الـ 30 يوم عبر Supabase
 */

const IronAuth = {
    ADMIN_USERNAME: "el_coach",
    COACH_USERNAME: "coach",
    IMPERSONATE_KEY: "iron_impersonate_client_id",

    getAllTrainees() {
        if (typeof IronSupabase !== "undefined" && Array.isArray(IronSupabase.cache.trainees)) {
            return IronSupabase.cache.trainees;
        }
        return [];
    },

    refreshSubscriptionStatus(trainee) {
        if (!trainee) return trainee;
        const now = new Date();
        const joined = new Date(trainee.joinedDate || new Date().toISOString().split("T")[0]);
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

    phonesMatch(phoneA = "", phoneB = "") {
        const a = String(phoneA || "").replace(/\D/g, "");
        const b = String(phoneB || "").replace(/\D/g, "");
        if (!a || !b || a.length < 7 || b.length < 7) return false;
        if (a === b) return true;
        return a.length >= 9 && b.length >= 9 && a.slice(-9) === b.slice(-9);
    },

    findExistingTrainee({ email = "", phone = "" } = {}) {
        const trainees = this.getAllTrainees();
        const cleanEmail = String(email || "").trim().toLowerCase();
        return trainees.find(t => {
            if (cleanEmail && t.email && t.email.toLowerCase() === cleanEmail) return true;
            if (phone && t.phone && this.phonesMatch(phone, t.phone)) return true;
            return false;
        }) || null;
    },

    getCurrentUser() {
        return typeof IronSupabase !== "undefined" ? IronSupabase.cache.currentUser : null;
    },

    buildTraineeSessionUser(trainee, extra = {}) {
        const refreshed = this.refreshSubscriptionStatus({ ...trainee });
        return {
            role: "trainee",
            id: refreshed.id,
            name: refreshed.name,
            username: refreshed.username,
            status: refreshed.status,
            daysLeft: refreshed.daysLeft,
            traineeData: refreshed,
            ...extra
        };
    },

    async syncAllTrainees() {
        const sb = typeof IronSupabase !== "undefined" ? IronSupabase.initClient() : null;
        if (!sb) return [];
        const { data, error } = await sb
            .from("clients")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) {
            console.error("syncAllTrainees error:", error);
            return IronSupabase.cache.trainees || [];
        }
        const mapped = (data || []).map(row => this.refreshSubscriptionStatus(IronSupabase.mapClientFromDb(row)));
        IronSupabase.cache.trainees = mapped;
        if (typeof IronSupabase.loadCoachWorkoutLogs === "function") {
            await IronSupabase.loadCoachWorkoutLogs();
        }
        return mapped;
    },

    async initFromCloud() {
        const sb = typeof IronSupabase !== "undefined" ? IronSupabase.initClient() : null;
        if (!sb) {
            IronSupabase.cache.currentUser = null;
            return { user: null, needsOnboarding: false, oauthUser: null };
        }

        const { data: sessRes, error: sessErr } = await sb.auth.getSession();
        if (sessErr || !sessRes?.session?.user) {
            IronSupabase.cache.currentUser = null;
            return { user: null, needsOnboarding: false, oauthUser: null };
        }

        // Validate JWT against Auth server cleanly
        const { data: userRes, error: userErr } = await sb.auth.getUser();
        const authUser = (!userErr && userRes?.user) ? userRes.user : sessRes.session.user;
        if (!authUser) {
            IronSupabase.cache.currentUser = null;
            return { user: null, needsOnboarding: false, oauthUser: null };
        }

        const config = getAppConfig();
        const role = authUser.app_metadata?.role;

        if (role === "coach") {
            const trainees = await this.syncAllTrainees();
            await IronSupabase.loadCustomMeals();

            const impId = sessionStorage.getItem(this.IMPERSONATE_KEY);
            if (impId) {
                const target = trainees.find(t => t.id === impId);
                if (target) {
                    await IronSupabase.hydrateTraineeData(target.id);
                    const impUser = this.buildTraineeSessionUser(target, {
                        isImpersonating: true,
                        impersonatedBy: authUser.app_metadata?.username || "El_Coach"
                    });
                    IronSupabase.cache.currentUser = impUser;
                    return { user: impUser, needsOnboarding: false, oauthUser: null };
                }
                sessionStorage.removeItem(this.IMPERSONATE_KEY);
            }

            const coachUser = {
                role: "coach",
                id: authUser.id,
                name: config.coachInfo?.name || IronConfig.coachInfo.name,
                username: authUser.app_metadata?.username || "El_Coach",
                title: config.coachInfo?.title || IronConfig.coachInfo.title
            };
            IronSupabase.cache.currentUser = coachUser;
            return { user: coachUser, needsOnboarding: false, oauthUser: null };
        }

        // Trainee or new OAuth user
        const { data: clientRow, error: clientErr } = await sb
            .from("clients")
            .select("*")
            .eq("auth_user_id", authUser.id)
            .maybeSingle();

        if (!clientErr && clientRow) {
            const mapped = this.refreshSubscriptionStatus(IronSupabase.mapClientFromDb(clientRow));
            IronSupabase.cache.trainees = [mapped];
            await IronSupabase.hydrateTraineeData(mapped.id);
            const traineeUser = this.buildTraineeSessionUser(mapped);
            IronSupabase.cache.currentUser = traineeUser;
            return { user: traineeUser, needsOnboarding: false, oauthUser: null };
        }

        // OAuth user signed in via Google/Apple without a clients profile yet
        IronSupabase.cache.currentUser = null;
        return { user: null, needsOnboarding: true, oauthUser: authUser };
    },

    async login(usernameOrPhone, password) {
        const identifier = String(usernameOrPhone || "").trim();
        const cleanPass = String(password || "").trim();
        const invalidMsg = typeof IronI18n !== "undefined" ? IronI18n.t("login_invalid") : "بيانات الدخول غير صحيحة";

        if (!identifier || !cleanPass) {
            return { success: false, message: invalidMsg };
        }

        const sb = typeof IronSupabase !== "undefined" ? IronSupabase.initClient() : null;
        if (!sb) {
            return { success: false, message: "Supabase client is unavailable" };
        }

        const res = await IronSupabase.callFunction("auth-login", {
            action: "login",
            identifier,
            password: cleanPass
        });

        if (!res.ok || !res.data?.session?.access_token) {
            return { success: false, message: invalidMsg };
        }

        const { error: setErr } = await sb.auth.setSession({
            access_token: res.data.session.access_token,
            refresh_token: res.data.session.refresh_token
        });
        if (setErr) {
            return { success: false, message: setErr.message || invalidMsg };
        }

        sessionStorage.removeItem(this.IMPERSONATE_KEY);
        sessionStorage.removeItem("iron_active_workout");
        const initState = await this.initFromCloud();
        return { success: true, user: initState.user };
    },

    async sendPhoneOtp(phone, mode = "login") {
        return await IronSupabase.callFunction("auth-otp", {
            action: "send",
            mode,
            phone: String(phone || "").trim()
        });
    },

    async verifyPhoneOtp(phone, code, mode = "login") {
        const res = await IronSupabase.callFunction("auth-otp", {
            action: "verify",
            mode,
            phone: String(phone || "").trim(),
            code: String(code || "").trim()
        });

        if (!res.ok) return res;

        if (res.data?.session?.access_token) {
            const sb = IronSupabase.initClient();
            await sb.auth.setSession({
                access_token: res.data.session.access_token,
                refresh_token: res.data.session.refresh_token
            });
            sessionStorage.removeItem(this.IMPERSONATE_KEY);
            sessionStorage.removeItem("iron_active_workout");
            await this.initFromCloud();
        }
        return res;
    },

    async signInWithOAuth(provider) {
        const sb = typeof IronSupabase !== "undefined" ? IronSupabase.initClient() : null;
        if (!sb) return { error: { message: "Supabase unavailable" } };
        const oauthProvider = provider === "icloud" ? "apple" : provider;
        const redirectTo = `${window.location.origin}${window.location.pathname}`;
        return await sb.auth.signInWithOAuth({
            provider: oauthProvider,
            options: { redirectTo }
        });
    },

    async registerClient(data) {
        const sb = typeof IronSupabase !== "undefined" ? IronSupabase.initClient() : null;
        if (!sb) return { success: false, message: "Supabase unavailable" };

        const res = await IronSupabase.callFunction("auth-register", data);
        if (!res.ok || !res.data?.session?.access_token) {
            return { success: false, error: res.error, status: res.status };
        }

        const { error: setErr } = await sb.auth.setSession({
            access_token: res.data.session.access_token,
            refresh_token: res.data.session.refresh_token
        });
        if (setErr) return { success: false, error: setErr.message };

        sessionStorage.removeItem(this.IMPERSONATE_KEY);
        sessionStorage.removeItem("iron_active_workout");
        const state = await this.initFromCloud();
        return { success: true, user: state.user };
    },

    async completeOAuthClientProfile(data) {
        const sb = typeof IronSupabase !== "undefined" ? IronSupabase.initClient() : null;
        if (!sb) return { success: false, message: "Supabase unavailable" };

        const { data: userRes } = await sb.auth.getUser();
        const authUser = userRes?.user;
        if (!authUser) return { success: false, message: "Not authenticated" };

        const email = String(data.email || authUser.email || "").trim().toLowerCase();
        const phone = String(data.phone || "").trim();
        const phoneDigits = phone.replace(/\D/g, "");
        const name = String(data.name || authUser.user_metadata?.full_name || email.split("@")[0] || "Client").trim();

        const emailBase = email ? email.split("@")[0].replace(/[^a-z0-9_]/gi, "").toLowerCase() : "client";
        const uniqueUsername = `${emailBase || "client"}_${String(Date.now()).slice(-4)}`;

        const weight = parseFloat(data.weight) || 75;
        const height = parseFloat(data.height) || 175;
        const age = parseInt(data.age) || 26;
        const gender = data.gender === "female" ? "female" : "male";
        const activity = parseFloat(data.activity) || 1.55;
        const goal = data.goal || "تنشيف وخسارة دهون";
        const goalOffset = goal.includes("تضخيم") ? 350 : (goal.includes("تثبيت") || goal.includes("نحت")) ? 0 : -500;

        let targetCalories = 2000;
        let macros = { protein: Math.round(weight * 2), fats: 55, carbs: 200 };
        if (typeof IronCalculator !== "undefined") {
            const calc = IronCalculator.calculate({ gender, age, weight, height, activity, goal: goalOffset });
            targetCalories = calc.targetCalories;
            macros = { protein: calc.proteinGrams, fats: calc.fatGrams, carbs: calc.carbGrams };
        }

        const todayStr = new Date().toISOString().split("T")[0];
        const providerRaw = authUser.app_metadata?.provider || data.authProvider || "google";
        const authProvider = providerRaw === "apple" ? "icloud" : providerRaw;

        const { error } = await sb.from("clients").insert({
            auth_user_id: authUser.id,
            name,
            username: uniqueUsername,
            email,
            phone,
            phone_normalized: phoneDigits,
            auth_provider: authProvider,
            joined_date: todayStr,
            subscription_days: 0,
            has_activated_once: false,
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
        });

        if (error) {
            return { success: false, message: error.message };
        }

        const state = await this.initFromCloud();
        return { success: true, user: state.user };
    },

    async addTrainee(newTrainee) {
        const res = await IronSupabase.callFunction("coach-admin", {
            action: "create_client",
            client: newTrainee
        });
        if (!res.ok || !res.data?.client) {
            throw new Error(res.error || "Failed to add client");
        }
        const mapped = this.refreshSubscriptionStatus(IronSupabase.mapClientFromDb(res.data.client));
        IronSupabase.cache.trainees.unshift(mapped);
        return mapped;
    },

    async editTrainee(traineeId, fields) {
        const sb = typeof IronSupabase !== "undefined" ? IronSupabase.initClient() : null;
        if (!sb) return null;

        const trainees = this.getAllTrainees();
        const existing = trainees.find(t => t.id === traineeId);
        if (!existing) return null;

        const weight = parseFloat(fields.weight) || existing.weight;
        const height = parseFloat(fields.height) || existing.height || 175;
        const age = parseInt(fields.age) || existing.age || 26;
        const gender = fields.gender || existing.gender || "male";
        const activity = parseFloat(fields.activity) || existing.activity || 1.55;
        const goal = fields.goal || existing.goal;
        const calories = parseInt(fields.calories) || existing.calories || 2000;
        const program = fields.program || existing.program;
        const name = fields.name || existing.name;
        const username = (fields.username || existing.username).trim().toLowerCase();
        const phone = fields.phone !== undefined ? fields.phone : existing.phone;
        const coachNote = fields.coachNote !== undefined ? fields.coachNote.trim() : (existing.coachNote || "");

        const proteinGrams = Math.round(weight * 2.0);
        const fatGrams = Math.round((calories * 0.25) / 9);
        const carbGrams = Math.max(0, Math.round((calories - (proteinGrams * 4 + fatGrams * 9)) / 4));
        const macros = { protein: proteinGrams, fats: fatGrams, carbs: carbGrams };

        const updatePatch = {
            name,
            username,
            phone,
            phone_normalized: String(phone || "").replace(/\D/g, ""),
            weight,
            height,
            age,
            gender,
            activity,
            goal,
            calories,
            macros,
            program,
            coach_note: coachNote
        };

        if (fields.daysLeft !== undefined && fields.daysLeft !== "") {
            const targetDaysLeft = Math.max(0, parseInt(fields.daysLeft));
            updatePatch.joined_date = new Date().toISOString().split("T")[0];
            updatePatch.subscription_days = targetDaysLeft;
            if (targetDaysLeft > 0) updatePatch.has_activated_once = true;
        }

        const { data, error } = await sb
            .from("clients")
            .update(updatePatch)
            .eq("id", traineeId)
            .select("*")
            .single();

        if (error || !data) {
            throw new Error(error?.message || "Failed to update client");
        }

        if (fields.newPassword && fields.newPassword.trim() !== "") {
            const pwRes = await IronSupabase.callFunction("coach-admin", {
                action: "update_client_password",
                clientId: traineeId,
                newPassword: fields.newPassword.trim()
            });
            if (!pwRes.ok) {
                throw new Error(pwRes.error || "Failed to update client password");
            }
        }

        const mapped = this.refreshSubscriptionStatus(IronSupabase.mapClientFromDb(data));
        const idx = IronSupabase.cache.trainees.findIndex(t => t.id === traineeId);
        if (idx !== -1) IronSupabase.cache.trainees[idx] = mapped;
        return mapped;
    },

    async deleteTrainee(traineeId) {
        const res = await IronSupabase.callFunction("coach-admin", {
            action: "delete_client",
            clientId: traineeId
        });
        if (!res.ok) {
            throw new Error(res.error || "Failed to delete client");
        }
        const target = IronSupabase.cache.trainees.find(t => t.id === traineeId) || { id: traineeId };
        IronSupabase.cache.trainees = IronSupabase.cache.trainees.filter(t => t.id !== traineeId);
        return target;
    },

    async renewSubscription(traineeId, additionalDays = 30) {
        const sb = typeof IronSupabase !== "undefined" ? IronSupabase.initClient() : null;
        if (!sb) return null;

        const trainees = this.getAllTrainees();
        const trainee = trainees.find(t => t.id === traineeId);
        if (!trainee) return null;

        this.refreshSubscriptionStatus(trainee);
        const remaining = Math.max(0, parseInt(trainee.daysLeft) || 0);
        const totalDays = remaining + (parseInt(additionalDays) || 30);

        const patch = {
            joined_date: new Date().toISOString().split("T")[0],
            subscription_days: totalDays,
            has_activated_once: true
        };
        if (trainee.lastRenewalReceipt && typeof trainee.lastRenewalReceipt === "object") {
            patch.last_renewal_receipt = {
                ...trainee.lastRenewalReceipt,
                status: "approved",
                approvedAt: new Date().toISOString()
            };
        }

        const { data, error } = await sb
            .from("clients")
            .update(patch)
            .eq("id", traineeId)
            .select("*")
            .single();

        if (error || !data) {
            throw new Error(error?.message || "Failed to renew subscription");
        }

        const mapped = this.refreshSubscriptionStatus(IronSupabase.mapClientFromDb(data));
        const idx = IronSupabase.cache.trainees.findIndex(t => t.id === traineeId);
        if (idx !== -1) IronSupabase.cache.trainees[idx] = mapped;
        return mapped;
    },

    async submitRenewalReceipt(path, fileName, fileSize, clientId = null, planInfo = {}) {
        const res = await IronSupabase.callFunction("client-submit-receipt", {
            path,
            fileName,
            fileSize,
            clientId,
            planMonths: planInfo.months !== undefined ? Number(planInfo.months) : 1,
            planDays: Number(planInfo.days) || 30,
            planPrice: Number(planInfo.price) || 139
        });
        if (!res.ok || !res.data?.client) {
            throw new Error(res.error || "Failed to submit receipt");
        }
        const mapped = this.refreshSubscriptionStatus(IronSupabase.mapClientFromDb(res.data.client));
        this.syncLocalCachesWithTrainee(mapped);
        return mapped;
    },

    syncLocalCachesWithTrainee(updated) {
        if (!updated) return;
        const idx = IronSupabase.cache.trainees.findIndex(t => t.id === updated.id);
        if (idx !== -1) {
            IronSupabase.cache.trainees[idx] = updated;
        }
        const cur = IronSupabase.cache.currentUser;
        if (cur && cur.role === "trainee" && cur.id === updated.id) {
            cur.name = updated.name;
            cur.username = updated.username;
            cur.status = updated.status;
            cur.daysLeft = updated.daysLeft;
            cur.traineeData = updated;
        }
    },

    updateTrainee(traineeOrId, patchFields = null) {
        const targetId = typeof traineeOrId === "string" ? traineeOrId : traineeOrId?.id;
        if (!targetId) return null;

        const trainees = this.getAllTrainees();
        const existing = trainees.find(t => t.id === targetId)
            || (IronSupabase.cache.currentUser?.id === targetId ? IronSupabase.cache.currentUser.traineeData : null);
        if (!existing) return null;

        const updated = typeof traineeOrId === "string"
            ? { ...existing, ...(patchFields || {}) }
            : { ...existing, ...traineeOrId };

        this.refreshSubscriptionStatus(updated);
        this.syncLocalCachesWithTrainee(updated);

        // Persist allowed fields to Supabase clients table in background
        this.persistTraineeFields(updated).catch(err => {
            console.error("persistTraineeFields error:", err);
        });

        return updated;
    },

    async persistTraineeFields(trainee) {
        const sb = typeof IronSupabase !== "undefined" ? IronSupabase.initClient() : null;
        if (!sb || !trainee?.id) return null;

        const { data, error } = await sb
            .from("clients")
            .update({
                name: trainee.name,
                phone: trainee.phone || "",
                phone_normalized: String(trainee.phone || "").replace(/\D/g, ""),
                weight: Number(trainee.weight) || 75,
                height: Number(trainee.height) || 175,
                age: Number(trainee.age) || 26,
                gender: trainee.gender === "female" ? "female" : "male",
                activity: Number(trainee.activity) || 1.55,
                goal: trainee.goal || "تنشيف وخسارة دهون",
                calories: parseInt(trainee.calories) || 2000,
                macros: trainee.macros || { protein: 150, fats: 55, carbs: 200 },
                program: trainee.program || "PPL (Push Pull Legs)",
                avatar_url: trainee.avatar || "",
                history: Array.isArray(trainee.history) ? trainee.history : []
            })
            .eq("id", trainee.id)
            .select("*")
            .single();

        if (error) throw error;
        if (data) {
            const mapped = this.refreshSubscriptionStatus(IronSupabase.mapClientFromDb(data));
            this.syncLocalCachesWithTrainee(mapped);
            return mapped;
        }
        return trainee;
    },

    async changeCoachPassword(newPassword) {
        const res = await IronSupabase.callFunction("coach-admin", {
            action: "change_coach_password",
            newPassword
        });
        if (!res.ok) throw new Error(res.error || "Failed to update password");
        return true;
    },

    impersonateTrainee(id) {
        if (!id) return;
        sessionStorage.setItem(this.IMPERSONATE_KEY, id);
        sessionStorage.removeItem("iron_active_workout");
        window.location.reload();
    },

    returnToCoachDashboard() {
        sessionStorage.removeItem(this.IMPERSONATE_KEY);
        sessionStorage.removeItem("iron_active_workout");
        window.location.reload();
    },

    async logout() {
        sessionStorage.removeItem(this.IMPERSONATE_KEY);
        sessionStorage.removeItem("iron_active_workout");
        try {
            const sb = typeof IronSupabase !== "undefined" ? IronSupabase.initClient() : null;
            if (sb) await sb.auth.signOut();
        } catch {}
        if (typeof IronSupabase !== "undefined") {
            IronSupabase.cache.currentUser = null;
            IronSupabase.cache.trainees = [];
            IronSupabase.cache.savedDiets = {};
            IronSupabase.cache.waterLogs = {};
            IronSupabase.cache.workoutLogs = [];
        }
        window.location.reload();
    },

    async exportBackupData() {
        if (typeof IronSupabase !== "undefined") {
            return await IronSupabase.exportAllCloudBackup();
        }
        return null;
    },

    async importBackupData(payload) {
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        if (!payload || !Array.isArray(payload.trainees)) {
            return { success: false, message: isEn ? "Invalid or corrupted backup JSON file" : "ملف النسخة الاحتياطية غير صالح أو تالف" };
        }
        const res = await IronSupabase.callFunction("coach-admin", {
            action: "import_backup",
            payload
        });
        if (!res.ok) {
            return { success: false, message: res.error || (isEn ? "Backup restore failed" : "فشلت استعادة النسخة الاحتياطية") };
        }
        await loadAppConfigFromCloud();
        await this.syncAllTrainees();
        return { success: true, count: res.data?.count ?? payload.trainees.length };
    }
};
