/**
 * IronCoach Pro - Supabase Client & Cloud Data Adapter
 * طبقة الاتصال السحابي بـ Supabase (Auth + Postgres + Edge Functions + Storage)
 */

const SUPABASE_URL = "https://kqfbdnlkehavexjggcry.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_y6VeSYs67n9AzncMSDsmag_D0sKo3W3";

const IronSupabase = {
    url: SUPABASE_URL,
    publishableKey: SUPABASE_PUBLISHABLE_KEY,
    client: null,

    cache: {
        appConfig: null,
        trainees: [],
        currentUser: null,
        savedDiets: {},
        waterLogs: {},
        workoutLogs: [],
        customMeals: []
    },

    initClient() {
        if (this.client) return this.client;
        if (typeof window !== "undefined" && window.supabase && typeof window.supabase.createClient === "function") {
            this.client = window.supabase.createClient(this.url, this.publishableKey, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true
                }
            });
        }
        return this.client;
    },

    isAvailable() {
        return Boolean(this.initClient());
    },

    async getAccessToken() {
        const sb = this.initClient();
        if (!sb) return null;
        try {
            const { data } = await sb.auth.getSession();
            return data?.session?.access_token || null;
        } catch {
            return null;
        }
    },

    async callFunction(fnName, payload = {}) {
        const token = await this.getAccessToken();
        const headers = {
            "Content-Type": "application/json",
            "apikey": this.publishableKey
        };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const res = await fetch(`${this.url}/functions/v1/${fnName}`, {
            method: "POST",
            headers,
            body: JSON.stringify(payload)
        });
        let data = null;
        try {
            data = await res.json();
        } catch {
            data = null;
        }
        if (!res.ok) {
            return { ok: false, status: res.status, data, error: data?.error || `HTTP_${res.status}` };
        }
        return { ok: true, status: res.status, data, error: null };
    },

    mapClientFromDb(row) {
        if (!row) return null;
        return {
            id: row.id,
            authUserId: row.auth_user_id,
            legacyKey: row.legacy_key || null,
            name: row.name || "",
            username: row.username || "",
            email: row.email || "",
            phone: row.phone || "",
            authProvider: row.auth_provider || "phone",
            joinedDate: row.joined_date || new Date().toISOString().split("T")[0],
            subscriptionDays: Number(row.subscription_days ?? 0),
            daysLeft: Number(row.subscription_days ?? 0),
            hasActivatedOnce: Boolean(row.has_activated_once),
            status: "active",
            weight: Number(row.weight ?? 75),
            height: Number(row.height ?? 175),
            age: Number(row.age ?? 26),
            gender: row.gender === "female" ? "female" : "male",
            activity: Number(row.activity ?? 1.55),
            goal: row.goal || "تنشيف وخسارة دهون",
            calories: Number(row.calories ?? 2000),
            macros: row.macros || { protein: 150, fats: 55, carbs: 200 },
            program: row.program || "PPL (Push Pull Legs)",
            coachNote: row.coach_note || "",
            avatar: row.avatar_url || "",
            lastRenewalReceipt: row.last_renewal_receipt || null,
            history: Array.isArray(row.history) ? row.history : []
        };
    },

    mapSettingsFromDb(row) {
        const base = typeof IronConfig !== "undefined" ? IronConfig : { appName: "أيرون كوتش", appVersion: "2.2.0", coachInfo: {}, subscriptionPrice: {} };
        if (!row) {
            return {
                appName: base.appName,
                appVersion: base.appVersion,
                coachInfo: { ...base.coachInfo },
                subscriptionPrice: { ...base.subscriptionPrice }
            };
        }
        return {
            appName: base.appName,
            appVersion: base.appVersion,
            coachInfo: {
                ...base.coachInfo,
                name: row.coach_name || base.coachInfo.name,
                title: row.coach_title || base.coachInfo.title,
                phone: row.coach_phone || base.coachInfo.phone,
                whatsapp: row.coach_whatsapp || base.coachInfo.whatsapp,
                vodafoneCash: row.vodafone_cash || base.coachInfo.vodafoneCash,
                instapayUser: row.instapay_user || base.coachInfo.instapayUser,
                stcPay: row.stc_pay || base.coachInfo.stcPay,
                bankName: row.bank_name || base.coachInfo.bankName,
                bankIban: row.bank_iban || base.coachInfo.bankIban,
                paymentLink: row.payment_link || base.coachInfo.paymentLink
            },
            subscriptionPrice: {
                monthly: Number(row.monthly_price ?? 500),
                currency: row.currency || "ج.م / ر.س",
                defaultDurationDays: Number(row.default_duration_days ?? 30)
            }
        };
    },

    async loadAppSettings() {
        const sb = this.initClient();
        if (!sb) return null;
        try {
            const { data, error } = await sb
                .from("app_settings")
                .select("*")
                .eq("id", 1)
                .maybeSingle();
            if (!error && data) {
                const mapped = this.mapSettingsFromDb(data);
                this.cache.appConfig = mapped;
                return mapped;
            }
        } catch (err) {
            console.warn("Failed to load app_settings:", err);
        }
        return null;
    },

    async saveAppSettings(configObj) {
        const sb = this.initClient();
        if (!sb) return { error: "Supabase unavailable" };
        const ci = configObj.coachInfo || {};
        const sp = configObj.subscriptionPrice || {};
        const payload = {
            id: 1,
            coach_name: ci.name || "",
            coach_title: ci.title || "",
            coach_phone: ci.phone || "",
            coach_whatsapp: ci.whatsapp || "",
            vodafone_cash: ci.vodafoneCash || "",
            instapay_user: ci.instapayUser || "",
            stc_pay: ci.stcPay || "",
            bank_name: ci.bankName || "",
            bank_iban: ci.bankIban || "",
            payment_link: ci.paymentLink || "",
            monthly_price: parseInt(sp.monthly) || 500,
            currency: sp.currency || "ج.م / ر.س",
            default_duration_days: parseInt(sp.defaultDurationDays) || 30
        };
        const { data, error } = await sb
            .from("app_settings")
            .upsert(payload, { onConflict: "id" })
            .select("*")
            .single();
        if (!error && data) {
            this.cache.appConfig = this.mapSettingsFromDb(data);
        }
        return { data, error };
    },

    async loadCustomMeals() {
        const sb = this.initClient();
        if (!sb) return [];
        const { data, error } = await sb
            .from("custom_meals")
            .select("*")
            .order("created_at", { ascending: true });
        if (!error && Array.isArray(data)) {
            this.cache.customMeals = data.map(row => ({
                id: row.id,
                ownerId: row.is_coach_meal ? "coach" : row.client_id,
                name: row.name,
                category: row.category,
                ingredients: row.ingredients,
                calories: Number(row.calories) || 300,
                protein: Number(row.protein) || 20,
                carbs: Number(row.carbs) || 30,
                fats: Number(row.fats) || 10,
                img: row.img || "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500"
            }));
        }
        return this.cache.customMeals;
    },

    async insertCustomMeal(meal, user) {
        const sb = this.initClient();
        if (!sb) return null;
        const isTrainee = user && user.role === "trainee" && user.id;
        const rowPayload = {
            client_id: isTrainee ? user.id : null,
            auth_user_id: isTrainee ? (user.traineeData?.authUserId || null) : (await sb.auth.getUser()).data?.user?.id || null,
            is_coach_meal: !isTrainee,
            name: meal.name,
            category: meal.category,
            ingredients: meal.ingredients,
            calories: parseInt(meal.calories) || 300,
            protein: Number(meal.protein) || 20,
            carbs: Number(meal.carbs) || 30,
            fats: Number(meal.fats) || 10,
            img: meal.img || ""
        };
        const { data, error } = await sb.from("custom_meals").insert(rowPayload).select("*").single();
        if (error || !data) {
            console.error("insertCustomMeal error:", error);
            return null;
        }
        const mapped = {
            id: data.id,
            ownerId: data.is_coach_meal ? "coach" : data.client_id,
            name: data.name,
            category: data.category,
            ingredients: data.ingredients,
            calories: Number(data.calories) || 300,
            protein: Number(data.protein) || 20,
            carbs: Number(data.carbs) || 30,
            fats: Number(data.fats) || 10,
            img: data.img || "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500"
        };
        this.cache.customMeals.push(mapped);
        return mapped;
    },

    async hydrateTraineeData(clientId) {
        const sb = this.initClient();
        if (!sb || !clientId) return;
        const today = new Date().toISOString().split("T")[0];

        const [dietRes, waterRes, workoutRes, mealsRes] = await Promise.all([
            sb.from("saved_diets").select("*").eq("client_id", clientId).maybeSingle(),
            sb.from("water_logs").select("*").eq("client_id", clientId).eq("log_date", today).maybeSingle(),
            sb.from("workout_logs").select("*").eq("client_id", clientId).order("logged_at", { ascending: false }).limit(100),
            this.loadCustomMeals()
        ]);

        if (!dietRes.error && dietRes.data?.plan) {
            this.cache.savedDiets[clientId] = {
                ...dietRes.data.plan,
                targetCaloriesSnapshot: Number(dietRes.data.target_calories_snapshot) || 2000
            };
        } else {
            delete this.cache.savedDiets[clientId];
        }

        const waterKey = `${clientId}_${today}`;
        if (!waterRes.error && waterRes.data) {
            this.cache.waterLogs[waterKey] = Number(waterRes.data.cups) || 0;
        } else {
            this.cache.waterLogs[waterKey] = 0;
        }

        if (!workoutRes.error && Array.isArray(workoutRes.data)) {
            this.cache.workoutLogs = workoutRes.data.map(row => ({
                id: row.id,
                traineeId: row.client_id,
                date: row.logged_at,
                programId: row.program_id,
                programName: row.program_name,
                dayTitle: row.day_title,
                completedSets: Number(row.completed_sets) || 0,
                totalSets: Number(row.total_sets) || 0,
                totalVolumeKg: Number(row.total_volume_kg) || 0,
                completedExercises: Array.isArray(row.completed_exercises) ? row.completed_exercises : []
            }));
        }

        void mealsRes;
    },

    async saveDietPlan(clientId, authUserId, plan, targetCalSnapshot) {
        const sb = this.initClient();
        if (!sb || !clientId) return;
        this.cache.savedDiets[clientId] = {
            ...plan,
            targetCaloriesSnapshot: targetCalSnapshot || 2000
        };
        const { error } = await sb.from("saved_diets").upsert({
            client_id: clientId,
            auth_user_id: authUserId || null,
            plan,
            target_calories_snapshot: parseInt(targetCalSnapshot) || 2000
        }, { onConflict: "client_id" });
        if (error) console.error("saveDietPlan error:", error);
    },

    async saveWaterLog(clientId, authUserId, dateStr, cups) {
        const sb = this.initClient();
        if (!sb || !clientId) return;
        const cleanCups = Math.max(0, parseInt(cups) || 0);
        this.cache.waterLogs[`${clientId}_${dateStr}`] = cleanCups;
        const { error } = await sb.from("water_logs").upsert({
            client_id: clientId,
            auth_user_id: authUserId || null,
            log_date: dateStr,
            cups: cleanCups
        }, { onConflict: "client_id,log_date" });
        if (error) console.error("saveWaterLog error:", error);
    },

    async insertWorkoutLog(entry, authUserId) {
        const sb = this.initClient();
        if (!sb || !entry?.traineeId) return;
        this.cache.workoutLogs.unshift(entry);
        let resolvedAuthId = authUserId || null;
        if (!resolvedAuthId) {
            try {
                const { data: uData } = await sb.auth.getUser();
                resolvedAuthId = uData?.user?.id || null;
            } catch {}
        }
        const { data, error } = await sb.from("workout_logs").insert({
            client_id: entry.traineeId,
            auth_user_id: resolvedAuthId,
            logged_at: entry.date || new Date().toISOString(),
            program_id: entry.programId || "",
            program_name: entry.programName || "",
            day_title: entry.dayTitle || "",
            completed_sets: parseInt(entry.completedSets) || 0,
            total_sets: parseInt(entry.totalSets) || 0,
            total_volume_kg: Number(entry.totalVolumeKg) || 0,
            completed_exercises: Array.isArray(entry.completedExercises) ? entry.completedExercises : []
        }).select("*").single();
        if (!error && data) {
            entry.id = data.id;
        } else if (error) {
            console.error("insertWorkoutLog error:", error);
        }
    },

    async deleteWorkoutLog(logId) {
        const sb = this.initClient();
        this.cache.workoutLogs = this.cache.workoutLogs.filter(l => l.id !== logId);
        if (!sb || !logId || String(logId).startsWith("log_")) return true;
        const { error } = await sb.from("workout_logs").delete().eq("id", logId);
        if (error) {
            console.error("deleteWorkoutLog error:", error);
            return false;
        }
        return true;
    },

    async resetClientWorkoutLogs(clientId, dayTitle = null) {
        const sb = this.initClient();
        if (!clientId) return false;
        if (dayTitle) {
            this.cache.workoutLogs = this.cache.workoutLogs.filter(l => !(l.traineeId === clientId && l.dayTitle === dayTitle));
        } else {
            this.cache.workoutLogs = this.cache.workoutLogs.filter(l => l.traineeId !== clientId);
        }
        if (!sb) return true;
        let query = sb.from("workout_logs").delete().eq("client_id", clientId);
        if (dayTitle) {
            query = query.eq("day_title", dayTitle);
        }
        const { error } = await query;
        if (error) {
            console.error("resetClientWorkoutLogs error:", error);
            return false;
        }
        return true;
    },

    async uploadAvatarBlob(authUserId, blob) {
        const sb = this.initClient();
        if (!sb || !authUserId || !blob) return null;
        const path = `${authUserId}/avatar.jpg`;
        const { error } = await sb.storage.from("avatars").upload(path, blob, {
            contentType: "image/jpeg",
            upsert: true
        });
        if (error) {
            console.error("uploadAvatarBlob error:", error);
            return null;
        }
        const { data } = sb.storage.from("avatars").getPublicUrl(path);
        return data?.publicUrl ? `${data.publicUrl}?t=${Date.now()}` : null;
    },

    async removeAvatarFiles(authUserId) {
        const sb = this.initClient();
        if (!sb || !authUserId) return;
        await sb.storage.from("avatars").remove([`${authUserId}/avatar.jpg`]).catch(() => {});
    },

    async uploadReceiptFile(authUserId, file) {
        const sb = this.initClient();
        if (!sb || !authUserId || !file) return { path: null, error: "Invalid file" };
        const safeName = String(file.name || "receipt.jpg").replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${authUserId}/${Date.now()}_${safeName}`;
        const { error } = await sb.storage.from("receipts").upload(path, file, {
            contentType: file.type || "image/jpeg",
            upsert: false
        });
        if (error) return { path: null, error: error.message };
        return { path, error: null };
    },

    async getSignedReceiptUrl(path) {
        const sb = this.initClient();
        if (!sb || !path) return null;
        const { data, error } = await sb.storage.from("receipts").createSignedUrl(path, 300);
        if (error) {
            console.error("getSignedReceiptUrl error:", error);
            return null;
        }
        return data?.signedUrl || null;
    },

    async exportAllCloudBackup() {
        const sb = this.initClient();
        if (!sb) return null;
        const [settingsRes, clientsRes, mealsRes, workoutsRes, dietsRes, waterRes] = await Promise.all([
            sb.from("app_settings").select("*").eq("id", 1).maybeSingle(),
            sb.from("clients").select("*").order("created_at", { ascending: true }),
            sb.from("custom_meals").select("*"),
            sb.from("workout_logs").select("*").order("logged_at", { ascending: false }).limit(500),
            sb.from("saved_diets").select("*"),
            sb.from("water_logs").select("*")
        ]);

        const trainees = (clientsRes.data || []).map(r => this.mapClientFromDb(r));
        const savedDiets = {};
        (dietsRes.data || []).forEach(d => {
            savedDiets[d.client_id] = {
                ...(d.plan || {}),
                targetCaloriesSnapshot: Number(d.target_calories_snapshot) || 2000
            };
        });
        const waterLogs = {};
        (waterRes.data || []).forEach(w => {
            waterLogs[`${w.client_id}_${w.log_date}`] = Number(w.cups) || 0;
        });
        const workoutLogs = (workoutsRes.data || []).map(w => ({
            id: w.id,
            traineeId: w.client_id,
            date: w.logged_at,
            programId: w.program_id,
            programName: w.program_name,
            dayTitle: w.day_title,
            completedSets: Number(w.completed_sets) || 0,
            totalSets: Number(w.total_sets) || 0,
            totalVolumeKg: Number(w.total_volume_kg) || 0,
            completedExercises: Array.isArray(w.completed_exercises) ? w.completed_exercises : []
        }));
        const customMeals = (mealsRes.data || []).map(m => ({
            id: m.id,
            ownerId: m.is_coach_meal ? "coach" : m.client_id,
            name: m.name,
            category: m.category,
            ingredients: m.ingredients,
            calories: Number(m.calories) || 300,
            protein: Number(m.protein) || 20,
            carbs: Number(m.carbs) || 30,
            fats: Number(m.fats) || 10,
            img: m.img || ""
        }));

        return {
            app: "IronCoach Pro",
            version: "3.0.0-cloud",
            exportedAt: new Date().toISOString(),
            config: this.mapSettingsFromDb(settingsRes.data),
            trainees,
            customMeals,
            workoutLogs,
            savedDiets,
            waterLogs
        };
    }
};
