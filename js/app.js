/**
 * IronCoach Pro - Main Application Controller (v2.2)
 * المتحكم الرئيسي للتطبيق، إدارة النمط (داكن/فاتح)، التبويبات، والميزات التفاعلية
 */

// أدوات مساعدة عامة للنوافذ المنبثقة والإشعارات مع قفل تمرير الخلفية
function openModal(id) {
    const m = document.getElementById(id);
    if (m) {
        m.classList.add("active");
        document.body.classList.add("modal-open");
    }
}

function closeModal(id) {
    const m = document.getElementById(id);
    if (m) {
        m.classList.remove("active");
    }
    const anyActive = document.querySelector(".modal-overlay.active");
    if (!anyActive) {
        document.body.classList.remove("modal-open");
    }
}

function showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    const icon = type === "success" ? "✅" : "⚠️";
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(10px)";
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

const IronApp = {
    currentTab: "overview",
    selectedProgramId: "prog_ppl",
    currentDayDiet: null,
    currentMealCategory: "all",
    currentExerciseMuscle: "all",
    calcManuallyEdited: false,

    t(key, vars = {}) {
        return typeof IronI18n !== "undefined" ? IronI18n.t(key, vars) : key;
    },

    async init() {
        // 1. تهيئة النمط (الداكن / الفاتح) واللغة (العربية / الإنجليزية) وكود الاتصال المحفوظ
        this.initTheme();
        this.initLanguage();
        this.initDialCodeSelectors();
        this.initEventListeners();

        // 2. تحميل إعدادات الكوتش والدفع من Supabase وجلب الجلسة السحابية
        await loadAppConfigFromCloud();
        const cloudState = await IronAuth.initFromCloud();

        if (cloudState?.needsOnboarding && cloudState.oauthUser) {
            const oauthUser = cloudState.oauthUser;
            const prov = oauthUser.app_metadata?.provider === "apple" ? "icloud" : (oauthUser.app_metadata?.provider || "google");
            this.renderUserHeader(null);
            this.updateImpersonationBanner(null);
            this.renderAppViews(null);
            this.switchAuthMode("signup");
            this.signupState.isOAuthOnboarding = true;
            this.signupState.provider = prov;
            this.signupState.verifiedName = oauthUser.user_metadata?.full_name || oauthUser.user_metadata?.name || "";
            this.signupState.verifiedEmail = oauthUser.email || "";
            this.signupState.verifiedPhone = oauthUser.phone || "";
            this.enterSignupProfileStep();
        } else {
            const user = cloudState?.user || null;
            this.renderUserHeader(user);
            this.updateImpersonationBanner(user);
            this.renderAppViews(user);
        }

        // تحديث حالة الاشتراك عند العودة للتطبيق بعد غياب
        document.addEventListener("visibilitychange", async () => {
            if (!document.hidden) {
                const state = await IronAuth.initFromCloud();
                const currentUser = state?.user || null;
                if (currentUser && currentUser.role === "trainee") {
                    this.renderUserHeader(currentUser);
                    this.renderTraineeData(currentUser.traineeData);
                }
            }
        });
    },

    // =========================================================================
    // إدارة اللغة (العربية RTL / الإنجليزية LTR)
    // =========================================================================
    initLanguage() {
        const savedLang = localStorage.getItem("iron_lang") === "en" ? "en" : "ar";
        this.applyLanguage(savedLang, false);
    },

    toggleLanguage() {
        const current = typeof IronI18n !== "undefined" ? IronI18n.getLang() : "ar";
        const next = current === "ar" ? "en" : "ar";
        this.applyLanguage(next, true);
    },

    applyLanguage(lang, notify = false) {
        const cleanLang = lang === "en" ? "en" : "ar";
        localStorage.setItem("iron_lang", cleanLang);

        if (typeof IronI18n !== "undefined") {
            IronI18n.applyStaticTranslations();
        }

        // تحديث زر الثيم حسب اللغة الحالية
        this.applyTheme(this.getCurrentTheme(), false);

        const user = typeof IronAuth !== "undefined" ? IronAuth.getCurrentUser() : null;
        if (user !== undefined) {
            this.renderUserHeader(user);
            this.updateImpersonationBanner(user);
            if (!user) {
                this.refreshSignupHeaderLabels();
            } else if (user.role === "coach" && typeof IronCoachPanel !== "undefined") {
                IronCoachPanel.renderCoachDashboard();
            } else if (user.role === "trainee") {
                if (user.status === "expired" || user.status === "pending") {
                    this.renderAppViews(user);
                } else if (user.traineeData) {
                    this.renderTraineeData(user.traineeData);
                }
            }
        }

        const gymModal = document.getElementById("liveGymModal");
        if (gymModal && gymModal.classList.contains("active") && typeof IronLiveGym !== "undefined" && (IronLiveGym.currentWorkout || IronLiveGym.activeSession)) {
            IronLiveGym.renderLiveGymModal();
        }

        if (notify) {
            showToast(this.t("lang_switched"), "success");
        }
    },

    // =========================================================================
    // إدارة النمطين الداكن والفاتح (Dark & Light Theme Controller)
    // =========================================================================
    getCurrentTheme() {
        return document.documentElement.getAttribute("data-theme") || localStorage.getItem("iron_theme") || "dark";
    },

    initTheme() {
        const savedTheme = localStorage.getItem("iron_theme") || "dark";
        this.applyTheme(savedTheme, false);
    },

    toggleTheme() {
        const current = this.getCurrentTheme();
        const next = current === "dark" ? "light" : "dark";
        this.applyTheme(next, true);
    },

    applyTheme(theme, notify = false) {
        const cleanTheme = theme === "light" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", cleanTheme);
        localStorage.setItem("iron_theme", cleanTheme);

        // تحديث لون شريط المتصفح في الموبايل
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.setAttribute("content", cleanTheme === "light" ? "#ffffff" : "#070a12");
        }

        // تحديث زر التبديل في الترويسة
        const iconEl = document.getElementById("themeToggleIcon");
        const labelEl = document.getElementById("themeToggleLabel");
        if (iconEl) {
            iconEl.innerText = cleanTheme === "light" ? "🌙" : "☀️";
        }
        if (labelEl) {
            labelEl.innerText = cleanTheme === "light" ? this.t("theme_to_dark") : this.t("theme_to_light");
        }

        if (notify) {
            const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
            const msg = cleanTheme === "light"
                ? (isEn ? "Switched to Light Mode ☀️" : "تم التبديل إلى النمط الفاتح ☀️")
                : (isEn ? "Switched to Luxury Dark Mode 🌙" : "تم التبديل إلى النمط الداكن الفاخر 🌙");
            showToast(msg, "success");
        }
    },

    // توليد صورة SVG بديلة تتكيف مع النمط الفاتح والداكن
    getExerciseFallbackSvg(muscle = "تمرين") {
        const isLight = this.getCurrentTheme() === "light";
        const bg = isLight ? "#f1f5f9" : "#070a12";
        const stroke = isLight ? "#059669" : "#10b981";
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="${bg}"/><circle cx="150" cy="135" r="55" fill="${stroke}" fill-opacity="0.12" stroke="${stroke}" stroke-width="2"/><text x="150" y="148" text-anchor="middle" font-size="42">🏋️‍♂️</text><text x="150" y="230" text-anchor="middle" fill="${stroke}" font-family="Cairo, sans-serif" font-weight="800" font-size="18">${muscle}</text></svg>`;
        return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
    },

    getMealFallbackSvg(category = "وجبة صحية") {
        const isLight = this.getCurrentTheme() === "light";
        const bg = isLight ? "#f1f5f9" : "#090d16";
        const stroke = isLight ? "#059669" : "#10b981";
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"><rect width="400" height="260" fill="${bg}"/><circle cx="200" cy="115" r="48" fill="${stroke}" fill-opacity="0.12" stroke="${stroke}" stroke-width="2"/><text x="200" y="128" text-anchor="middle" font-size="38">🥗</text><text x="200" y="205" text-anchor="middle" fill="${stroke}" font-family="Cairo, sans-serif" font-weight="800" font-size="16">${category}</text></svg>`;
        return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
    },

    resolveProgramIdFromName(programName = "") {
        const p = String(programName).toLowerCase();
        if (p.includes("ppl") && (p.includes("upper") || p.includes("علوي"))) return "prog_ppl_upper_lower";
        if (p.includes("ppl") && (p.includes("bulk") || p.includes("تضخيم") || p.includes("hypertrophy") || p.includes("3x10") || p.includes("3×10") || p.includes("3*10"))) return "prog_ppl_bulk";
        if (p.includes("upper") || p.includes("علوي")) return "prog_upper_lower";
        if (p.includes("arnold") || p.includes("آرنولد")) return "prog_arnold";
        if (p.includes("bro") || p.includes("برو")) return "prog_bro";
        if (p.includes("anterior") || p.includes("أمامية")) return "prog_anterior_posterior";
        if (p.includes("full") || p.includes("كامل")) return "prog_ppl_upper_lower";
        return "prog_ppl";
    },

    // إظهار شريط المعاينة للكوتش فقط أثناء معاينة حساب أحد المتدربين (يُخفى تماماً عن العملاء)
    updateImpersonationBanner(user) {
        const banner = document.getElementById("impersonatingBanner");
        const nameEl = document.getElementById("impersonatingTraineeName");
        if (!banner) return;
        if (user && user.role === "trainee" && user.isImpersonating) {
            const displayName = typeof IronI18n !== "undefined" ? IronI18n.trName(user.traineeData || user) : user.name;
            if (nameEl) nameEl.innerText = `${displayName} (@${user.username})`;
            banner.classList.remove("hidden");
        } else {
            banner.classList.add("hidden");
        }
    },

    // رسم شريط المستخدم العلوي (متجاوب يظهر حالة الاشتراك على الهواتف والحواسيب مع الصورة الشخصية للمشترك)
    renderUserHeader(user) {
        const area = document.getElementById("userHeaderArea");
        if (!area) return;

        if (!user) {
            area.innerHTML = `
                <button onclick="IronApp.showAuthScreen()" class="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-emerald-500 text-slate-950 font-black text-[11px] sm:text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition whitespace-nowrap">
                    ${this.t("btn_login")}
                </button>
            `;
            return;
        }

        if (user.role === "coach") {
            area.innerHTML = `
                <div class="flex items-center gap-1.5 sm:gap-3">
                    <button onclick="IronAuth.logout()" class="px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold text-[11px] sm:text-xs rounded-xl border border-slate-700 transition whitespace-nowrap">
                        ${this.t("btn_logout")} 🚪
                    </button>
                </div>
            `;
        } else {
            const displayName = typeof IronI18n !== "undefined" ? IronI18n.trName(user.traineeData || user) : user.name;
            const statusColor = user.status === "active" ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                : (user.status === "expiring" || user.status === "pending") ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
                : "text-rose-400 border-rose-500/30 bg-rose-500/10";

            const statusText = user.status === "active" ? this.t("status_active", { days: user.daysLeft })
                : user.status === "expiring" ? this.t("status_expiring", { days: user.daysLeft })
                : user.status === "pending" ? this.t("status_pending")
                : this.t("status_expired");

            const avatarData = user.traineeData?.avatar;
            const initial = (displayName || "U").trim().charAt(0).toUpperCase();
            const headerAvatar = avatarData
                ? `<img src="${avatarData}" alt="${displayName}" class="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-emerald-500/50 cursor-pointer flex-shrink-0" onclick="document.getElementById('traineeAvatarInput')?.click()" title="${this.t("avatar_change")}">`
                : `<button type="button" onclick="document.getElementById('traineeAvatarInput')?.click()" class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-xs flex-shrink-0 hover:bg-emerald-500/25 transition" title="${this.t("avatar_add")}">${initial}</button>`;

            area.innerHTML = `
                <div class="flex items-center justify-end flex-wrap gap-1.5 sm:gap-2.5">
                    ${user.isImpersonating ? `
                        <button onclick="IronAuth.returnToCoachDashboard()" class="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 font-black text-[10px] sm:text-[11px] rounded-xl transition flex items-center gap-1 whitespace-nowrap">
                            <span>${this.t("back_to_coach")}</span>
                        </button>
                    ` : ''}
                    ${headerAvatar}
                    <div class="text-end min-w-0">
                        <div class="text-[11px] sm:text-xs font-black text-white truncate max-w-[85px] sm:max-w-[160px]">${displayName}</div>
                        <div class="text-[9px] sm:text-[10px] ${statusColor} px-1.5 sm:px-2 py-0.5 rounded-full border inline-block font-bold whitespace-nowrap">
                            ${statusText}
                        </div>
                    </div>
                    <button onclick="IronApp.openRenewPaymentModal()" class="px-2 sm:px-2.5 py-1 sm:py-1.5 ${(user.status === "expired" || user.status === "pending") ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600 animate-pulse' : 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 shadow-md shadow-amber-500/25'} font-black text-[11px] sm:text-xs rounded-xl transition whitespace-nowrap">
                        ${this.t("status_renew_short")}
                    </button>
                    <button onclick="IronAuth.logout()" class="px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold text-[11px] sm:text-xs rounded-xl border border-slate-700 transition whitespace-nowrap">
                        <span class="hidden sm:inline">${this.t("btn_logout")}</span> 🚪
                    </button>
                </div>
            `;
        }
    },

    // رسم واجهات التطبيق بناءً على نوع الحساب والحالة
    renderAppViews(user) {
        const authView = document.getElementById("authView");
        const expiredView = document.getElementById("expiredView");
        const coachDashboardView = document.getElementById("coachDashboardView");
        const traineeAppContainer = document.getElementById("traineeAppContainer");
        const desktopNav = document.getElementById("desktopNav");
        const mobileNav = document.querySelector(".mobile-bottom-nav");

        const cloudLoader = document.getElementById("cloudLoadingState");
        if (cloudLoader) cloudLoader.classList.add("hidden");

        authView.classList.add("hidden");
        expiredView.classList.add("hidden");
        coachDashboardView.classList.add("hidden");
        traineeAppContainer.classList.add("hidden");

        if (desktopNav) desktopNav.style.display = "none";
        if (mobileNav) mobileNav.classList.add("hidden");

        if (!user) {
            authView.classList.remove("hidden");
            return;
        }

        // 1. إذا كان الكوتش
        if (user.role === "coach") {
            coachDashboardView.classList.remove("hidden");
            IronCoachPanel.renderCoachDashboard();
            return;
        }

        // 2. إذا كان متدرب منتهي الاشتراك أو حساب جديد بانتظار الدفع والتفعيل
        if (user.status === "expired" || user.status === "pending") {
            expiredView.classList.remove("hidden");
            const config = getAppConfig();
            const isPending = user.status === "pending";
            document.getElementById("expiredVodafoneDisplay").innerText = config.coachInfo.vodafoneCash || "01274300663";
            document.getElementById("expiredInstapayDisplay").innerText = config.coachInfo.instapayUser || "mahmoudsaeed291997@instapay";
            document.getElementById("expiredStcDisplay").innerText = config.coachInfo.stcPay || "966563055827";
            const expIbanEl = document.getElementById("expiredIbanDisplay");
            if (expIbanEl) expIbanEl.innerText = config.coachInfo.bankIban || "SA4180000644608017933823";
            const expBarqEl = document.getElementById("expiredBarqDisplay");
            if (expBarqEl) expBarqEl.innerText = config.coachInfo.barqWallet || config.coachInfo.stcPay || "966563055827";
            this.selectSubscriptionTier(this.selectedSubscriptionMonths !== undefined ? this.selectedSubscriptionMonths : 1);

            const badgeWrap = document.getElementById("expiredBadgeWrap");
            const badgeText = document.getElementById("expiredBadgeText");
            const titleText = document.getElementById("expiredTitleText");
            const descText = document.getElementById("expiredDescText");
            const renewBtnText = document.getElementById("expiredRenewBtnText");
            const waBtnText = document.getElementById("expiredWaBtnText");
            const previewBox = document.getElementById("pendingPlanPreviewBox");

            if (isPending) {
                if (badgeWrap) badgeWrap.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black mb-3";
                if (badgeText) badgeText.innerText = this.t("pending_badge");
                if (titleText) titleText.innerText = this.t("pending_title");
                if (descText) descText.innerText = this.t("pending_desc");
                if (renewBtnText) renewBtnText.innerText = this.t("pending_activate_btn");
                if (waBtnText) waBtnText.innerText = this.t("pending_wa_btn");
                if (previewBox && user.traineeData) {
                    const tr = user.traineeData;
                    const dispName = typeof IronI18n !== "undefined" ? IronI18n.trName(tr) : tr.name;
                    const dispGoal = typeof IronI18n !== "undefined" ? IronI18n.trGoal(tr.goal) : tr.goal;
                    const dispProv = typeof IronI18n !== "undefined" ? IronI18n.trProvider(tr.authProvider) : (tr.authProvider || "OTP");
                    previewBox.innerHTML = `
                        <div class="font-black text-emerald-400 mb-1">${dispName} • ${dispProv} ✅</div>
                        <div class="text-gray-300 font-bold">${dispGoal} • ${tr.calories} kcal • ${tr.program}</div>
                    `;
                    previewBox.classList.remove("hidden");
                }
            } else {
                if (badgeWrap) badgeWrap.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-black mb-3";
                if (badgeText) badgeText.innerText = this.t("expired_badge");
                if (titleText) titleText.innerText = this.t("expired_title");
                if (descText) descText.innerText = this.t("expired_desc");
                if (renewBtnText) renewBtnText.innerText = this.t("expired_renew_btn");
                if (waBtnText) waBtnText.innerText = this.t("expired_wa_btn");
                if (previewBox) previewBox.classList.add("hidden");
            }
            const receiptNotice = document.getElementById("pendingReceiptNotice");
            if (receiptNotice) {
                const rec = user.traineeData?.lastRenewalReceipt;
                if (rec && rec.status === "pending_review") {
                    receiptNotice.innerText = this.t("receipt_pending_banner", { file: rec.fileName || "" });
                    receiptNotice.classList.remove("hidden");
                } else {
                    receiptNotice.classList.add("hidden");
                }
            }
            return;
        }

        // 3. متدرب نشط
        if (desktopNav) desktopNav.style.display = "";
        if (mobileNav) mobileNav.classList.remove("hidden");

        traineeAppContainer.classList.remove("hidden");
        this.selectedProgramId = this.resolveProgramIdFromName(user.traineeData?.program);
        this.renderTraineeData(user.traineeData);
        this.switchTab(this.currentTab || "overview");
    },

    // =========================================================================
    // إدارة الصورة الشخصية الخاصة بالمشترك (Trainee Personal Avatar Upload)
    // =========================================================================
    renderTraineeAvatar(trainee) {
        const box = document.getElementById("traineeAvatarBox");
        if (!box || !trainee) return;

        const displayName = typeof IronI18n !== "undefined" ? IronI18n.trName(trainee) : trainee.name;
        const initial = (displayName || "U").trim().charAt(0).toUpperCase();
        const hasAvatar = Boolean(trainee.avatar);

        box.innerHTML = `
            <div class="flex flex-col items-center gap-1.5">
                <div onclick="document.getElementById('traineeAvatarInput')?.click()" class="trainee-avatar-ring cursor-pointer group relative flex items-center justify-center" title="${hasAvatar ? this.t('avatar_change') : this.t('avatar_add')}">
                    ${hasAvatar ? `
                        <img src="${trainee.avatar}" alt="${displayName}" class="trainee-avatar-img">
                    ` : `
                        <div class="w-full h-full flex flex-col items-center justify-center bg-slate-950/80 text-emerald-400">
                            <span class="text-2xl font-black leading-none">${initial}</span>
                            <span class="text-[11px] mt-0.5 opacity-80">📷</span>
                        </div>
                    `}
                </div>
                <div class="flex items-center justify-center">
                    <button type="button" onclick="document.getElementById('traineeAvatarInput')?.click()" class="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 transition">
                        ${hasAvatar ? this.t("avatar_change") : this.t("avatar_add")}
                    </button>
                </div>
            </div>
        `;
    },

    handleTraineeAvatarUpload(input) {
        if (!input || !input.files || !input.files[0]) return;
        const file = input.files[0];
        if (!file.type || !file.type.startsWith("image/")) {
            input.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
                const maxDim = 256;
                const canvas = document.createElement("canvas");
                canvas.width = maxDim;
                canvas.height = maxDim;
                const ctx = canvas.getContext("2d");

                // قص مركزي مربع للصورة للحفاظ على نسبة الأبعاد وجودة العرض الدائري
                const size = Math.min(img.width, img.height);
                const sx = Math.max(0, (img.width - size) / 2);
                const sy = Math.max(0, (img.height - size) / 2);
                ctx.drawImage(img, sx, sy, size, size, 0, 0, maxDim, maxDim);

                const user = IronAuth.getCurrentUser();
                if (!user || user.role !== "trainee") {
                    input.value = "";
                    return;
                }

                canvas.toBlob(async (blob) => {
                    try {
                        let avatarUrl = canvas.toDataURL("image/jpeg", 0.82);
                        const targetAuthId = user.traineeData?.authUserId;
                        if (blob && targetAuthId && typeof IronSupabase !== "undefined") {
                            const uploadedUrl = await IronSupabase.uploadAvatarBlob(targetAuthId, blob);
                            if (uploadedUrl) avatarUrl = uploadedUrl;
                        }
                        const updated = IronAuth.updateTrainee(user.id, { avatar: avatarUrl });
                        if (updated) {
                            await IronAuth.persistTraineeFields(updated);
                            this.renderTraineeAvatar(updated);
                            this.renderUserHeader(IronAuth.getCurrentUser());
                            showToast(this.t("avatar_saved"), "success");
                        }
                    } catch (err) {
                        console.error("Avatar upload failed:", err);
                    } finally {
                        input.value = "";
                    }
                }, "image/jpeg", 0.82);
            };
            img.onerror = () => {
                input.value = "";
            };
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    },

    async removeTraineeAvatar() {
        const user = IronAuth.getCurrentUser();
        if (!user || user.role !== "trainee") return;
        if (user.traineeData?.authUserId && typeof IronSupabase !== "undefined") {
            await IronSupabase.removeAvatarFiles(user.traineeData.authUserId);
        }
        const updated = IronAuth.updateTrainee(user.id, { avatar: "" });
        if (updated) {
            await IronAuth.persistTraineeFields(updated).catch(() => {});
            this.renderTraineeAvatar(updated);
            this.renderUserHeader(IronAuth.getCurrentUser());
            showToast(this.t("avatar_removed"), "success");
        }
    },

    // تعبئة بيانات شاشات المتدرب (بياناته وجداوله ومتابعته فقط)
    renderTraineeData(trainee) {
        if (!trainee) return;

        const targetCal = trainee.calories || 2000;
        const weight = parseFloat(trainee.weight) || 75;
        const proteinGrams = trainee.macros?.protein || Math.round(weight * 2);
        const fatGrams = trainee.macros?.fats || Math.round((targetCal * 0.25) / 9);
        const computedCarbs = Math.max(0, Math.round((targetCal - (proteinGrams * 4 + fatGrams * 9)) / 4));
        const carbGrams = trainee.macros?.carbs !== undefined ? trainee.macros.carbs : computedCarbs;
        const waterTargetLiters = (weight * 0.035).toFixed(1);

        // الصورة الشخصية للمشترك + بيانات الترحيب الرئيسية
        this.renderTraineeAvatar(trainee);
        const displayName = typeof IronI18n !== "undefined" ? IronI18n.trName(trainee) : trainee.name;
        document.getElementById("homeWelcomeName").innerText = this.t("home_welcome", { name: displayName });
        document.getElementById("homeDaysLeftBadge").innerText = this.t("home_days_left", { days: trainee.daysLeft });
        document.getElementById("homeTargetCal").innerText = `${targetCal} kcal`;
        document.getElementById("homeTargetProtein").innerText = `${proteinGrams}g`;
        document.getElementById("homeTargetCarbs").innerText = `${carbGrams}g`;
        document.getElementById("homeTargetWater").innerText = `${waterTargetLiters} ${this.t("liter")}`;

        // بطاقة ملخص خطة العميل وتوجيهات الكوتش الخاصة به فقط
        this.renderHomePlanSummary(trainee);

        // إعداد الحاسبة بقيم المتدرب الخاصة
        if (document.getElementById("calcWeight")) document.getElementById("calcWeight").value = weight;
        if (document.getElementById("calcHeight")) document.getElementById("calcHeight").value = trainee.height || 175;
        if (document.getElementById("calcAge")) document.getElementById("calcAge").value = trainee.age || 26;
        if (document.getElementById("calcGender")) document.getElementById("calcGender").value = trainee.gender || "male";
        if (document.getElementById("calcActivity")) document.getElementById("calcActivity").value = trainee.activity || 1.55;
        if (document.getElementById("calcGoal")) {
            if (trainee.goalOffset !== undefined && trainee.goalOffset !== null && !Number.isNaN(Number(trainee.goalOffset))) {
                document.getElementById("calcGoal").value = String(Number(trainee.goalOffset));
            } else {
                const gStr = String(trainee.goal || "").toLowerCase();
                if (gStr.includes("lean") || gStr.includes("نظيف") || gStr.includes("+250")) {
                    document.getElementById("calcGoal").value = "250";
                } else if (gStr.includes("تضخيم") || gStr.includes("bulk") || gStr.includes("+450")) {
                    document.getElementById("calcGoal").value = "450";
                } else if (gStr.includes("تثبيت") || gStr.includes("نحت") || gStr.includes("maint") || gStr.includes("recomp")) {
                    document.getElementById("calcGoal").value = "0";
                } else if (gStr.includes("معتدل") || gStr.includes("moderate") || gStr.includes("-300")) {
                    document.getElementById("calcGoal").value = "-300";
                } else {
                    document.getElementById("calcGoal").value = "-500";
                }
            }
        }

        // تعبئة نموذج المتابعة الأسبوعية بقيم المتدرب الحالي فقط (ومنع بقايا أي مستخدم سابق)
        if (document.getElementById("chkWeight")) {
            document.getElementById("chkWeight").value = weight;
        }
        const lastHist = trainee.history && trainee.history.length > 0 ? trainee.history[trainee.history.length - 1] : null;
        if (document.getElementById("chkWaist")) {
            document.getElementById("chkWaist").value = lastHist?.waist || "";
        }
        if (document.getElementById("chkNotes")) {
            document.getElementById("chkNotes").value = "";
        }

        this.calcManuallyEdited = false;
        this.renderWaterTracker(trainee, parseFloat(waterTargetLiters));
        this.runCalculator(false);
        this.generateDayDiet(false);
        this.renderMealsTracker(trainee);
        this.startWaterReminderLoop();
        this.renderMealsGrid();
        this.updateConditionalWorkoutVisibility();
        this.switchWorkoutSubSection(this.currentWorkoutSubSection || "assigned");
        this.renderWorkoutLogs();
        this.renderExercisesGrid();
        this.renderCheckinHistory(trainee);
    },

    renderHomePlanSummary(trainee) {
        const card = document.getElementById("homePlanSummaryCard");
        if (!card || !trainee) return;
        const assignedProg = typeof IronI18n !== "undefined" && IronI18n.trProgram
            ? IronI18n.trProgram(trainee.program || "PPL (Push Pull Legs)")
            : (trainee.program || "PPL (Push Pull Legs)");
        const checkinsCount = Array.isArray(trainee.history) ? trainee.history.length : 0;
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const displayGoal = typeof IronI18n !== "undefined" ? IronI18n.trGoal(trainee.goal || "تنشيف وخسارة دهون") : (trainee.goal || "تنشيف وخسارة دهون");
        const displayNote = typeof IronI18n !== "undefined" ? IronI18n.trNote(trainee) : trainee.coachNote;

        card.innerHTML = `
            <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                        <span>${this.t("plan_summary_title")}</span>
                    </span>
                    <span class="text-[11px] text-gray-400 font-mono">${this.t("plan_joined", { date: trainee.joinedDate || '-' })}</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div class="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                        <div class="text-[10px] text-gray-400 font-bold">${this.t("plan_goal")}</div>
                        <div class="font-black text-white mt-0.5">${displayGoal}</div>
                    </div>
                    <div class="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                        <div class="text-[10px] text-gray-400 font-bold">${this.t("plan_program")}</div>
                        <div class="font-black text-emerald-400 mt-0.5">${assignedProg}</div>
                    </div>
                    <div class="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                        <div class="text-[10px] text-gray-400 font-bold">${this.t("plan_weight_checkins")}</div>
                        <div class="font-black text-cyan-400 mt-0.5">${this.t("plan_checkins_count", { weight: trainee.weight, count: checkinsCount })}</div>
                    </div>
                </div>
                ${displayNote ? `
                    <div class="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3 text-xs">
                        <div class="text-[10px] font-black text-emerald-400 mb-1">${this.t("plan_coach_note")}</div>
                        <p class="text-gray-200 leading-relaxed">${displayNote}</p>
                    </div>
                ` : ''}
            </div>
        `;
    },

    // =========================================================================
    // متتبع شرب الماء اليومي التفاعلي + إشعار تذكير كل ساعتين
    // =========================================================================
    WATER_REMINDER_INTERVAL_MS: 2 * 60 * 60 * 1000, // ساعتان (2 Hours)
    waterReminderTimerId: null,
    waterReminderDueNow: false,

    getTodayWaterKey(traineeId) {
        const today = new Date().toISOString().split("T")[0];
        return `${traineeId || "guest"}_${today}`;
    },

    isWaterReminderEnabled() {
        const raw = localStorage.getItem("iron_water_reminder_enabled");
        return raw === null ? true : raw === "true";
    },

    getLastWaterReminderTime(traineeId) {
        const key = `iron_water_last_ts_${traineeId || "guest"}`;
        const val = parseInt(localStorage.getItem(key), 10);
        if (!val || Number.isNaN(val)) {
            const now = Date.now();
            localStorage.setItem(key, String(now));
            return now;
        }
        return val;
    },

    setLastWaterReminderTime(traineeId, ts = Date.now()) {
        const key = `iron_water_last_ts_${traineeId || "guest"}`;
        localStorage.setItem(key, String(ts));
    },

    formatRemainingTime(ms) {
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const totalMin = Math.max(1, Math.ceil(ms / 60000));
        const hours = Math.floor(totalMin / 60);
        const mins = totalMin % 60;
        if (hours > 0 && mins > 0) {
            return isEn ? `${hours}h ${mins}m` : `${hours} س و ${mins} د`;
        }
        if (hours > 0) {
            return isEn ? `${hours}h` : `${hours} ساعة`;
        }
        return isEn ? `${mins}m` : `${mins} دقيقة`;
    },

    async requestWaterNotificationPermission() {
        if (typeof window === "undefined" || !("Notification" in window)) return false;
        if (Notification.permission === "granted") return true;
        if (Notification.permission === "denied") return false;
        try {
            const perm = await Notification.requestPermission();
            return perm === "granted";
        } catch {
            return false;
        }
    },

    playWaterReminderSound() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const now = ctx.currentTime;
            [523.25, 659.25, 783.99].forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, now + idx * 0.14);
                gain.gain.setValueAtTime(0.08, now + idx * 0.14);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.35);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + idx * 0.14);
                osc.stop(now + idx * 0.14 + 0.36);
            });
        } catch {}
    },

    async triggerWaterReminderNotification(isManualTest = false) {
        const user = typeof IronAuth !== "undefined" ? IronAuth.getCurrentUser() : null;
        if (!user || user.role !== "trainee" || !user.traineeData) return;

        const trainee = user.traineeData;
        const targetLiters = parseFloat(((parseFloat(trainee.weight) || 75) * 0.035).toFixed(1));
        const logs = (typeof IronSupabase !== "undefined" && IronSupabase.cache.waterLogs) ? IronSupabase.cache.waterLogs : {};
        const key = this.getTodayWaterKey(trainee.id);
        const cups = parseInt(logs[key]) || 0;
        const consumedLiters = (cups * 0.25).toFixed(2);

        const title = this.t("water_notif_title");
        const body = this.t("water_notif_body", { consumed: consumedLiters, target: targetLiters });

        this.waterReminderDueNow = true;
        this.setLastWaterReminderTime(trainee.id, Date.now());
        this.playWaterReminderSound();
        showToast(body, "success");
        this.renderWaterTracker(trainee, targetLiters);

        const hasPerm = await this.requestWaterNotificationPermission();
        if (hasPerm) {
            try {
                if ("serviceWorker" in navigator) {
                    const reg = await navigator.serviceWorker.getRegistration();
                    if (reg && typeof reg.showNotification === "function") {
                        await reg.showNotification(title, {
                            body,
                            icon: "./LOGO.png",
                            badge: "./LOGO.png",
                            tag: "ironcoach-water-reminder",
                            renotify: true
                        });
                        return;
                    }
                }
                new Notification(title, {
                    body,
                    icon: "./LOGO.png",
                    tag: "ironcoach-water-reminder"
                });
            } catch {}
        } else if (isManualTest && typeof window !== "undefined" && "Notification" in window && Notification.permission === "denied") {
            const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
            showToast(isEn ? "In-app water alert shown! (Enable browser notifications in site settings for background alerts)" : "تم عرض تنبيه الماء داخل التطبيق! (يمكنك السماح بإشعارات المتصفح من إعدادات الموقع للتنبيه بالخلفية)", "success");
        }
    },

    async toggleWaterReminder() {
        const nextState = !this.isWaterReminderEnabled();
        localStorage.setItem("iron_water_reminder_enabled", String(nextState));
        const user = typeof IronAuth !== "undefined" ? IronAuth.getCurrentUser() : null;
        const trainee = user?.traineeData;
        if (nextState) {
            if (trainee?.id) this.setLastWaterReminderTime(trainee.id, Date.now());
            this.waterReminderDueNow = false;
            await this.requestWaterNotificationPermission();
            showToast(this.t("water_rem_on_toast"), "success");
        } else {
            this.waterReminderDueNow = false;
            showToast(this.t("water_rem_off_toast"), "success");
        }
        if (trainee) {
            const targetLiters = parseFloat(((parseFloat(trainee.weight) || 75) * 0.035).toFixed(1));
            this.renderWaterTracker(trainee, targetLiters);
        }
    },

    startWaterReminderLoop() {
        if (this.waterReminderTimerId) {
            clearInterval(this.waterReminderTimerId);
        }
        const checkFn = () => {
            const user = typeof IronAuth !== "undefined" ? IronAuth.getCurrentUser() : null;
            if (!user || user.role !== "trainee" || !user.traineeData) return;
            if (!this.isWaterReminderEnabled()) return;

            const trainee = user.traineeData;
            const targetLiters = parseFloat(((parseFloat(trainee.weight) || 75) * 0.035).toFixed(1));
            const targetCups = Math.max(6, Math.round(targetLiters / 0.25));
            const logs = (typeof IronSupabase !== "undefined" && IronSupabase.cache.waterLogs) ? IronSupabase.cache.waterLogs : {};
            const cups = parseInt(logs[this.getTodayWaterKey(trainee.id)]) || 0;

            // إذا لم يكتمل هدف الماء اليومي ومرت ساعتان منذ آخر تذكير أو آخر كوب ماء
            const lastTs = this.getLastWaterReminderTime(trainee.id);
            const elapsed = Date.now() - lastTs;
            if (cups < targetCups && elapsed >= this.WATER_REMINDER_INTERVAL_MS) {
                this.triggerWaterReminderNotification(false);
            } else {
                const countdownEl = document.getElementById("waterNextReminderCountdown");
                if (countdownEl) {
                    const remaining = Math.max(0, this.WATER_REMINDER_INTERVAL_MS - elapsed);
                    countdownEl.innerText = cups >= targetCups
                        ? this.t("water_goal_done")
                        : this.t("water_rem_next", { time: this.formatRemainingTime(remaining) });
                }
            }
        };

        checkFn();
        this.waterReminderTimerId = setInterval(checkFn, 30000);
    },

    renderWaterTracker(trainee, targetLiters = 3.0) {
        const box = document.getElementById("waterTrackerInteractiveBox");
        if (!box || !trainee) return;

        const logs = (typeof IronSupabase !== "undefined" && IronSupabase.cache.waterLogs) ? IronSupabase.cache.waterLogs : {};
        const key = this.getTodayWaterKey(trainee.id);
        const cups = parseInt(logs[key]) || 0;
        const consumedLiters = (cups * 0.25).toFixed(2);
        const targetCups = Math.max(6, Math.round(targetLiters / 0.25));
        const pct = Math.min(100, Math.round((cups / targetCups) * 100));

        const remEnabled = this.isWaterReminderEnabled();
        const lastTs = this.getLastWaterReminderTime(trainee.id);
        const remainingMs = Math.max(0, this.WATER_REMINDER_INTERVAL_MS - (Date.now() - lastTs));
        const nextText = cups >= targetCups
            ? this.t("water_goal_done")
            : this.t("water_rem_next", { time: this.formatRemainingTime(remainingMs) });

        box.innerHTML = `
            <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-3">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div class="flex-1 min-w-0">
                        <div class="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                            <span class="text-xs font-black text-white flex items-center gap-1.5 flex-wrap">
                                <span>${this.t("water_title")}</span>
                                <span class="text-[11px] text-cyan-400 font-mono">(${consumedLiters} / ${targetLiters} ${this.t("liter")})</span>
                            </span>
                            <span class="text-xs font-black text-cyan-400">${this.t("water_cups", { cups, target: targetCups, pct })}</span>
                        </div>
                        <div class="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                            <div class="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300" style="width: ${pct}%"></div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="IronApp.addWaterCup(1)" class="water-cup-btn px-3.5 py-2 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-black flex items-center gap-1">
                            <span>${this.t("water_add_btn")}</span>
                        </button>
                        ${cups > 0 ? `
                            <button onclick="IronApp.addWaterCup(-1)" class="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-xl text-xs font-bold">
                                -
                            </button>
                        ` : ''}
                    </div>
                </div>

                <!-- شريط تذكير شرب المياه كل ساعتين -->
                <div class="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-800/80 text-[11px]">
                    <div class="flex items-center gap-2 flex-wrap">
                        <button type="button" onclick="IronApp.toggleWaterReminder()"
                            class="px-2.5 py-1 rounded-lg font-bold border transition flex items-center gap-1 ${remEnabled ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/25' : 'bg-slate-800 text-gray-400 border-slate-700 hover:bg-slate-700'}">
                            <span>${remEnabled ? this.t("water_rem_on_btn") : this.t("water_rem_off_btn")}</span>
                        </button>
                        ${remEnabled ? `
                            <span id="waterNextReminderCountdown" class="text-gray-400 font-bold">${nextText}</span>
                        ` : ''}
                    </div>
                    <button type="button" onclick="IronApp.triggerWaterReminderNotification(true)"
                        class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 font-bold transition">
                        ${this.t("water_rem_test_btn")}
                    </button>
                </div>

                ${this.waterReminderDueNow && cups < targetCups ? `
                    <div class="bg-cyan-500/15 border border-cyan-400/40 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 animate-pulse">
                        <div class="text-xs font-black text-cyan-300 flex items-center gap-1.5">
                            <span>💧</span>
                            <span>${this.t("water_due_banner")}</span>
                        </div>
                        <button type="button" onclick="IronApp.addWaterCup(1)" class="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-lg transition">
                            ${this.t("water_due_drink_btn")}
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    },

    addWaterCup(delta = 1) {
        const user = IronAuth.getCurrentUser();
        if (!user || !user.traineeData) return;
        const trainee = user.traineeData;
        const logs = (typeof IronSupabase !== "undefined" && IronSupabase.cache.waterLogs) ? IronSupabase.cache.waterLogs : {};
        const key = this.getTodayWaterKey(trainee.id);
        const todayStr = new Date().toISOString().split("T")[0];
        const nextCups = Math.max(0, (parseInt(logs[key]) || 0) + delta);
        logs[key] = nextCups;

        if (delta > 0) {
            this.waterReminderDueNow = false;
            this.setLastWaterReminderTime(trainee.id, Date.now());
        }

        if (typeof IronSupabase !== "undefined") {
            IronSupabase.saveWaterLog(trainee.id, trainee.authUserId, todayStr, nextCups);
        }

        const targetLiters = parseFloat(((parseFloat(trainee.weight) || 75) * 0.035).toFixed(1));
        this.renderWaterTracker(trainee, targetLiters);
        if (delta > 0) {
            showToast(this.t("water_toast", { liters: (nextCups * 0.25).toFixed(2) }), "success");
        }
    },

    // =========================================================================
    // متتبع الوجبات اليومية التفاعلي (تحت خانة المياه)
    // =========================================================================
    MEAL_SLOTS_ORDER: ["breakfast", "lunch", "dinner", "snack"],

    getCompletedMealsForToday(traineeId) {
        const key = this.getTodayWaterKey(traineeId);
        const mealLogs = (typeof IronSupabase !== "undefined" && IronSupabase.cache.mealLogs) ? IronSupabase.cache.mealLogs : {};
        return Array.isArray(mealLogs[key]) ? mealLogs[key] : [];
    },

    renderMealsTracker(trainee) {
        const box = document.getElementById("mealsTrackerInteractiveBox");
        if (!box) return;
        const user = typeof IronAuth !== "undefined" ? IronAuth.getCurrentUser() : null;
        const activeTrainee = trainee || user?.traineeData;
        if (!activeTrainee) return;

        const completedSlots = this.getCompletedMealsForToday(activeTrainee.id);
        const plan = this.currentDayDiet || this.getSavedDietPlanForCurrentUser();
        const targetCal = activeTrainee.calories || plan?.totalCalories || 2000;

        const slotMeta = [
            { key: "breakfast", icon: "🍳", label: this.t("meal_slot_breakfast"), meal: plan?.breakfast },
            { key: "lunch", icon: "🍗", label: this.t("meal_slot_lunch"), meal: plan?.lunch },
            { key: "dinner", icon: "🥣", label: this.t("meal_slot_dinner"), meal: plan?.dinner },
            { key: "snack", icon: "🥜", label: this.t("meal_slot_snack"), meal: plan?.snack }
        ];

        const totalMealsCount = slotMeta.length;
        const doneCount = completedSlots.length;
        const pct = Math.min(100, Math.round((doneCount / totalMealsCount) * 100));

        box.innerHTML = `
            <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-3">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div class="flex-1 min-w-0">
                        <div class="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                            <span class="text-xs font-black text-white flex items-center gap-1.5">
                                <span>${this.t("meals_tracker_title")}</span>
                            </span>
                            <span class="text-xs font-black text-emerald-400">${this.t("meals_tracker_count", { done: doneCount, total: totalMealsCount, pct })}</span>
                        </div>
                        <div class="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                            <div class="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-300" style="width: ${pct}%"></div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="IronApp.stepDailyMeals(1)" class="px-3.5 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-black flex items-center gap-1 transition">
                            <span>${this.t("meals_add_btn")}</span>
                        </button>
                        ${doneCount > 0 ? `
                            <button onclick="IronApp.stepDailyMeals(-1)" class="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-xl text-xs font-bold transition">
                                -
                            </button>
                        ` : ''}
                    </div>
                </div>

                <!-- أزرار الوجبات الـ 4 اليومية فقط (فطار + غداء + عشاء + سناك) بدون تفاصيل الوجبة -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5 border-t border-slate-800/80">
                    ${slotMeta.map(s => {
                        const isDone = completedSlots.includes(s.key);
                        return `
                            <button type="button" onclick="IronApp.toggleMealSlot('${s.key}')"
                                class="px-3 py-2 rounded-xl border transition flex items-center justify-between gap-2 ${isDone ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/10' : 'bg-slate-950/70 border-slate-800 text-gray-300 hover:border-slate-700 hover:text-white'}">
                                <span class="text-xs font-black flex items-center gap-1.5">
                                    <span>${s.icon}</span>
                                    <span>${s.label}</span>
                                </span>
                                <span class="px-1.5 py-0.5 rounded text-[10px] font-black shrink-0 ${isDone ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-gray-400'}">
                                    ${isDone ? '✓' : '+'}
                                </span>
                            </button>
                        `;
                    }).join("")}
                </div>
            </div>
        `;
    },

    toggleMealSlot(slotKey) {
        const user = IronAuth.getCurrentUser();
        if (!user || !user.traineeData) return;
        const trainee = user.traineeData;
        const key = this.getTodayWaterKey(trainee.id);
        const todayStr = new Date().toISOString().split("T")[0];
        const current = [...this.getCompletedMealsForToday(trainee.id)];

        const idx = current.indexOf(slotKey);
        let added = false;
        if (idx >= 0) {
            current.splice(idx, 1);
        } else {
            current.push(slotKey);
            added = true;
        }

        if (typeof IronSupabase !== "undefined") {
            IronSupabase.saveMealLog(trainee.id, trainee.authUserId, todayStr, current);
        }

        this.renderMealsTracker(trainee);
        if (added) {
            showToast(this.t("meals_toast_done", { done: current.length, total: this.MEAL_SLOTS_ORDER.length }), "success");
        }
    },

    stepDailyMeals(delta = 1) {
        const user = IronAuth.getCurrentUser();
        if (!user || !user.traineeData) return;
        const trainee = user.traineeData;
        const todayStr = new Date().toISOString().split("T")[0];
        const current = [...this.getCompletedMealsForToday(trainee.id)];

        if (delta > 0) {
            const nextSlot = this.MEAL_SLOTS_ORDER.find(s => !current.includes(s));
            if (nextSlot) {
                current.push(nextSlot);
            } else {
                return;
            }
        } else if (delta < 0 && current.length > 0) {
            current.pop();
        }

        if (typeof IronSupabase !== "undefined") {
            IronSupabase.saveMealLog(trainee.id, trainee.authUserId, todayStr, current);
        }

        this.renderMealsTracker(trainee);
        if (delta > 0) {
            showToast(this.t("meals_toast_done", { done: current.length, total: this.MEAL_SLOTS_ORDER.length }), "success");
        }
    },

    // =========================================================================
    // سجل التمارين المكتملة والتحكم في ريسيت الجولات (Workout History & Reset)
    // =========================================================================
    resolveLogExercisesList(log) {
        if (Array.isArray(log.completedExercises) && log.completedExercises.length > 0) {
            const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
            const catalog = typeof CARDIO_MACHINES_CATALOG !== "undefined" ? CARDIO_MACHINES_CATALOG : [];
            return log.completedExercises.map(item => {
                if (item && (item.isCardio || String(item.exerciseId || "").startsWith("ex_cardio_"))) {
                    const mins = parseInt(item.durationMinutes || item.maxWeightKg) || 0;
                    const meta = catalog.find(m => m.key === item.machineKey || m.exerciseId === item.exerciseId);
                    const mName = meta ? (isEn ? meta.nameEn : meta.nameAr) : (item.name || "Cardio");
                    const noteSuffix = item.speedOrNote ? ` (${item.speedOrNote})` : "";
                    return {
                        ...item,
                        maxWeightKg: 0,
                        name: `${meta?.icon || "🏃"} ${mName} • ${mins} ${isEn ? "min" : "دقيقة"}${noteSuffix}`
                    };
                }
                return item;
            });
        }
        // توافق تلقائي للسجلات القديمة التي حُفظت قبل إضافة أسماء التمارين التفصيلية
        if (typeof getProgramById === "function" && log.programId) {
            const prog = getProgramById(log.programId);
            const day = prog?.days?.find(d => d.title === log.dayTitle);
            if (day && Array.isArray(day.exercises)) {
                let remaining = parseInt(log.completedSets) || 0;
                const list = [];
                for (const item of day.exercises) {
                    if (remaining <= 0) break;
                    const ex = typeof getExerciseById === "function" ? getExerciseById(item.exerciseId) : null;
                    const take = Math.min(item.sets, remaining);
                    remaining -= take;
                    list.push({
                        exerciseId: item.exerciseId,
                        name: item.displayNameEn || ex?.nameEn || item.exerciseId,
                        completedSets: take,
                        totalSets: item.sets,
                        isFull: take >= item.sets,
                        maxWeightKg: 0
                    });
                }
                return list;
            }
        }
        return [];
    },

    async deleteWorkoutLog(logId) {
        if (!logId) return;
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const confirmMsg = this.t("logs_reset_one_confirm");
        if (!window.confirm(confirmMsg)) return;

        if (typeof IronSupabase !== "undefined") {
            await IronSupabase.deleteWorkoutLog(logId);
        }
        showToast(this.t("logs_reset_one_toast"), "success");
        this.renderWorkoutLogs();
        this.selectProgram(this.selectedProgramId);
    },

    async resetAllWorkoutLogs() {
        const user = IronAuth.getCurrentUser();
        const traineeId = user && user.id ? user.id : null;
        if (!traineeId) return;

        const confirmMsg = this.t("logs_reset_all_confirm");
        if (!window.confirm(confirmMsg)) return;

        sessionStorage.removeItem("iron_active_workout");
        if (typeof IronLiveGym !== "undefined") {
            IronLiveGym.currentWorkout = null;
        }
        if (typeof IronSupabase !== "undefined") {
            await IronSupabase.resetClientWorkoutLogs(traineeId);
        }
        showToast(this.t("logs_reset_all_toast"), "success");
        this.renderWorkoutLogs();
        this.selectProgram(this.selectedProgramId);
    },

    async resetWorkoutDay(programId, dayId) {
        const user = IronAuth.getCurrentUser();
        const traineeId = user && user.id ? user.id : null;
        const prog = typeof getProgramById === "function" ? getProgramById(programId) : null;
        const day = prog?.days?.find(d => d.dayId === dayId);
        if (!day) return;

        const confirmMsg = this.t("wo_reset_day_confirm", { day: day.title });
        if (!window.confirm(confirmMsg)) return;

        try {
            const savedRaw = sessionStorage.getItem("iron_active_workout");
            if (savedRaw) {
                const parsed = JSON.parse(savedRaw);
                if (parsed?.workout?.dayId === dayId) {
                    sessionStorage.removeItem("iron_active_workout");
                    if (typeof IronLiveGym !== "undefined") IronLiveGym.currentWorkout = null;
                }
            }
        } catch {}

        if (traineeId && typeof IronSupabase !== "undefined") {
            await IronSupabase.resetClientWorkoutLogs(traineeId, day.title);
        }
        showToast(this.t("wo_reset_day_toast"), "success");
        this.renderWorkoutLogs();
        this.selectProgram(this.selectedProgramId);
    },

    renderWorkoutLogs() {
        const overviewContainer = document.getElementById("overviewWorkoutLogsContainer");
        const workoutsTabContainer = document.getElementById("workoutsTabLogsContainer");
        const user = IronAuth.getCurrentUser();
        const traineeId = user && user.id ? user.id : null;

        const allLogs = (typeof IronSupabase !== "undefined" && Array.isArray(IronSupabase.cache.workoutLogs))
            ? IronSupabase.cache.workoutLogs
            : [];
        const myLogs = traineeId
            ? allLogs.filter(l => l.traineeId === traineeId)
            : [];

        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();

        const renderHtml = (limit = 5) => {
            if (myLogs.length === 0) {
                return `
                    <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center text-xs text-gray-400">
                        ${this.t("logs_empty")}
                    </div>
                `;
            }

            return `
                <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-5 wo-summary-card">
                    <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <h4 class="text-sm font-black wo-summary-heading flex items-center gap-2">
                            <span>${this.t("logs_title", { count: myLogs.length })}</span>
                        </h4>
                        <div class="flex items-center gap-2">
                            <span class="text-[11px] wo-summary-accent font-bold">${this.t("logs_recent", { count: Math.min(limit, myLogs.length) })}</span>
                            <button type="button" onclick="IronApp.resetAllWorkoutLogs()" class="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 text-[11px] font-bold transition">
                                ${this.t("logs_reset_all_btn")}
                            </button>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        ${myLogs.slice(0, limit).map(log => {
                            const dateFormatted = new Date(log.date).toLocaleDateString(isEn ? "en-US" : "ar-EG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
                            const completedExList = this.resolveLogExercisesList(log);
                            const setsText = log.totalSets
                                ? `${log.completedSets}/${log.totalSets}`
                                : `${log.completedSets}`;
                            return `
                                <div class="bg-slate-950/70 border border-slate-800 rounded-xl p-3 sm:p-3.5 text-xs space-y-2.5">
                                    <div class="flex flex-wrap items-start justify-between gap-2">
                                        <div class="min-w-0 flex-1">
                                            <div class="font-black wo-summary-heading truncate">${log.dayTitle}</div>
                                            <div class="text-[10px] text-gray-400 truncate">${log.programName} • ${dateFormatted}</div>
                                        </div>
                                        <div class="flex items-center gap-1.5 flex-shrink-0">
                                            <div class="text-end">
                                                <span class="px-2 py-0.5 rounded-full wo-summary-sets-badge border font-bold text-[10px]">
                                                    ${this.t("logs_sets", { sets: setsText })}
                                                </span>
                                                ${log.totalVolumeKg > 0 ? `<div class="text-[10px] text-amber-400 font-mono mt-0.5">${this.t("logs_volume", { vol: log.totalVolumeKg })}</div>` : ''}
                                            </div>
                                            <button type="button" onclick="IronApp.deleteWorkoutLog('${log.id}')" title="${this.t("logs_reset_one_btn")}"
                                                class="px-2 py-1 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 text-[10px] font-bold transition">
                                                🔄
                                            </button>
                                        </div>
                                    </div>
                                    ${completedExList.length > 0 ? `
                                        <div class="pt-2 border-t border-slate-800/80">
                                            <div class="text-[11px] font-black wo-summary-heading mb-1.5">${this.t("logs_completed_exercises_lbl", { count: completedExList.length })}</div>
                                            <div class="flex flex-wrap gap-1.5" dir="ltr">
                                                ${completedExList.map(exItem => {
                                                    const isFull = exItem.isFull !== undefined ? exItem.isFull : (exItem.completedSets >= exItem.totalSets);
                                                    const weightTag = exItem.maxWeightKg > 0 ? ` • ${exItem.maxWeightKg}kg` : '';
                                                    return `
                                                        <span class="px-2.5 py-1 rounded-lg text-[11px] font-extrabold border ${isFull ? 'wo-ex-pill-done' : 'wo-ex-pill-partial'}">
                                                            ${isFull ? '✓' : '⚡'} ${exItem.name} (${exItem.completedSets}/${exItem.totalSets}${weightTag})
                                                        </span>
                                                    `;
                                                }).join("")}
                                            </div>
                                        </div>
                                    ` : ''}
                                </div>
                            `;
                        }).join("")}
                    </div>
                </div>
            `;
        };

        const cardioBannerHtml = this.renderLogsCardioSummaryBanner();
        if (overviewContainer) overviewContainer.innerHTML = cardioBannerHtml + renderHtml(4);
        if (workoutsTabContainer) workoutsTabContainer.innerHTML = cardioBannerHtml + renderHtml(8);
        if (this.currentWorkoutSubSection === "cardio") {
            this.renderCardioEvaluationView();
        }
    },

    // =========================================================================
    // عرض سجل المتابعات الأسبوعية + رسم بياني متجهي SVG لتطور الوزن
    // =========================================================================
    renderWeightChartSvg(history) {
        if (!Array.isArray(history) || history.length < 2) return "";

        const points = history.slice(-8);
        const weights = points.map(p => parseFloat(p.weight) || 75);
        const minW = Math.min(...weights) - 1;
        const maxW = Math.max(...weights) + 1;
        const range = Math.max(1, maxW - minW);

        const width = 520;
        const height = 130;
        const padX = 36;
        const padY = 24;
        const usableW = width - padX * 2;
        const usableH = height - padY * 2;

        const coords = points.map((p, idx) => {
            const x = padX + (idx / (points.length - 1)) * usableW;
            const y = padY + usableH - ((parseFloat(p.weight) - minW) / range) * usableH;
            return { x: Math.round(x), y: Math.round(y), weight: p.weight, date: (p.date || "").slice(5) };
        });

        const polylinePoints = coords.map(c => `${c.x},${c.y}`).join(" ");
        const areaPoints = `${coords[0].x},${height - padY} ${polylinePoints} ${coords[coords.length - 1].x},${height - padY}`;

        return `
            <div class="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 mb-4">
                <div class="text-[11px] font-bold text-gray-400 mb-2 flex justify-between items-center">
                    <span>${this.t("chk_chart_title")}</span>
                    <span class="font-mono text-emerald-400">${this.t("chk_chart_range", { from: points[0].weight, to: points[points.length - 1].weight })}</span>
                </div>
                <svg viewBox="0 0 ${width} ${height}" class="w-full h-32 overflow-visible">
                    <defs>
                        <linearGradient id="weightAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="#10b981" stop-opacity="0.32"/>
                            <stop offset="100%" stop-color="#10b981" stop-opacity="0.0"/>
                        </linearGradient>
                    </defs>
                    <polygon points="${areaPoints}" fill="url(#weightAreaGrad)" />
                    <polyline fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${polylinePoints}" />
                    ${coords.map(c => `
                        <g>
                            <circle cx="${c.x}" cy="${c.y}" r="4.5" fill="#10b981" stroke="#070a12" stroke-width="2" />
                            <text x="${c.x}" y="${c.y - 9}" text-anchor="middle" fill="#10b981" font-size="10" font-weight="800">${c.weight}</text>
                            <text x="${c.x}" y="${height - 5}" text-anchor="middle" fill="#94a3b8" font-size="9">${c.date}</text>
                        </g>
                    `).join("")}
                </svg>
            </div>
        `;
    },

    renderCheckinHistory(trainee) {
        const container = document.getElementById("checkinHistoryContainer");
        if (!container || !trainee) return;
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const unitKg = isEn ? "kg" : "كجم";

        const history = trainee.history || [];
        if (history.length === 0) {
            container.innerHTML = `<div class="text-xs text-gray-400 text-center py-4">${this.t("chk_hist_empty")}</div>`;
            return;
        }

        const chartHtml = this.renderWeightChartSvg(history);

        const rows = [...history].reverse().map((item, idx, arr) => {
            const prev = arr[idx + 1];
            let badge = `<span class="text-gray-400">${this.t("chk_initial")}</span>`;
            if (prev && typeof prev.weight === "number") {
                const diff = parseFloat((item.weight - prev.weight).toFixed(1));
                badge = diff < 0
                    ? `<span class="text-emerald-400 font-bold">${diff} ${unitKg} 📉</span>`
                    : diff > 0
                    ? `<span class="text-amber-400 font-bold">+${diff} ${unitKg} 📈</span>`
                    : `<span class="text-cyan-400 font-bold">${this.t("chk_stable")}</span>`;
            }
            return `
                <div class="bg-slate-950/70 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs space-y-1">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <span class="font-mono text-gray-400">${item.date}</span>
                            <strong class="text-white font-black">${item.weight} ${unitKg}</strong>
                            ${item.waist ? `<span class="text-gray-400">${this.t("chk_waist_item", { waist: item.waist })}</span>` : ''}
                        </div>
                        <div>${badge}</div>
                    </div>
                    ${(item.adherence || item.energy || item.notes) ? `
                        <div class="flex flex-wrap items-center gap-2 text-[10px] text-gray-400 pt-1 border-t border-slate-800/60">
                            ${item.adherence ? `<span>${this.t("chk_adh_item")} <strong class="text-emerald-400">${item.adherence}/10</strong></span>` : ''}
                            ${item.energy ? `<span>${this.t("chk_eng_item")} <strong class="text-cyan-400">${item.energy}/10</strong></span>` : ''}
                            ${item.notes ? `<span class="text-gray-300 truncate max-w-xs">📝 ${item.notes}</span>` : ''}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join("");

        container.innerHTML = `
            <div class="mt-6 pt-5 border-t border-slate-800">
                <h4 class="text-xs font-black text-emerald-400 mb-3 flex items-center gap-1.5">
                    <span>${this.t("chk_hist_title", { count: history.length })}</span>
                </h4>
                ${chartHtml}
                <div class="space-y-2 max-h-48 overflow-y-auto pr-1">${rows}</div>
            </div>
        `;
    },

    // تبديل التبويبات
    switchTab(tabId) {
        this.currentTab = tabId;

        document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
        const target = document.getElementById(`tab-${tabId}`);
        if (target) target.classList.add("active");

        document.querySelectorAll(".tab-btn-desktop").forEach(btn => {
            if (btn.getAttribute("data-tab") === tabId) {
                btn.className = "tab-btn-desktop px-4 py-2 rounded-xl text-xs font-black bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20";
            } else {
                btn.className = "tab-btn-desktop px-4 py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition";
            }
        });

        document.querySelectorAll(".nav-item").forEach(item => {
            if (item.getAttribute("data-nav") === tabId) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });

        if (tabId === "meals" && this.currentDayDiet) {
            this.generateDayDietWithPlan(this.currentDayDiet);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // تشغيل الحاسبة وحساب النتائج فورياً
    runCalculator(fromUserEdit = false) {
        if (fromUserEdit) {
            this.calcManuallyEdited = true;
        }
        const gender = document.getElementById("calcGender")?.value || "male";
        const age = document.getElementById("calcAge")?.value || 25;
        const weight = document.getElementById("calcWeight")?.value || 75;
        const height = document.getElementById("calcHeight")?.value || 175;
        const activity = document.getElementById("calcActivity")?.value || 1.55;
        const goalEl = document.getElementById("calcGoal");
        const goal = goalEl ? goalEl.value : "-500";

        const results = IronCalculator.calculate({ gender, age, weight, height, activity, goal });

        if (document.getElementById("resBmr")) document.getElementById("resBmr").innerText = `${results.bmr} kcal`;
        if (document.getElementById("resTdee")) document.getElementById("resTdee").innerText = `${results.tdee} kcal`;
        if (document.getElementById("resTarget")) document.getElementById("resTarget").innerText = `${results.targetCalories} kcal`;
        if (document.getElementById("resProtein")) document.getElementById("resProtein").innerText = `${results.proteinGrams}g (${results.proteinCalories} kcal)`;
        if (document.getElementById("resCarbs")) document.getElementById("resCarbs").innerText = `${results.carbGrams}g (${results.carbCalories} kcal)`;
        if (document.getElementById("resFats")) document.getElementById("resFats").innerText = `${results.fatGrams}g (${results.fatCalories} kcal)`;
        if (document.getElementById("resWater")) document.getElementById("resWater").innerText = `${results.waterLiters} ${this.t("liter")}`;

        this.latestCalcResults = results;
    },

    // حفظ السعرات ومزامنتها مع ملف المتدرب الحالي فقط
    saveTargetCalories(skipGenerate = false) {
        if (!this.latestCalcResults) this.runCalculator(false);
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const goalSelect = document.getElementById("calcGoal");
        const goalLabel = goalSelect && goalSelect.selectedIndex >= 0 ? goalSelect.options[goalSelect.selectedIndex].text.split("(")[0].trim() : undefined;
        const goalOffset = goalSelect ? parseFloat(goalSelect.value) : undefined;
        const inputs = {
            gender: document.getElementById("calcGender")?.value,
            age: document.getElementById("calcAge")?.value,
            weight: document.getElementById("calcWeight")?.value,
            height: document.getElementById("calcHeight")?.value,
            activity: document.getElementById("calcActivity")?.value,
            goalLabel,
            goalOffset
        };
        this.calcManuallyEdited = false;
        const applied = IronCalculator.applyTargetToCurrentUser(this.latestCalcResults, inputs);
        if (applied) {
            const user = IronAuth.getCurrentUser();
            if (user) {
                this.renderTraineeData(user.traineeData);
                if (!skipGenerate) {
                    this.generateDayDiet(true);
                }
            }
            if (!skipGenerate) {
                showToast(isEn ? "Target calories & macros saved and synced! 🎯" : "تم حفظ السعرات والماكروز في ملفك ومزامنتها بنجاح! 🎯", "success");
            }
        } else if (!skipGenerate) {
            showToast(isEn ? "Calories calculated successfully" : "تم احتساب السعرات بنجاح", "success");
        }
    },

    // =========================================================================
    // توليد وحفظ دايت اليوم الكامل (معزول لكل متدرب بمعرفه الخاص)
    // =========================================================================
    saveDietPlanForCurrentUser(plan) {
        const user = IronAuth.getCurrentUser();
        if (!user || !user.id) return;
        const snap = user.traineeData?.calories || 2000;
        if (typeof IronSupabase !== "undefined") {
            IronSupabase.saveDietPlan(user.id, user.traineeData?.authUserId || null, plan, snap);
        }
    },

    getSavedDietPlanForCurrentUser() {
        const user = IronAuth.getCurrentUser();
        if (!user || !user.id) return null;
        if (typeof IronSupabase !== "undefined" && IronSupabase.cache.savedDiets) {
            return IronSupabase.cache.savedDiets[user.id] || null;
        }
        return null;
    },

    generateDayDiet(forceNew = false) {
        if (forceNew && this.calcManuallyEdited && this.latestCalcResults) {
            this.saveTargetCalories(true);
        }

        const user = IronAuth.getCurrentUser();
        const targetCal = (user && user.traineeData && user.traineeData.calories)
            ? user.traineeData.calories
            : (this.latestCalcResults?.targetCalories || 2000);

        let plan = !forceNew ? this.getSavedDietPlanForCurrentUser() : null;
        const hasLegacyScaleBadge = Boolean(
            plan && (plan.breakfast?.portionMultiplier || plan.lunch?.portionMultiplier || plan.dinner?.portionMultiplier || plan.snack?.portionMultiplier)
        );
        const targetChanged = plan && (
            hasLegacyScaleBadge ||
            !plan.targetCaloriesSnapshot ||
            Math.abs(plan.targetCaloriesSnapshot - targetCal) > 5 ||
            Math.abs((plan.totalCalories || 0) - targetCal) > 25
        );

        if (!plan || !plan.breakfast || !plan.lunch || !plan.dinner || !plan.snack || targetChanged) {
            plan = IronMealsEngine.generateFullDayPlan(targetCal, user?.traineeData?.onboardingProfile || null);
            this.saveDietPlanForCurrentUser(plan);
        } else {
            plan.difference = Math.round(plan.totalCalories - targetCal);
        }

        this.generateDayDietWithPlan(plan);
        if (forceNew) {
            const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
            showToast(isEn ? `New tailored daily meal plan created for ${targetCal} kcal! 🥗` : `تم تصميم وحفظ وجبات يومية مخصصة لـ ${targetCal} سعرة بدقة! 🥗`, "success");
        }
    },

    shareDietPlanWhatsapp() {
        if (!this.currentDayDiet) return;
        const d = this.currentDayDiet;
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const trM = (m) => typeof IronI18n !== "undefined" ? IronI18n.trMeal(m) : m;
        const b = trM(d.breakfast), l = trM(d.lunch), dn = trM(d.dinner), s = trM(d.snack);

        const msg = isEn ?
`🥗 *My Daily Meal Plan - IronCoach Pro*
🔥 *Total Calories:* ${d.totalCalories} kcal
🥩 Protein: ${d.totalProtein}g | 🍞 Carbs: ${d.totalCarbs}g | 🥑 Fats: ${d.totalFats}g
-------------------------------------------
🍳 *Breakfast:* ${b.name} (${b.calories} kcal)
• ${b.ingredients}

🍗 *Lunch:* ${l.name} (${l.calories} kcal)
• ${l.ingredients}

🥣 *Dinner:* ${dn.name} (${dn.calories} kcal)
• ${dn.ingredients}

🥜 *Snack:* ${s.name} (${s.calories} kcal)
• ${s.ingredients}` :
`🥗 *جدولي الغذائي اليومي - أيرون كوتش (IronCoach Pro)*
🔥 *إجمالي السعرات:* ${d.totalCalories} kcal
🥩 بروتين: ${d.totalProtein}g | 🍞 كارب: ${d.totalCarbs}g | 🥑 دهون: ${d.totalFats}g
-------------------------------------------
🍳 *الإفطار:* ${b.name} (${b.calories} سعرة)
• ${b.ingredients}

🍗 *الغداء:* ${l.name} (${l.calories} سعرة)
• ${l.ingredients}

🥣 *العشاء:* ${dn.name} (${dn.calories} سعرة)
• ${dn.ingredients}

🥜 *السناك:* ${s.name} (${s.calories} سعرة)
• ${s.ingredients}`;

        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
    },

    renderDayDietSlotCard(slotTitle, rawMeal, slotKey) {
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const meal = typeof IronI18n !== "undefined" ? IronI18n.trMeal(rawMeal) : rawMeal;
        const calUnit = isEn ? "kcal" : "ك";
        const gramUnit = isEn ? "g" : "ج";
        return `
            <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition">
                <div class="relative h-28 w-full overflow-hidden bg-slate-950">
                    <img src="${meal.img}" onerror="this.onerror=null;this.src=IronApp.getMealFallbackSvg('${slotTitle}')" class="w-full h-full object-cover" alt="${meal.name}" loading="lazy">
                    <div class="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur text-[10px] text-emerald-400 font-black border border-emerald-500/20">
                        ${slotTitle}
                    </div>
                </div>
                <div class="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                        <h5 class="font-black text-white text-xs mb-1">${meal.name}</h5>
                        <p class="text-[11px] text-gray-400 leading-relaxed mb-2.5">${meal.ingredients}</p>
                    </div>

                    <div>
                        <div class="flex justify-between items-center text-[10px] font-bold text-gray-300 bg-slate-950 p-2 rounded-lg mb-2">
                            <span class="text-emerald-400">🔥 ${meal.calories} ${calUnit}</span>
                            <span>🥩 ${meal.protein}${gramUnit}</span>
                            <span>🍞 ${meal.carbs}${gramUnit}</span>
                            <span>🥑 ${meal.fats}${gramUnit}</span>
                        </div>
                        <button onclick="IronApp.swapDayMeal('${slotKey}', '${meal.id}')" class="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold text-[11px] rounded-lg transition border border-slate-700 flex items-center justify-center gap-1">
                            <span>${this.t("diet_swap")}</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // استبدال وجبة بوجبة مخصصة جديدة بأوزان دقيقة مطابقة لنفس سعرات الخانة وحفظ الخطة
    swapDayMeal(slotKey, currentMealId) {
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const previousMeal = this.currentDayDiet?.[slotKey] || null;
        let replacement = null;

        if (typeof IronMealsEngine.generateAlternativeForSlot === "function") {
            replacement = IronMealsEngine.generateAlternativeForSlot(slotKey, previousMeal?.calories || 400, previousMeal);
        }
        if (!replacement) {
            const alts = IronMealsEngine.findMealAlternatives(currentMealId);
            if (alts.length === 0) {
                showToast(isEn ? "No additional calorie-matched alternatives available" : "لا توجد بدائل إضافية بنفس السعرات حالياً", "error");
                return;
            }
            replacement = alts[Math.floor(Math.random() * alts.length)];
        }

        this.currentDayDiet[slotKey] = replacement;

        const user = IronAuth.getCurrentUser();
        const targetCal = (user && user.traineeData && user.traineeData.calories)
            ? user.traineeData.calories
            : (this.latestCalcResults?.targetCalories || 2000);

        const d = this.currentDayDiet;
        d.totalCalories = d.breakfast.calories + d.lunch.calories + d.dinner.calories + d.snack.calories;
        d.totalProtein = d.breakfast.protein + d.lunch.protein + d.dinner.protein + d.snack.protein;
        d.totalCarbs = d.breakfast.carbs + d.lunch.carbs + d.dinner.carbs + d.snack.carbs;
        d.totalFats = d.breakfast.fats + d.lunch.fats + d.dinner.fats + d.snack.fats;
        d.difference = Math.round(d.totalCalories - targetCal);

        this.saveDietPlanForCurrentUser(d);
        this.generateDayDietWithPlan(d);
        const altName = typeof IronI18n !== "undefined" ? IronI18n.trMeal(replacement).name : replacement.name;
        showToast(isEn ? `Meal swapped to: ${altName}` : `تم استبدال الوجبة بـ: ${altName}`, "success");
    },

    generateDayDietWithPlan(plan) {
        this.currentDayDiet = plan;
        this.renderMealsTracker();
        const container = document.getElementById("generatedDayPlanContainer");
        if (!container) return;
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const calWord = isEn ? "kcal" : "سعرة";
        const user = IronAuth.getCurrentUser();
        const targetCal = user && user.traineeData && user.traineeData.calories ? user.traineeData.calories : 2000;
        const diffVal = typeof plan.difference === "number" ? plan.difference : Math.round(plan.totalCalories - targetCal);
        const diffText = diffVal === 0 ? this.t("diet_exact")
            : diffVal > 0 ? `+${diffVal} ${calWord}`
            : `${diffVal} ${calWord}`;
        const hasUnsavedCalc = this.calcManuallyEdited && this.latestCalcResults && Math.abs(this.latestCalcResults.targetCalories - targetCal) > 5;

        const trCat = (arCat) => typeof IronI18n !== "undefined" ? IronI18n.translateMealCategory(arCat) : arCat;

        container.innerHTML = `
            <div class="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 sm:p-5 space-y-4">
                ${hasUnsavedCalc ? `
                    <div class="bg-amber-500/15 border border-amber-500/40 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span class="font-bold text-amber-300">${this.t("diet_calc_unsaved_notice", { calc: this.latestCalcResults.targetCalories, saved: targetCal })}</span>
                        <button type="button" onclick="IronApp.saveTargetCalories()" class="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs shadow transition whitespace-nowrap">
                            ${this.t("diet_calc_sync_now", { calc: this.latestCalcResults.targetCalories })}
                        </button>
                    </div>
                ` : ''}
                <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div class="flex items-center gap-3 flex-wrap">
                        <span class="text-xs text-gray-400">${this.t("diet_total")}</span>
                        <strong class="text-emerald-400 font-black text-lg">${plan.totalCalories} kcal</strong>
                        <span class="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-gray-300 font-mono">${this.t("diet_target", { target: targetCal, diff: diffText })}</span>
                    </div>
                    <div class="flex items-center gap-3 text-xs font-bold flex-wrap">
                        <span class="text-white">${this.t("diet_prot")} ${plan.totalProtein}g</span>
                        <span class="text-amber-400">${this.t("diet_carb")} ${plan.totalCarbs}g</span>
                        <span class="text-teal-400">${this.t("diet_fat")} ${plan.totalFats}g</span>
                        <button onclick="IronApp.shareDietPlanWhatsapp()" class="px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 rounded-lg text-[11px] font-bold transition">
                            ${this.t("diet_share_wa")}
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    ${this.renderDayDietSlotCard(trCat("إفطار"), plan.breakfast, "breakfast")}
                    ${this.renderDayDietSlotCard(trCat("غداء"), plan.lunch, "lunch")}
                    ${this.renderDayDietSlotCard(trCat("عشاء"), plan.dinner, "dinner")}
                    ${this.renderDayDietSlotCard(trCat("سناكس"), plan.snack, "snack")}
                </div>
            </div>
        `;
    },

    // رسم شبكة الـ 100 وجبة الصحية
    renderMealsGrid() {
        const grid = document.getElementById("mealsGrid");
        const counter = document.getElementById("mealsCounterText");
        if (!grid) return;

        const query = document.getElementById("mealsSearchInput")?.value || "";
        const meals = IronMealsEngine.filterMeals({ category: this.currentMealCategory, query });

        if (counter) counter.innerText = this.t("meals_count", { count: meals.length });

        if (meals.length === 0) {
            grid.innerHTML = `<div class="col-span-full text-center py-12 text-gray-400">${this.t("meals_empty")}</div>`;
            return;
        }

        const trCat = (arCat) => typeof IronI18n !== "undefined" ? IronI18n.translateMealCategory(arCat) : arCat;

        grid.innerHTML = meals.map(rawMeal => {
            const m = typeof IronI18n !== "undefined" ? IronI18n.trMeal(rawMeal) : rawMeal;
            return `
            <div class="meal-card bg-slate-950/60 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition flex flex-col justify-between">
                <div class="relative h-44 w-full bg-slate-950 overflow-hidden">
                    <img src="${m.img}" onerror="this.onerror=null;this.src=IronApp.getMealFallbackSvg('${trCat(m.category)}')" class="w-full h-full object-cover transition duration-300 hover:scale-105" alt="${m.name}" loading="lazy">
                    <div class="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur text-xs font-bold text-white border border-slate-700">
                        ${trCat(m.category)}
                    </div>
                </div>

                <div class="p-4 flex-1 flex flex-col justify-between">
                    <div>
                        <h4 class="font-black text-white text-sm mb-1.5">${m.name}</h4>
                        <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-xs text-gray-300 leading-relaxed mb-3">
                            <div class="text-[10px] font-bold text-emerald-400 mb-1">${this.t("meal_ing_title")}</div>
                            ${m.ingredients}
                        </div>
                    </div>

                    <div class="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold bg-slate-900 p-2 rounded-xl border border-slate-800 text-gray-300">
                        <div>
                            <span class="text-gray-400 block text-[9px]">${this.t("m_cal")}</span>
                            <span class="text-emerald-400 font-black">${m.calories}</span>
                        </div>
                        <div>
                            <span class="text-gray-400 block text-[9px]">${this.t("m_prot")}</span>
                            <span class="text-white">${m.protein}g</span>
                        </div>
                        <div>
                            <span class="text-gray-400 block text-[9px]">${this.t("m_carb")}</span>
                            <span class="text-amber-400">${m.carbs}g</span>
                        </div>
                        <div>
                            <span class="text-gray-400 block text-[9px]">${this.t("m_fat")}</span>
                            <span class="text-teal-400">${m.fats}g</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        }).join("");
    },

    setMealCategory(cat) {
        this.currentMealCategory = cat;
        document.querySelectorAll(".meal-cat-btn").forEach(btn => {
            if (btn.getAttribute("data-cat") === cat) {
                btn.className = "meal-cat-btn px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950";
            } else {
                btn.className = "meal-cat-btn px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-gray-300";
            }
        });
        this.renderMealsGrid();
    },

    filterMeals() {
        this.renderMealsGrid();
    },

    // عرض البرنامج التدريبي المخصص للمتدرب فقط (دون عرض جداول أو خطط برامج أخرى)
    selectProgram(progId) {
        const user = IronAuth.getCurrentUser();
        const assignedProgId = (user && user.role === "trainee" && user.traineeData?.program)
            ? this.resolveProgramIdFromName(user.traineeData.program)
            : progId;

        this.selectedProgramId = assignedProgId;
        const program = getProgramById(assignedProgId);
        const container = document.getElementById("workoutProgramDetails");
        if (!container || !program) return;

        // إخفاء شبكة التبديل بين البرامج عن المتدرب ليرى جدوله المخصص فقط
        const selectorWrapper = document.getElementById("programSelectorWrapper");
        const assignedBadge = document.getElementById("assignedProgramBadge");
        if (selectorWrapper) {
            if (user && user.role === "trainee") {
                selectorWrapper.classList.add("hidden");
            } else {
                selectorWrapper.classList.remove("hidden");
            }
        }
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        if (assignedBadge) {
            assignedBadge.innerText = this.t("wo_assigned", { name: isEn ? program.nameEn : program.nameAr });
        }

        document.querySelectorAll(".prog-select-btn").forEach(btn => {
            if (btn.getAttribute("data-prog") === assignedProgId) {
                btn.className = "prog-select-btn p-3 rounded-2xl border text-center transition bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold text-xs shadow-lg shadow-emerald-500/10";
            } else {
                btn.className = "prog-select-btn p-3 rounded-2xl border text-center transition bg-slate-950 border-slate-800 text-gray-300 font-bold text-xs hover:border-slate-700";
            }
        });

        container.innerHTML = `
            <div class="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-6 relative overflow-hidden">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div class="flex-1" dir="ltr">
                        <div class="flex items-center gap-2 mb-1 flex-wrap">
                            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">${program.frequency}</span>
                            <span class="px-2.5 py-0.5 rounded-full bg-slate-800 text-gray-300 text-[11px] font-bold">${program.level}</span>
                        </div>
                        <h2 class="text-xl font-black text-white">${program.nameEn}</h2>
                        <p class="text-xs text-gray-300 leading-relaxed max-w-3xl mt-1.5">${program.description}</p>
                    </div>
                    ${program.image ? `
                        <a href="${program.image}" target="_blank" title="عرض تصميم الجدول بالحجم الكامل" class="block w-full md:w-52 h-32 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0 hover:border-emerald-500/50 transition">
                            <img src="${program.image}" onerror="this.parentElement.style.display='none'" class="w-full h-full object-cover opacity-95 hover:scale-105 transition duration-300" alt="${program.nameEn}">
                        </a>
                    ` : ''}
                </div>
            </div>

            <!-- قائمة الأيام التدريبية داخل البرنامج (التمارين بالإنجليزية ومطابقة لصور التصميم مع إبراز التمارين المنجزة وزر الريسيت) -->
            <div class="space-y-4">
                ${program.days.map((day) => {
                    const traineeId = user && user.id ? user.id : null;
                    const allLogs = (typeof IronSupabase !== "undefined" && Array.isArray(IronSupabase.cache.workoutLogs))
                        ? IronSupabase.cache.workoutLogs
                        : [];
                    const latestDayLog = traineeId
                        ? allLogs.find(l => l.traineeId === traineeId && l.dayTitle === day.title)
                        : null;

                    const exStatusMap = {};
                    if (latestDayLog) {
                        const resolvedList = this.resolveLogExercisesList(latestDayLog);
                        resolvedList.forEach(item => {
                            if (item.exerciseId) exStatusMap[item.exerciseId] = item;
                            if (item.name) exStatusMap[item.name] = item;
                        });
                    }

                    // فحص المسودة الجارية في الجيم إن وُجدت لنفس اليوم
                    let hasActiveDraftForDay = false;
                    try {
                        const savedRaw = sessionStorage.getItem("iron_active_workout");
                        if (savedRaw) {
                            const parsed = JSON.parse(savedRaw);
                            if (parsed?.version === 2 && parsed.traineeId === traineeId && parsed.workout?.programId === program.id && parsed.workout?.dayId === day.dayId) {
                                parsed.workout.exercises.forEach(dEx => {
                                    const doneCount = (dEx.sets || []).filter(s => s.completed).length;
                                    if (doneCount > 0) {
                                        hasActiveDraftForDay = true;
                                        const st = {
                                            exerciseId: dEx.exerciseId,
                                            name: dEx.displayNameEn || dEx.exerciseId,
                                            completedSets: doneCount,
                                            totalSets: (dEx.sets || []).length,
                                            isFull: doneCount === (dEx.sets || []).length
                                        };
                                        exStatusMap[dEx.exerciseId] = st;
                                        if (dEx.displayNameEn) exStatusMap[dEx.displayNameEn] = st;
                                    }
                                });
                            }
                        }
                    } catch {}

                    const hasAnyProgress = Boolean(latestDayLog || hasActiveDraftForDay);

                    return `
                    <div class="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5 sm:p-5">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
                            <div dir="ltr" class="text-left min-w-0">
                                <h4 class="font-black text-white text-sm sm:text-base">${day.title}</h4>
                                <div class="text-xs text-emerald-400 font-bold mt-0.5">${day.targetMuscles} • ${day.exercises.length} Exercises</div>
                            </div>
                            <div class="flex items-center gap-2 flex-wrap">
                                ${hasAnyProgress ? `
                                    <button type="button" onclick="IronApp.resetWorkoutDay('${program.id}', '${day.dayId}')" class="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1">
                                        <span>${this.t("wo_reset_day_btn")}</span>
                                    </button>
                                ` : ''}
                                <button onclick="IronApp.startLiveWorkout('${program.id}', '${day.dayId}')" class="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-90 transition flex items-center justify-center gap-1.5">
                                    <span>${this.t("wo_start_btn")}</span>
                                </button>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3" dir="ltr">
                            ${day.exercises.map((item, idx) => {
                                const ex = getExerciseById(item.exerciseId);
                                if (!ex) return '';
                                const exLabel = item.displayNameEn || ex.nameEn;
                                const safeExLabel = exLabel.replace(/'/g, "\\'");
                                const badgeNum = item.pair || `${idx + 1}`;
                                const exProg = exStatusMap[exLabel] || exStatusMap[item.exerciseId] || null;
                                const isFullDone = exProg && exProg.completedSets >= exProg.totalSets;
                                const isPartDone = exProg && exProg.completedSets > 0 && exProg.completedSets < exProg.totalSets;
                                const cardBorder = isFullDone
                                    ? 'bg-emerald-950/20 border-emerald-500/45'
                                    : isPartDone
                                    ? 'bg-amber-950/20 border-amber-500/45'
                                    : 'bg-slate-900/80 border-slate-800/80';
                                const doneBadge = isFullDone
                                    ? `<span class="px-2 py-0.5 rounded-md border text-[10px] font-black wo-ex-pill-done">✓ ${exProg.completedSets}/${exProg.totalSets}</span>`
                                    : isPartDone
                                    ? `<span class="px-2 py-0.5 rounded-md border text-[10px] font-black wo-ex-pill-partial">⚡ ${exProg.completedSets}/${exProg.totalSets}</span>`
                                    : '';

                                return `
                                    <div onclick="IronApp.openExerciseDetail('${ex.id}', '${safeExLabel}')" class="${cardBorder} border rounded-xl p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3 hover:border-emerald-500/40 cursor-pointer transition text-left">
                                        <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${isFullDone ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400'} flex items-center justify-center font-black text-xs flex-shrink-0">
                                            ${isFullDone ? '✓' : badgeNum}
                                        </div>
                                        <img src="${ex.gif}" onerror="this.onerror=null;this.src=IronApp.getExerciseFallbackSvg('${exLabel}')" class="w-11 h-11 sm:w-14 sm:h-14 rounded-lg object-contain bg-slate-950 border border-slate-800 flex-shrink-0" alt="${exLabel}" loading="lazy">
                                        <div class="flex-1 min-w-0">
                                            <div class="flex flex-wrap items-center justify-between gap-1">
                                                <h5 class="font-black text-white text-xs truncate">${exLabel}</h5>
                                                ${doneBadge}
                                            </div>
                                            <div class="flex items-center gap-2 text-[11px] font-bold mt-1 flex-wrap">
                                                <span class="text-emerald-400">${item.sets} × ${item.reps}</span>
                                                <span class="text-gray-400">• Rest ${item.restSec}s</span>
                                            </div>
                                        </div>
                                        <div class="text-gray-400 hover:text-white text-xs flex-shrink-0">ℹ️</div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        ${this.renderDayCardioStripHtml(this.selectedProgramId, day.dayId)}
                    </div>
                `;
                }).join('')}
            </div>
        `;
        this.prependCsectionBannerIfNeeded(container, this.selectedProgramId);
    },

    // =========================================================================
    // أقسام التمرين المتخصصة: الكارديو والتقييم اليومي + التمارين المنزلية + ما بعد القيصرية
    // =========================================================================
    currentWorkoutSubSection: "assigned",
    standaloneCardioInterval: null,
    standaloneCardioState: {
        machineKey: "treadmill",
        minutes: 20,
        speedOrNote: "",
        stopwatchRunning: false,
        stopwatchStartedMs: null,
        stopwatchAccumulatedSec: 0
    },

    prependCsectionBannerIfNeeded(container, progId) {
        if (!container || typeof getProgramById !== "function") return;
        const prog = getProgramById(progId);
        if (!prog || !prog.isPostpartumSafety) return;
        if (container.querySelector(".csection-safety-banner")) return;
        const banner = document.createElement("div");
        banner.className = "csection-safety-banner bg-rose-950/40 border border-rose-500/45 rounded-2xl p-4 text-xs leading-relaxed mb-4";
        banner.innerHTML = `
            <strong class="text-rose-300 font-black block mb-1">${this.t("csection_safety_title")}</strong>
            <p class="text-rose-100">${this.t("csection_safety_desc")}</p>
        `;
        container.prepend(banner);
    },

    getTraineeFeatureAccess(userOrTrainee) {
        const u = userOrTrainee || (typeof IronAuth !== "undefined" ? IronAuth.getCurrentUser() : null);
        if (!u || u.role === "coach") {
            return { allowHome: true, allowCSection: true };
        }
        const tr = u.traineeData || u;
        const obs = (tr.onboardingProfile && typeof tr.onboardingProfile === "object") ? tr.onboardingProfile : {};
        const progId = this.resolveProgramIdFromName(tr.program || "");
        const allowHome = obs.trainingLocation === "home" || progId === "prog_home";
        const allowCSection = (tr.gender === "female" && Boolean(obs.postCSection)) || progId === "prog_csection";
        return { allowHome, allowCSection };
    },

    updateConditionalWorkoutVisibility(userOrTrainee) {
        const access = this.getTraineeFeatureAccess(userOrTrainee);
        const tabsBar = document.getElementById("workoutSubSectionTabs");
        if (tabsBar) {
            const visibleCount = 2 + (access.allowHome ? 1 : 0) + (access.allowCSection ? 1 : 0);
            tabsBar.className = `grid gap-2 mb-5 ${visibleCount === 2 ? "grid-cols-2" : visibleCount === 3 ? "grid-cols-3" : "grid-cols-2 lg:grid-cols-4"}`;
        }
        document.querySelectorAll(".ex-muscle-btn").forEach(btn => {
            const m = btn.getAttribute("data-muscle");
            if (m === "تمارين منزلية") btn.classList.toggle("hidden", !access.allowHome);
            if (m === "بعد الولادة القيصرية") btn.classList.toggle("hidden", !access.allowCSection);
        });
        if ((this.currentExerciseMuscle === "تمارين منزلية" && !access.allowHome) ||
            (this.currentExerciseMuscle === "بعد الولادة القيصرية" && !access.allowCSection)) {
            this.currentExerciseMuscle = "all";
        }
        return access;
    },

    switchWorkoutSubSection(section = "assigned") {
        const access = this.updateConditionalWorkoutVisibility();
        const allowed = ["assigned", "cardio"];
        if (access.allowHome) allowed.push("home");
        if (access.allowCSection) allowed.push("csection");
        const sec = allowed.includes(section) ? section : "assigned";
        this.currentWorkoutSubSection = sec;

        const styleMap = {
            assigned: "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20",
            cardio: "bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/20",
            home: "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20",
            csection: "bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/20"
        };
        const idleTextMap = {
            assigned: "text-emerald-300 hover:border-emerald-500/50",
            cardio: "text-sky-300 hover:border-sky-500/50",
            home: "text-amber-300 hover:border-amber-500/50",
            csection: "text-rose-300 hover:border-rose-500/50"
        };

        document.querySelectorAll(".wo-subsec-btn").forEach(btn => {
            const key = btn.getAttribute("data-wo-sec");
            const isHidden = (key === "home" && !access.allowHome) || (key === "csection" && !access.allowCSection);
            const hideCls = isHidden ? " hidden" : "";
            if (key === sec) {
                btn.className = `wo-subsec-btn px-3 py-2.5 rounded-2xl border text-xs font-black transition flex items-center justify-center gap-1.5 ${styleMap[key]}${hideCls}`;
            } else {
                btn.className = `wo-subsec-btn px-3 py-2.5 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-1.5 bg-slate-950 border-slate-800 ${idleTextMap[key] || "text-gray-300"}${hideCls}`;
            }
        });

        const cardioBox = document.getElementById("workoutCardioEvaluationBox");
        const specBox = document.getElementById("workoutSpecialtyProgramBox");
        const detailsBox = document.getElementById("workoutProgramDetails");
        const selectorBox = document.getElementById("programSelectorWrapper");

        const user = typeof IronAuth !== "undefined" ? IronAuth.getCurrentUser() : null;
        const isTrainee = user && user.role === "trainee";

        if (sec === "assigned") {
            if (cardioBox) cardioBox.classList.add("hidden");
            if (specBox) specBox.classList.add("hidden");
            if (detailsBox) detailsBox.classList.remove("hidden");
            if (selectorBox) {
                selectorBox.classList.toggle("hidden", isTrainee);
            }
            this.selectProgram(this.selectedProgramId || "prog_ppl");
        } else if (sec === "cardio") {
            if (detailsBox) detailsBox.classList.add("hidden");
            if (selectorBox) selectorBox.classList.add("hidden");
            if (specBox) specBox.classList.add("hidden");
            if (cardioBox) {
                cardioBox.classList.remove("hidden");
                this.renderCardioEvaluationView();
            }
        } else {
            if (detailsBox) detailsBox.classList.add("hidden");
            if (selectorBox) selectorBox.classList.add("hidden");
            if (cardioBox) cardioBox.classList.add("hidden");
            if (specBox) {
                specBox.classList.remove("hidden");
                this.renderSpecialtyProgramView(sec === "home" ? "prog_home" : "prog_csection");
            }
        }
    },

    renderDayCardioStripHtml(progId, dayId) {
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const catalog = typeof CARDIO_MACHINES_CATALOG !== "undefined" ? CARDIO_MACHINES_CATALOG : [];
        if (catalog.length === 0) return "";
        const prog = typeof getProgramById === "function" ? getProgramById(progId) : null;
        const recMins = prog?.recommendedCardio?.defaultMinutes || 20;
        const user = typeof IronAuth !== "undefined" ? IronAuth.getCurrentUser() : null;
        const timeline = (typeof IronLiveGym !== "undefined" && IronLiveGym.getTraineeCardioTimeline)
            ? IronLiveGym.getTraineeCardioTimeline(user?.id, 5)
            : [];
        const latest = timeline[0] || null;
        const evalPill = latest
            ? (latest.trend === "first"
                ? `<span class="px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-300 border border-sky-500/35 text-[10px] font-black">🆕 ${latest.durationMinutes} ${isEn ? "min" : "د"}</span>`
                : latest.deltaMinutes > 0
                ? `<span class="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 text-[10px] font-black">📈 ${latest.durationMinutes} ${isEn ? "min" : "د"} (+${latest.deltaMinutes})</span>`
                : latest.deltaMinutes === 0
                ? `<span class="px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-300 border border-sky-500/35 text-[10px] font-black">🎯 ${latest.durationMinutes} ${isEn ? "min" : "د"}</span>`
                : `<span class="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/35 text-[10px] font-black">📉 ${latest.durationMinutes} ${isEn ? "min" : "د"} (${latest.deltaMinutes})</span>`)
            : `<span class="px-2 py-0.5 rounded-md bg-slate-800 text-sky-300 text-[10px] font-bold">🎯 ${recMins} ${isEn ? "min target" : "دقيقة مستهدفة"}</span>`;

        return `
            <div class="mt-3 pt-3 border-t border-slate-800/80">
                <div class="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-black text-sky-300">🏃 ${isEn ? "Post-Workout Cardio Options & Daily Evaluation:" : "كارديو التمرين اليومي (السير / السايكل / الأوبتكال) والتقييم:"}</span>
                        ${evalPill}
                    </div>
                    <button type="button" onclick="IronApp.switchWorkoutSubSection('cardio')"
                        class="px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/35 text-[11px] font-black transition">
                        ⏱️ ${isEn ? "Log Cardio & Timer" : "تسجيل الوقت والتقييم"}
                    </button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    ${catalog.map(m => {
                        const ex = typeof getExerciseById === "function" ? getExerciseById(m.exerciseId) : null;
                        if (!ex) return "";
                        const name = isEn ? m.nameEn : m.nameAr;
                        const badge = isEn ? m.badgeEn : m.badgeAr;
                        return `
                            <div onclick="IronApp.openExerciseDetail('${ex.id}')"
                                class="bg-slate-900/90 border border-slate-800 hover:border-sky-500/45 rounded-xl p-2 flex items-center gap-2.5 cursor-pointer transition">
                                <img src="${ex.gif}" onerror="this.onerror=null;this.src=IronApp.getExerciseFallbackSvg('${m.nameEn}')"
                                    class="w-12 h-12 rounded-lg object-cover bg-slate-950 border border-slate-800 flex-shrink-0" alt="${name}" loading="lazy">
                                <div class="min-w-0 flex-1">
                                    <div class="text-xs font-black text-white truncate">${m.icon} ${name}</div>
                                    <div class="text-[10px] text-sky-300 font-bold truncate">${badge}</div>
                                    <div class="text-[10px] text-gray-400">${recMins} ${isEn ? "min" : "دقيقة"} • ℹ️ ${isEn ? "Guide" : "شرح"}</div>
                                </div>
                            </div>
                        `;
                    }).join("")}
                </div>
            </div>
        `;
    },

    renderLogsCardioSummaryBanner() {
        const user = typeof IronAuth !== "undefined" ? IronAuth.getCurrentUser() : null;
        if (!user?.id || typeof IronLiveGym === "undefined" || !IronLiveGym.getTraineeCardioTimeline) return "";
        const timeline = IronLiveGym.getTraineeCardioTimeline(user.id, 7);
        if (timeline.length === 0) return "";
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const latest = timeline[0];
        const machineName = isEn ? latest.machineNameEn : latest.machineNameAr;
        const unit = isEn ? "min" : "دقيقة";
        const deltaText = latest.trend === "first"
            ? (isEn ? `Baseline: ${latest.durationMinutes} ${unit}` : `أول قراءة: ${latest.durationMinutes} ${unit}`)
            : latest.deltaMinutes > 0
            ? (isEn ? `📈 +${latest.deltaMinutes} ${unit} better than previous day (${latest.prevMinutes} → ${latest.durationMinutes} ${unit})` : `📈 تحسن +${latest.deltaMinutes} ${unit} عن اليوم السابق (${latest.prevMinutes} ← ${latest.durationMinutes} ${unit})`)
            : latest.deltaMinutes === 0
            ? (isEn ? `🎯 Matched previous day (${latest.durationMinutes} ${unit})` : `🎯 ثبات على نفس المدة (${latest.durationMinutes} ${unit})`)
            : (isEn ? `📉 ${Math.abs(latest.deltaMinutes)} ${unit} lower than previous (${latest.prevMinutes} → ${latest.durationMinutes} ${unit})` : `📉 أقل بـ ${Math.abs(latest.deltaMinutes)} ${unit} عن اليوم السابق (${latest.prevMinutes} ← ${latest.durationMinutes} ${unit})`);

        return `
            <div class="mb-3 bg-sky-950/35 border border-sky-500/35 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div class="flex items-center gap-2 min-w-0">
                    <span class="text-lg">${latest.icon}</span>
                    <div class="min-w-0">
                        <div class="font-black text-white truncate">${isEn ? "Daily Cardio Evaluation" : "تقييم الكارديو اليومي"}: ${machineName} (${latest.durationMinutes} ${unit})</div>
                        <div class="text-[11px] font-bold ${latest.deltaMinutes > 0 ? 'text-emerald-300' : latest.deltaMinutes < 0 ? 'text-amber-300' : 'text-sky-300'}">${deltaText}</div>
                    </div>
                </div>
                <button type="button" onclick="IronApp.switchTab('workouts'); IronApp.switchWorkoutSubSection('cardio')"
                    class="px-3 py-1 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/35 text-[11px] font-black transition">
                    ${isEn ? "View Cardio Chart 📊" : "متابعة ومنحنى الكارديو 📊"}
                </button>
            </div>
        `;
    },

    getStandaloneCardioSeconds() {
        const s = this.standaloneCardioState;
        const base = Math.max(0, Number(s.stopwatchAccumulatedSec) || 0);
        if (s.stopwatchRunning && s.stopwatchStartedMs) {
            return base + Math.max(0, Math.floor((Date.now() - s.stopwatchStartedMs) / 1000));
        }
        return base;
    },

    setStandaloneCardioMachine(machineKey) {
        this.standaloneCardioState.machineKey = machineKey;
        this.renderCardioEvaluationView();
    },

    setStandaloneCardioMinutes(mins) {
        this.standaloneCardioState.minutes = Math.max(0, Math.min(240, parseInt(mins) || 0));
        this.renderCardioEvaluationView();
    },

    setStandaloneCardioNote(val) {
        this.standaloneCardioState.speedOrNote = String(val || "").slice(0, 120);
    },

    toggleStandaloneCardioStopwatch() {
        const s = this.standaloneCardioState;
        if (s.stopwatchRunning) {
            s.stopwatchAccumulatedSec = this.getStandaloneCardioSeconds();
            s.stopwatchRunning = false;
            s.stopwatchStartedMs = null;
            if (s.stopwatchAccumulatedSec >= 30) {
                s.minutes = Math.max(s.minutes || 0, Math.max(1, Math.round(s.stopwatchAccumulatedSec / 60)));
            }
            clearInterval(this.standaloneCardioInterval);
            this.standaloneCardioInterval = null;
        } else {
            s.stopwatchRunning = true;
            s.stopwatchStartedMs = Date.now();
            this.startStandaloneCardioTicker();
        }
        this.renderCardioEvaluationView();
    },

    resetStandaloneCardioStopwatch() {
        clearInterval(this.standaloneCardioInterval);
        this.standaloneCardioInterval = null;
        this.standaloneCardioState.stopwatchRunning = false;
        this.standaloneCardioState.stopwatchStartedMs = null;
        this.standaloneCardioState.stopwatchAccumulatedSec = 0;
        this.renderCardioEvaluationView();
    },

    startStandaloneCardioTicker() {
        clearInterval(this.standaloneCardioInterval);
        this.standaloneCardioInterval = setInterval(() => {
            const s = this.standaloneCardioState;
            if (!s.stopwatchRunning) {
                clearInterval(this.standaloneCardioInterval);
                this.standaloneCardioInterval = null;
                return;
            }
            const totalSec = this.getStandaloneCardioSeconds();
            const el = document.getElementById("standaloneCardioClockText");
            if (el && typeof IronLiveGym !== "undefined") {
                el.innerText = IronLiveGym.formatDurationClock(totalSec);
            }
            const m = Math.floor(totalSec / 60);
            if (m > (parseInt(s.minutes) || 0)) {
                s.minutes = m;
                const minInput = document.getElementById("standaloneCardioMinInput");
                if (minInput && document.activeElement !== minInput) minInput.value = String(m);
            }
        }, 1000);
    },

    async saveStandaloneCardio() {
        const s = this.standaloneCardioState;
        if (s.stopwatchRunning) {
            this.toggleStandaloneCardioStopwatch();
        }
        if (typeof IronLiveGym !== "undefined" && IronLiveGym.logStandaloneCardio) {
            const ok = await IronLiveGym.logStandaloneCardio(s.machineKey, s.minutes, s.speedOrNote);
            if (ok) {
                this.resetStandaloneCardioStopwatch();
            }
        }
    },

    renderCardioChartSvg(timeline) {
        if (!Array.isArray(timeline) || timeline.length < 2) return "";
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const points = [...timeline].slice(0, 8).reverse();
        const vals = points.map(p => p.durationMinutes || 0);
        const minV = Math.max(0, Math.min(...vals) - 5);
        const maxV = Math.max(...vals) + 5;
        const range = Math.max(5, maxV - minV);

        const width = 520;
        const height = 130;
        const padX = 34;
        const padY = 24;
        const usableW = width - padX * 2;
        const usableH = height - padY * 2;

        const coords = points.map((p, idx) => {
            const x = padX + (idx / (points.length - 1)) * usableW;
            const y = padY + usableH - ((p.durationMinutes - minV) / range) * usableH;
            return { x: Math.round(x), y: Math.round(y), mins: p.durationMinutes, date: String(p.date || "").slice(5, 10) };
        });

        const poly = coords.map(c => `${c.x},${c.y}`).join(" ");
        const area = `${coords[0].x},${height - padY} ${poly} ${coords[coords.length - 1].x},${height - padY}`;

        return `
            <div class="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5">
                <div class="text-[11px] font-bold text-gray-300 mb-2 flex justify-between items-center">
                    <span>📈 ${isEn ? "Daily Cardio Duration Progression" : "منحنى تطور وقت الكارديو يوماً بيوم"}</span>
                    <span class="font-mono text-sky-300">${points[0].durationMinutes} ${isEn ? "min" : "د"} → ${points[points.length - 1].durationMinutes} ${isEn ? "min" : "د"}</span>
                </div>
                <svg viewBox="0 0 ${width} ${height}" class="w-full h-32 overflow-visible">
                    <defs>
                        <linearGradient id="cardioAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.32"/>
                            <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0.0"/>
                        </linearGradient>
                    </defs>
                    <polygon points="${area}" fill="url(#cardioAreaGrad)" />
                    <polyline fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${poly}" />
                    ${coords.map(c => `
                        <g>
                            <circle cx="${c.x}" cy="${c.y}" r="4.5" fill="#38bdf8" stroke="#070a12" stroke-width="2" />
                            <text x="${c.x}" y="${c.y - 9}" text-anchor="middle" fill="#38bdf8" font-size="10" font-weight="800">${c.mins}m</text>
                            <text x="${c.x}" y="${height - 5}" text-anchor="middle" fill="#94a3b8" font-size="9">${c.date}</text>
                        </g>
                    `).join("")}
                </svg>
            </div>
        `;
    },

    renderCardioEvaluationView() {
        const container = document.getElementById("workoutCardioEvaluationBox");
        if (!container) return;
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const catalog = typeof CARDIO_MACHINES_CATALOG !== "undefined" ? CARDIO_MACHINES_CATALOG : [];
        const s = this.standaloneCardioState;
        if (s.stopwatchRunning && !this.standaloneCardioInterval) {
            setTimeout(() => this.startStandaloneCardioTicker(), 50);
        }

        const user = typeof IronAuth !== "undefined" ? IronAuth.getCurrentUser() : null;
        const timeline = (typeof IronLiveGym !== "undefined" && IronLiveGym.getTraineeCardioTimeline)
            ? IronLiveGym.getTraineeCardioTimeline(user?.id, 14)
            : [];
        const comp = (typeof IronLiveGym !== "undefined" && IronLiveGym.getCardioComparison)
            ? IronLiveGym.getCardioComparison(user?.id, s.machineKey, s.minutes)
            : { trend: "first", previousMinutes: null, deltaMinutes: null };
        const compHtml = (typeof IronLiveGym !== "undefined" && IronLiveGym.formatCardioComparisonHtml)
            ? IronLiveGym.formatCardioComparisonHtml(comp, s.minutes, isEn)
            : "";

        const selectedMeta = catalog.find(m => m.key === s.machineKey) || catalog[0] || {};
        const clockStr = typeof IronLiveGym !== "undefined"
            ? IronLiveGym.formatDurationClock(this.getStandaloneCardioSeconds())
            : "00:00";

        container.innerHTML = `
            <div class="bg-slate-950/75 border border-sky-500/35 rounded-3xl p-4 sm:p-5 space-y-5">
                <div class="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/35 text-sky-300 text-[11px] font-black mb-1.5">
                            ⏱️ ${isEn ? "CARDIO & DAY-OVER-DAY EVALUATION" : "الكارديو داخل التمرين + تقييم الأداء اليومي"}
                        </div>
                        <h4 class="text-lg font-black text-white">${isEn ? "Treadmill, Stationary Bike & Elliptical Tracker" : "السير الكهربائي + السايكل + الأوبتكال مع مقارنة اليوم باليوم السابق"}</h4>
                        <p class="text-xs text-gray-400 mt-0.5">${isEn ? "Inspect proper machine posture with photos, run the timer, and measure daily progression." : "اختر الجهاز لرؤية شرحه بالصورة، شغّل المؤقت أو أدخل الوقت لقياس تقدمك عن اليوم السابق."}</p>
                    </div>
                </div>

                <!-- بطاقات أجهزة الكارديو الثلاثة بالصور التوضيحية -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    ${catalog.map(m => {
                        const rawEx = typeof getExerciseById === "function" ? getExerciseById(m.exerciseId) : null;
                        const ex = (rawEx && typeof IronI18n !== "undefined") ? IronI18n.trExercise(rawEx) : rawEx;
                        const isSelected = m.key === s.machineKey;
                        const dispName = isEn ? m.nameEn : m.nameAr;
                        const badge = isEn ? m.badgeEn : m.badgeAr;
                        return `
                            <div onclick="IronApp.setStandaloneCardioMachine('${m.key}')"
                                class="rounded-2xl border overflow-hidden cursor-pointer transition flex flex-col justify-between ${isSelected ? 'bg-sky-950/35 border-sky-400 shadow-lg shadow-sky-500/15' : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'}">
                                ${ex ? `
                                    <div class="relative h-44 bg-slate-950 overflow-hidden">
                                        <img src="${ex.gif}" onerror="this.onerror=null;this.src=IronApp.getExerciseFallbackSvg('${m.nameEn}')"
                                            class="w-full h-full object-cover" alt="${dispName}">
                                        <div class="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-950/85 text-[10px] font-black text-sky-300 border border-sky-500/35">
                                            ${badge}
                                        </div>
                                        ${isSelected ? `<div class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-sky-500 text-slate-950 text-[10px] font-black">✓ ${isEn ? "Selected" : "محدد"}</div>` : ""}
                                    </div>
                                ` : ""}
                                <div class="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h5 class="font-black text-white text-sm">${m.icon} ${dispName}</h5>
                                        ${ex ? `<p class="text-[11px] text-gray-300 mt-1 line-clamp-2 leading-relaxed">${ex.execution}</p>` : ""}
                                    </div>
                                    ${ex ? `
                                        <button type="button" onclick="event.stopPropagation(); IronApp.openExerciseDetail('${ex.id}')"
                                            class="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 text-[11px] font-black transition">
                                            📷 ${isEn ? "Full Technique & Mistakes" : "شرح الأداء والأخطاء الكامل ←"}
                                        </button>
                                    ` : ""}
                                </div>
                            </div>
                        `;
                    }).join("")}
                </div>

                <!-- مسجل التوقيت الفوري والمقارنة باليوم السابق -->
                <div class="bg-slate-900/85 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <div class="font-black text-xs text-white">${isEn ? `Selected Machine: ${selectedMeta.icon || ''} ${selectedMeta.nameEn || ''}` : `الجهاز المحدد للتسجيل: ${selectedMeta.icon || ''} ${selectedMeta.nameAr || ''}`}</div>
                        <div class="flex flex-wrap gap-1.5">
                            ${[10, 15, 20, 30, 45].map(min => `
                                <button type="button" onclick="IronApp.setStandaloneCardioMinutes(${min})"
                                    class="px-2.5 py-1 rounded-lg text-[11px] font-black transition ${Number(s.minutes) === min ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}">
                                    ${min} ${isEn ? "m" : "د"}
                                </button>
                            `).join("")}
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 items-center">
                        <div class="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-2">
                            <span id="standaloneCardioClockText" class="font-mono text-sm font-black text-amber-300 px-2">${clockStr}</span>
                            <button type="button" onclick="IronApp.toggleStandaloneCardioStopwatch()"
                                class="flex-1 py-1.5 rounded-lg text-xs font-black transition ${s.stopwatchRunning ? 'bg-amber-500 text-slate-950' : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'}">
                                ${s.stopwatchRunning ? (isEn ? "⏸ Pause Timer" : "⏸ إيقاف المؤقت") : (isEn ? "▶ Start Stopwatch" : "▶ تشغيل المؤقت")}
                            </button>
                            <button type="button" onclick="IronApp.resetStandaloneCardioStopwatch()" title="Reset"
                                class="px-2.5 py-1.5 rounded-lg bg-slate-800 text-gray-300 hover:text-white text-xs font-bold">🔄</button>
                        </div>

                        <div class="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
                            <label class="text-[11px] text-gray-300 font-bold whitespace-nowrap">${isEn ? "Minutes:" : "المدة (بالدقائق):"}</label>
                            <input id="standaloneCardioMinInput" type="number" min="1" max="240" value="${s.minutes || 20}"
                                oninput="IronApp.setStandaloneCardioMinutes(this.value)"
                                class="w-full bg-transparent text-center font-mono text-sm font-black text-sky-300 outline-none">
                        </div>

                        <input type="text" value="${(s.speedOrNote || '').replace(/"/g, '&quot;')}"
                            oninput="IronApp.setStandaloneCardioNote(this.value)"
                            placeholder="${isEn ? (selectedMeta.targetHintEn || 'Speed / Incline / Level') : (selectedMeta.targetHintAr || 'السرعة / الميلان / المستوى')}"
                            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-sky-500">
                    </div>

                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950/90 border border-slate-800 rounded-xl p-3">
                        <div class="text-xs">${compHtml}</div>
                        <button type="button" onclick="IronApp.saveStandaloneCardio()"
                            class="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-sky-500/20 hover:opacity-90 transition whitespace-nowrap">
                            ${isEn ? "Save Cardio & Evaluate Today ✅" : "حفظ الكارديو وتقييم التطور ✅"}
                        </button>
                    </div>
                </div>

                <!-- منحنى المقارنة اليومي وسجل الأيام السابقة -->
                ${this.renderCardioChartSvg(timeline)}

                <div class="space-y-2">
                    <h5 class="text-xs font-black text-gray-200">📋 ${isEn ? `Day-by-Day Cardio Evaluation History (${timeline.length})` : `سجل مقارنة الكارديو كل يوم باليوم السابق (${timeline.length})`}</h5>
                    ${timeline.length === 0 ? `
                        <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-center text-xs text-gray-400">
                            ${isEn ? "No cardio sessions logged yet. Start the timer above and save your first session to begin day-over-day comparison!" : "لا توجد جلسات كارديو مسجلة بعد. ابدأ المؤقت أعلاه واحفظ أول جلسة لقياس تطورك كل يوم عن اليوم السابق!"}
                        </div>
                    ` : `
                        <div class="space-y-2">
                            ${timeline.map(item => {
                                const dt = item.date ? new Date(item.date).toLocaleDateString(isEn ? "en-US" : "ar-EG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "";
                                const badge = item.trend === "first"
                                    ? `<span class="px-2 py-0.5 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[11px] font-black">🆕 ${isEn ? "First Log" : "نقطة البداية"}</span>`
                                    : item.deltaMinutes > 0
                                    ? `<span class="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 text-[11px] font-black">📈 +${item.deltaMinutes} ${isEn ? "min vs prev" : "د تحسن عن السابق"}</span>`
                                    : item.deltaMinutes === 0
                                    ? `<span class="px-2 py-0.5 rounded-lg bg-sky-500/15 text-sky-300 border border-sky-500/35 text-[11px] font-black">🎯 ${isEn ? "Matched prev" : "ثبات عن السابق"}</span>`
                                    : `<span class="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/35 text-[11px] font-black">📉 ${item.deltaMinutes} ${isEn ? "min vs prev" : "د عن السابق"}</span>`;
                                return `
                                    <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                                        <div class="flex items-center gap-2.5 min-w-0">
                                            <span class="text-lg">${item.icon}</span>
                                            <div class="min-w-0">
                                                <div class="font-black text-white">${isEn ? item.machineNameEn : item.machineNameAr} • <span class="text-sky-300">${item.durationMinutes} ${isEn ? "min" : "دقيقة"}</span></div>
                                                <div class="text-[11px] text-gray-400">${dt}${item.speedOrNote ? ` • ${item.speedOrNote}` : ""}</div>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            ${badge}
                                            <button type="button" onclick="IronApp.deleteWorkoutLog('${item.logId}')" class="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-bold">🗑️</button>
                                        </div>
                                    </div>
                                `;
                            }).join("")}
                        </div>
                    `}
                </div>
            </div>
        `;
    },

    renderSpecialtyProgramView(progId) {
        const container = document.getElementById("workoutSpecialtyProgramBox");
        if (!container || typeof getProgramById !== "function") return;
        const prog = getProgramById(progId);
        if (!prog) return;
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();

        const user = typeof IronAuth !== "undefined" ? IronAuth.getCurrentUser() : null;
        const traineeId = user?.id || null;
        const allLogs = (typeof IronSupabase !== "undefined" && Array.isArray(IronSupabase.cache.workoutLogs))
            ? IronSupabase.cache.workoutLogs
            : [];
        const progLogs = traineeId ? allLogs.filter(l => l.traineeId === traineeId && l.programId === prog.id) : [];

        container.innerHTML = `
            <div class="space-y-4">
                ${prog.isPostpartumSafety ? `
                    <div class="csection-safety-banner bg-rose-950/45 border border-rose-500/45 rounded-2xl p-4 text-xs leading-relaxed">
                        <strong class="text-rose-300 font-black block mb-1">${this.t("csection_safety_title")}</strong>
                        <p class="text-rose-100">${this.t("csection_safety_desc")}</p>
                    </div>
                ` : ""}

                <div class="bg-slate-950/75 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div class="space-y-1 flex-1">
                        <div class="flex flex-wrap gap-2">
                            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black ${prog.isPostpartumSafety ? 'bg-rose-500/15 text-rose-300 border border-rose-500/35' : 'bg-amber-500/15 text-amber-300 border border-amber-500/35'}">${prog.level}</span>
                            <span class="px-2.5 py-0.5 rounded-full bg-slate-900 text-cyan-300 border border-slate-700 text-[10px] font-bold">${prog.frequency}</span>
                        </div>
                        <h4 class="text-lg font-black text-white">${isEn ? prog.nameEn : prog.nameAr}</h4>
                        <p class="text-xs text-gray-300 leading-relaxed">${isEn ? (prog.descriptionEn || prog.description) : prog.description}</p>
                    </div>
                    ${prog.image ? `<img src="${prog.image}" onerror="this.style.display='none'" class="w-full sm:w-44 h-28 rounded-xl object-cover border border-slate-800 bg-slate-950 flex-shrink-0" alt="${prog.nameEn}">` : ""}
                </div>

                <div class="space-y-4">
                    ${prog.days.map(day => {
                        const dayLogs = progLogs.filter(l => l.dayTitle === day.title);
                        const latestLog = dayLogs[0] || null;
                        return `
                            <div class="bg-slate-950/75 border border-slate-800 rounded-2xl p-4 sm:p-5">
                                <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4" dir="ltr">
                                    <div>
                                        <h5 class="font-black text-white text-sm sm:text-base">${day.title}</h5>
                                        <div class="text-xs text-amber-400 font-bold mt-0.5">${day.targetMuscles}</div>
                                        ${latestLog ? `<div class="text-[11px] font-black text-emerald-300 mt-1">✓ ${isEn ? `Completed (${latestLog.completedSets}/${latestLog.totalSets} sets)` : `منجز (${latestLog.completedSets}/${latestLog.totalSets} جولات)`}</div>` : ""}
                                    </div>
                                    <button onclick="IronApp.startLiveWorkout('${prog.id}', '${day.dayId}')"
                                        class="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-90 transition">
                                        ${this.t("wo_start_btn")}
                                    </button>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
                                    ${day.exercises.map((item, idx) => {
                                        const rawEx = typeof getExerciseById === "function" ? getExerciseById(item.exerciseId) : null;
                                        if (!rawEx) return "";
                                        const ex = typeof IronI18n !== "undefined" ? IronI18n.trExercise(rawEx) : rawEx;
                                        const dispName = isEn ? (item.displayNameEn || ex.nameEn) : ex.nameAr;
                                        const safeLabel = (item.displayNameEn || ex.nameEn).replace(/'/g, "\\'");
                                        return `
                                            <div onclick="IronApp.openExerciseDetail('${ex.id}', '${safeLabel}')"
                                                class="bg-slate-900/80 border border-slate-800/80 rounded-xl p-2.5 sm:p-3 flex items-start gap-3 hover:border-emerald-500/45 cursor-pointer transition">
                                                <div class="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5">
                                                    ${idx + 1}
                                                </div>
                                                <img src="${ex.gif}" onerror="this.onerror=null;this.src=IronApp.getExerciseFallbackSvg('${ex.nameEn}')"
                                                    class="w-16 h-16 rounded-xl object-contain bg-slate-950 border border-slate-800 flex-shrink-0" alt="${dispName}" loading="lazy">
                                                <div class="flex-1 min-w-0">
                                                    <h6 class="font-black text-white text-xs truncate">${dispName}</h6>
                                                    <div class="text-[10px] text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">${ex.execution}</div>
                                                    <div class="flex items-center gap-2 text-[11px] font-bold mt-1.5 flex-wrap">
                                                        <span class="text-emerald-400">${item.sets} × ${item.reps}</span>
                                                        <span class="text-gray-400">• ${isEn ? `Rest ${item.restSec}s` : `راحة ${item.restSec}ث`}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        `;
                                    }).join("")}
                                </div>
                                ${this.renderDayCardioStripHtml(prog.id, day.dayId)}
                            </div>
                        `;
                    }).join("")}
                </div>
            </div>
        `;
    },

    // فتح شاشة التمرين التفاعلي في الجيم
    startLiveWorkout(progId, dayId) {
        const success = IronLiveGym.startWorkoutSession(progId, dayId);
        if (success) {
            openModal("liveGymModal");
        }
    },

    // رسم شبكة مكتبة التمارين
    renderExercisesGrid() {
        const grid = document.getElementById("exercisesGrid");
        if (!grid) return;

        const access = this.updateConditionalWorkoutVisibility();
        const query = (document.getElementById("exerciseSearchInput")?.value || "").toLowerCase();
        let list = exercisesDatabase.filter(e => {
            if (e.muscle === "تمارين منزلية" && !access.allowHome) return false;
            if (e.muscle === "بعد الولادة القيصرية" && !access.allowCSection) return false;
            return true;
        });

        if (this.currentExerciseMuscle !== "all") {
            list = list.filter(e => e.muscle === this.currentExerciseMuscle);
        }

        if (query.trim() !== "") {
            list = list.filter(e => e.nameAr.toLowerCase().includes(query) || e.nameEn.toLowerCase().includes(query));
        }

        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const trMuscle = (m) => typeof IronI18n !== "undefined" ? IronI18n.translateMuscle(m) : m;

        grid.innerHTML = list.map(rawEx => {
            const e = typeof IronI18n !== "undefined" ? IronI18n.trExercise(rawEx) : rawEx;
            return `
            <div onclick="IronApp.openExerciseDetail('${e.id}')" class="exercise-card bg-slate-950/60 border border-slate-800/80 rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between">
                <div class="relative h-48 w-full bg-slate-950 overflow-hidden flex items-center justify-center p-2">
                    <img src="${e.gif}" onerror="this.onerror=null;this.src=IronApp.getExerciseFallbackSvg('${trMuscle(e.muscle)}')" class="w-full h-full object-contain" alt="${e.nameEn}" loading="lazy">
                    <div class="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur text-[11px] font-bold text-emerald-400 border border-emerald-500/20">
                        ${trMuscle(e.muscle)}
                    </div>
                </div>

                <div class="p-4 flex-1 flex flex-col justify-between">
                    <div>
                        <h4 class="font-black text-white text-sm">${isEn ? e.nameEn : e.nameAr}</h4>
                        <div class="text-xs text-gray-400 font-mono mb-2">${isEn ? trMuscle(e.muscle) : e.nameEn}</div>
                        <p class="text-xs text-gray-300 line-clamp-2 leading-relaxed mb-3">${e.setup}</p>
                    </div>

                    <div class="flex items-center justify-between border-t border-slate-800/80 pt-3">
                        <span class="text-[11px] text-gray-400">${this.t("ex_tool", { tool: e.equipment })}</span>
                        <span class="text-xs font-bold text-emerald-400">${this.t("ex_details_link")}</span>
                    </div>
                </div>
            </div>
        `;
        }).join("");
    },

    setExerciseMuscle(muscle) {
        const access = this.getTraineeFeatureAccess();
        if ((muscle === "تمارين منزلية" && !access.allowHome) ||
            (muscle === "بعد الولادة القيصرية" && !access.allowCSection)) {
            muscle = "all";
        }
        this.currentExerciseMuscle = muscle;
        document.querySelectorAll(".ex-muscle-btn").forEach(btn => {
            const btnMuscle = btn.getAttribute("data-muscle");
            const isHidden = (btnMuscle === "تمارين منزلية" && !access.allowHome) || (btnMuscle === "بعد الولادة القيصرية" && !access.allowCSection);
            const hideCls = isHidden ? " hidden" : "";
            if (btnMuscle === muscle) {
                btn.className = `ex-muscle-btn px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950${hideCls}`;
            } else {
                btn.className = `ex-muscle-btn px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-gray-300${hideCls}`;
            }
        });
        this.renderExercisesGrid();
    },

    filterExercises() {
        this.renderExercisesGrid();
    },

    // فتح تفاصيل التمرين الكاملة
    openExerciseDetail(exId, customNameEn = null) {
        const rawEx = getExerciseById(exId);
        const container = document.getElementById("exerciseDetailModalContent");
        if (!container || !rawEx) return;

        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const trMuscle = (m) => typeof IronI18n !== "undefined" ? IronI18n.translateMuscle(m) : m;
        const ex = typeof IronI18n !== "undefined" ? IronI18n.trExercise(rawEx) : rawEx;
        const alternatives = getAlternativeExercises(exId);
        const titleEn = customNameEn || ex.nameEn;

        container.innerHTML = `
            <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div dir="ltr" class="text-left">
                    <span class="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">${trMuscle(ex.muscle)}</span>
                    <h3 class="text-lg font-black text-white mt-1">${titleEn}</h3>
                    ${!isEn ? `<div class="text-xs text-gray-400 font-bold">${ex.nameAr}</div>` : ''}
                </div>
                <button onclick="closeModal('exerciseDetailModal')" class="text-gray-400 hover:text-white text-xl">✕</button>
            </div>

            <div class="w-full h-56 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 mb-4 flex items-center justify-center p-2">
                <img src="${ex.gif}" onerror="this.onerror=null;this.src=IronApp.getExerciseFallbackSvg('${trMuscle(ex.muscle)}')" class="w-full h-full object-contain" alt="${titleEn}">
            </div>

            <div class="space-y-4 text-xs leading-relaxed">
                <div class="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                    <strong class="text-emerald-400 block mb-1">${isEn ? '🏁 Setup & Positioning:' : '🏁 وضعية الاستعداد والتثبيت (Setup):'}</strong>
                    <p class="text-gray-300">${ex.setup}</p>
                </div>

                <div class="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                    <strong class="text-emerald-400 block mb-1">${isEn ? '🚀 Execution (Step-by-Step):' : '🚀 طريقة الأداء الصحيح خطوة بخطوة:'}</strong>
                    <p class="text-gray-300">${ex.execution}</p>
                </div>

                <div class="bg-rose-950/20 p-3.5 rounded-xl border border-rose-500/30">
                    <strong class="text-rose-400 block mb-1">${isEn ? '⚠️ Common Mistakes to Avoid:' : '⚠️ أبرز الأخطاء الشائعة لتجنب الإصابة:'}</strong>
                    <ul class="list-disc list-inside text-gray-300 space-y-1">
                        ${ex.mistakes.map(m => `<li>${m}</li>`).join('')}
                    </ul>
                </div>

                <div class="bg-cyan-950/20 p-3.5 rounded-xl border border-cyan-500/30">
                    <strong class="text-cyan-400 block mb-1">${isEn ? '💨 Proper Breathing Technique:' : '💨 تكنيك التنفس الصحيح:'}</strong>
                    <p class="text-gray-300">${ex.breathing}</p>
                </div>

                ${alternatives.length > 0 ? `
                    <div class="border-t border-slate-800 pt-3">
                        <strong class="text-amber-400 block mb-2">${isEn ? '⚡ Alternative Exercises:' : '⚡ التمارين البديلة (إذا كان الجهاز مشغولاً):'}</strong>
                        <div class="grid grid-cols-2 gap-2">
                            ${alternatives.map(rawAlt => {
                                const alt = typeof IronI18n !== "undefined" ? IronI18n.trExercise(rawAlt) : rawAlt;
                                return `
                                <div onclick="IronApp.openExerciseDetail('${alt.id}')" class="bg-slate-900 p-2.5 rounded-xl border border-slate-800 hover:border-amber-500/40 cursor-pointer flex items-center gap-2">
                                    <img src="${alt.gif}" onerror="this.onerror=null;this.src=IronApp.getExerciseFallbackSvg('${trMuscle(alt.muscle)}')" class="w-10 h-10 rounded-lg object-contain bg-slate-950" alt="${alt.nameEn}">
                                    <div class="min-w-0">
                                        <div class="font-bold text-white text-[11px] truncate">${isEn ? alt.nameEn : alt.nameAr}</div>
                                        <div class="text-[9px] text-gray-400 truncate">${alt.equipment}</div>
                                    </div>
                                </div>
                            `;
                            }).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        openModal("exerciseDetailModal");
    },

    // إرسال المتابعة الأسبوعية
    handleCheckinSubmit(e) {
        e.preventDefault();
        const weight = document.getElementById("chkWeight").value;
        const waist = document.getElementById("chkWaist").value;
        const adherence = document.getElementById("chkAdherence").value;
        const energy = document.getElementById("chkEnergy").value;
        const notes = document.getElementById("chkNotes").value;

        IronCheckinSync.sendWeeklyCheckin({
            currentWeight: weight,
            waist,
            adherenceRating: adherence,
            workoutEnergy: energy,
            notes
        });
    },

    initDialCodeSelectors() {
        const savedCode = localStorage.getItem("iron_dial_code") || "+966";
        ["loginCountryCode", "regOauthCountryCode"].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            if ([...el.options].some(o => o.value === savedCode)) {
                el.value = savedCode;
            }
            el.addEventListener("change", () => {
                localStorage.setItem("iron_dial_code", el.value);
                ["loginCountryCode", "regOauthCountryCode"].forEach(otherId => {
                    const other = document.getElementById(otherId);
                    if (other && other !== el && [...other.options].some(o => o.value === el.value)) {
                        other.value = el.value;
                    }
                });
            });
        });
    },

    // دمج كود الدولة/المحافظة مع رقم الجوال (يحذف الصفر الأول) — أو إرجاع اسم المستخدم كما هو للكوتش
    buildFullPhone(countryCode, rawInput) {
        const raw = String(rawInput || "").trim();
        if (!raw) return "";
        if (/[a-zA-Z_@]/.test(raw)) return raw;
        if (raw.startsWith("+") || raw.startsWith("00")) return "+" + raw.replace(/\D/g, "").replace(/^00/, "");
        let digits = raw.replace(/\D/g, "");
        if (!digits) return "";
        if (!countryCode || countryCode === "custom") {
            return "+" + digits;
        }
        const code = String(countryCode).replace(/\D/g, "");
        if (digits.startsWith(code) && digits.length > code.length + 7) return "+" + digits;
        digits = digits.replace(/^0+/, "");
        return `+${code}${digits}`;
    },

    // تسجيل الدخول برقم الجوال (بكود الدولة/المحافظة) + الرقم السري
    async handleLogin(e) {
        e.preventDefault();
        const code = document.getElementById("loginCountryCode")?.value || "+966";
        localStorage.setItem("iron_dial_code", code);
        const u = this.buildFullPhone(code, document.getElementById("loginUsername").value);
        const p = document.getElementById("loginPassword").value;
        const err = document.getElementById("loginError");
        const submitBtn = e.target.querySelector('button[type="submit"]');
        if (err) err.classList.add("hidden");
        if (submitBtn) submitBtn.disabled = true;

        try {
            const res = await IronAuth.login(u, p);
            if (res.success) {
                window.location.reload();
            } else {
                if (err) {
                    err.innerText = res.message || this.t("login_invalid");
                    err.classList.remove("hidden");
                }
            }
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    },

    // تسجيل دخول سريع للحسابات التجريبية للمعاينة
    async quickLogin(u, p) {
        const res = await IronAuth.login(u, p);
        if (res.success) {
            window.location.reload();
        }
    },

    showAuthScreen() {
        IronAuth.logout();
    },

    // إضافة وجبة مخصصة
    async handleAddCustomMeal(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;
        const newMeal = {
            name: form.mealName.value,
            category: form.mealCategory.value,
            ingredients: form.mealIngredients.value,
            calories: parseInt(form.mealCalories.value) || 300,
            protein: parseInt(form.mealProtein.value) || 20,
            carbs: parseInt(form.mealCarbs.value) || 30,
            fats: parseInt(form.mealFats.value) || 10,
            img: form.mealImg.value || "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500"
        };

        try {
            await saveCustomMeal(newMeal);
            closeModal("addCustomMealModal");
            form.reset();
            const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
            showToast(isEn ? "Meal added and saved to your library!" : "تمت إضافة الوجبة وحفظها في مكتبتك بنجاح!", "success");
            this.renderMealsGrid();
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    },

    // حساب السعرات التلقائي عند إضافة متدرب جديد بواسطة الكوتش
    autoCalcNewTraineeCalories() {
        const form = document.getElementById("addTraineeForm");
        if (!form || typeof IronCalculator === "undefined") return;
        const weight = parseFloat(form.tWeight?.value) || 75;
        const height = parseFloat(form.tHeight?.value) || 175;
        const age = parseInt(form.tAge?.value) || 26;
        const gender = form.tGender?.value || "male";
        const activity = parseFloat(form.tActivity?.value) || 1.55;
        const goalStr = form.tGoal?.value || "تنشيف وخسارة دهون";
        const goalOffset = goalStr.includes("تضخيم") ? 350 : goalStr.includes("تثبيت") ? 0 : -500;

        const res = IronCalculator.calculate({ gender, age, weight, height, activity, goal: goalOffset });
        if (form.tCalories) {
            form.tCalories.value = res.targetCalories;
        }
    },

    // إضافة متدرب جديد
    async handleAddTrainee(e) {
        e.preventDefault();
        const form = e.target;
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        const trainee = {
            name: form.tName.value.trim(),
            username: form.tUsername.value.trim().toLowerCase(),
            password: form.tPassword.value.trim() || "123456",
            phone: form.tPhone.value.trim(),
            subscriptionDays: parseInt(form.tDays.value) || 30,
            weight: parseFloat(form.tWeight.value) || 75,
            height: parseFloat(form.tHeight?.value) || 175,
            age: parseInt(form.tAge?.value) || 26,
            gender: form.tGender?.value || "male",
            activity: parseFloat(form.tActivity?.value) || 1.55,
            goal: form.tGoal?.value || "تنشيف وخسارة دهون",
            calories: parseInt(form.tCalories.value) || 2000,
            program: form.tProgram.value,
            coachNote: form.tCoachNote ? form.tCoachNote.value.trim() : "",
            onboardingProfile: {
                trainingLocation: (form.tAllowHome?.checked || this.resolveProgramIdFromName(form.tProgram.value) === "prog_home") ? "home" : "gym",
                postCSection: (form.tGender?.value === "female") && (Boolean(form.tAllowCSection?.checked) || this.resolveProgramIdFromName(form.tProgram.value) === "prog_csection")
            }
        };

        try {
            const added = await IronAuth.addTrainee(trainee);
            closeModal("addTraineeModal");
            form.reset();
            const dispName = typeof IronI18n !== "undefined" ? IronI18n.trName(added || trainee) : trainee.name;
            showToast(isEn ? `Client account created for ${dispName}!` : `تم إنشاء حساب المتدرب ${dispName} بنجاح!`, "success");
            IronCoachPanel.renderCoachDashboard();
        } catch (err) {
            showToast(err?.message || (isEn ? "Failed to add client" : "تعذر إنشاء حساب المشترك"), "error");
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    },

    // حفظ إعدادات الكوتش
    handleSaveCoachSettings(e) {
        e.preventDefault();
        IronCoachPanel.saveCoachSettings(e.target);
    },

    // معاينة إيصال الدفع المرفق في نافذة التجديد
    handleReceiptFileChange(input) {
        const previewBox = document.getElementById("receiptPreviewBox");
        const errorBox = document.getElementById("receiptUploadError");
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        if (errorBox) errorBox.classList.add("hidden");

        if (!input.files || !input.files[0]) {
            if (previewBox) previewBox.classList.add("hidden");
            return;
        }

        const file = input.files[0];
        if (previewBox) {
            const sizeKB = Math.max(1, Math.round(file.size / 1024));
            previewBox.innerHTML = isEn
                ? `✅ Receipt attached: <strong class="text-white">${file.name}</strong> (${sizeKB} KB)`
                : `✅ تم إرفاق الإيصال: <strong class="text-white">${file.name}</strong> (${sizeKB} KB)`;
            previewBox.classList.remove("hidden");
        }
    },

    selectedSubscriptionMonths: 1,

    getSubscriptionTierInfo(months = this.selectedSubscriptionMonths) {
        const m = months !== undefined && months !== null ? Number(months) : 1;
        const config = getAppConfig();
        const currencyTxt = typeof IronI18n !== "undefined"
            ? IronI18n.trCurrency(config.subscriptionPrice?.currency || "ر.س")
            : (config.subscriptionPrice?.currency || "ر.س");
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();

        if (m === 0) {
            return {
                months: 0,
                days: 1,
                price: 1,
                currencyTxt,
                title: isEn ? "1-Day Trial (1 Day)" : "باقة تجربة يوم واحد (1 يوم)"
            };
        }
        if (m === 3) {
            return {
                months: 3,
                days: 90,
                price: 299,
                currencyTxt,
                title: isEn ? "3 Months (90 Days)" : "باقة 3 شهور (90 يوماً)"
            };
        }
        if (m === 2) {
            return {
                months: 2,
                days: 60,
                price: 239,
                currencyTxt,
                title: isEn ? "2 Months (60 Days)" : "باقة شهرين (60 يوماً)"
            };
        }
        return {
            months: 1,
            days: 30,
            price: 139,
            currencyTxt,
            title: isEn ? "1 Month (30 Days)" : "باقة شهر واحد (30 يوماً)"
        };
    },

    selectSubscriptionTier(months = 1) {
        const tier = this.getSubscriptionTierInfo(months);
        this.selectedSubscriptionMonths = tier.months;

        document.querySelectorAll(".sub-tier-card").forEach(btn => {
            const rawAttr = btn.getAttribute("data-tier-months");
            const btnMonths = rawAttr !== null ? Number(rawAttr) : 1;
            if (btnMonths === tier.months) {
                btn.className = "sub-tier-card p-2.5 rounded-xl border-2 border-emerald-500 bg-emerald-500/20 text-center transition shadow-md shadow-emerald-500/15";
            } else {
                btn.className = "sub-tier-card p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 text-center transition";
            }
        });

        const expPriceEl = document.getElementById("expiredPriceDisplay");
        const modPriceEl = document.getElementById("renewModalPrice");
        const expLabelEl = document.getElementById("expiredSelectedTierText");
        const modLabelEl = document.getElementById("modalSelectedTierText");

        if (expPriceEl) expPriceEl.innerText = `${tier.price} ${tier.currencyTxt}`;
        if (modPriceEl) modPriceEl.innerText = `${tier.price} ${tier.currencyTxt}`;
        if (expLabelEl) expLabelEl.innerText = tier.title;
        if (modLabelEl) modLabelEl.innerText = tier.title;
    },

    openRenewPaymentModal() {
        const config = getAppConfig();
        const vodafone = document.getElementById("renewModalVodafone");
        const instapay = document.getElementById("renewModalInstapay");
        const stc = document.getElementById("renewModalStc");
        const iban = document.getElementById("renewModalIban");
        const stripe = document.getElementById("renewStripeLink");
        const fileInput = document.getElementById("receiptUploadInput");
        const previewBox = document.getElementById("receiptPreviewBox");
        const errorBox = document.getElementById("receiptUploadError");
        const activeBox = document.getElementById("activeTransferActionBox");

        this.selectSubscriptionTier(this.selectedSubscriptionMonths !== undefined ? this.selectedSubscriptionMonths : 1);
        if (vodafone) vodafone.innerText = config.coachInfo.vodafoneCash || "01274300663";
        if (instapay) instapay.innerText = config.coachInfo.instapayUser || "mahmoudsaeed291997@instapay";
        if (stc) stc.innerText = config.coachInfo.stcPay || "966563055827";
        if (iban) iban.innerText = config.coachInfo.bankIban || "SA4180000644608017933823";
        const barq = document.getElementById("renewModalBarq");
        if (barq) barq.innerText = config.coachInfo.barqWallet || config.coachInfo.stcPay || "966563055827";
        if (stripe) {
            const link = (config.coachInfo.paymentLink || "").trim();
            const isValidGateway = link && !link.includes("buy.stripe.com/demo");
            stripe.href = isValidGateway ? link : "#";
        }
        if (fileInput) fileInput.value = "";
        if (previewBox) previewBox.classList.add("hidden");
        if (errorBox) errorBox.classList.add("hidden");
        if (activeBox) activeBox.classList.add("hidden");

        openModal("renewModal");
    },

    getPaymentMethodDetails(method) {
        const config = getAppConfig();
        const ci = config.coachInfo || {};
        const tier = this.getSubscriptionTierInfo(this.selectedSubscriptionMonths !== undefined ? this.selectedSubscriptionMonths : 1);
        const amount = tier.price;
        const currencyTxt = tier.currencyTxt;
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();

        const map = {
            iban: {
                label: isEn ? "Al Rajhi Bank (IBAN)" : "مصرف الراجحي (IBAN)",
                value: ci.bankIban || "SA4180000644608017933823",
                bankName: ci.bankName || (isEn ? "Al Rajhi Bank" : "مصرف الراجحي"),
                amount,
                currencyTxt
            },
            instapay: {
                label: "InstaPay",
                value: ci.instapayUser || "mahmoudsaeed291997@instapay",
                amount,
                currencyTxt
            },
            vodafone: {
                label: isEn ? "Orange Cash (Wallet)" : "أورانج كاش (محفظة)",
                value: ci.vodafoneCash || "01274300663",
                amount,
                currencyTxt
            },
            stc: {
                label: "STC Pay",
                value: ci.stcPay || "966563055827",
                amount,
                currencyTxt
            },
            barq: {
                label: isEn ? "Barq Wallet" : "محفظة برق (Barq)",
                value: ci.barqWallet || ci.stcPay || "966563055827",
                amount,
                currencyTxt
            }
        };
        return map[method] || map.iban;
    },

    async copyPaymentValue(method) {
        const info = this.getPaymentMethodDetails(method);
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(info.value);
            } else {
                const ta = document.createElement("textarea");
                ta.value = info.value;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                ta.remove();
            }
            showToast(
                isEn
                    ? `Copied ${info.label}: ${info.value} ✅`
                    : `تم نسخ بيانات ${info.label}: (${info.value}) بنجاح ✅`,
                "success"
            );
        } catch {
            showToast(info.value, "success");
        }
        return info;
    },

    async triggerDirectTransfer(method) {
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const renewModal = document.getElementById("renewModal");
        if (renewModal && !renewModal.classList.contains("active")) {
            this.openRenewPaymentModal();
        }

        const info = await this.copyPaymentValue(method);
        const activeBox = document.getElementById("activeTransferActionBox");

        let actionButtonHtml = "";
        let instructionHtml = "";

        if (method === "vodafone") {
            const cleanDigits = info.value.replace(/\D/g, "");
            const ussdUri = `tel:%237115%23`;
            instructionHtml = isEn
                ? `Orange Cash number <strong class="text-white font-mono">${info.value}</strong> copied! Open the Orange Cash app (or dial #7115#) and send <strong class="text-emerald-400">${info.amount} ${info.currencyTxt}</strong>, then attach the receipt below.`
                : `تم نسخ رقم محفظة أورانج كاش <strong class="text-white font-mono">${info.value}</strong> تلقائياً! افتح تطبيق أورانج كاش (أو اطلب ‎#7115#) وحوّل مبلغ <strong class="text-emerald-400">${info.amount} ${info.currencyTxt}</strong> ثم ارفع صورة الإيصال بالأسفل.`;
            actionButtonHtml = `
                <a href="${ussdUri}" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition">
                    <span>🍊 ${isEn ? "Dial Orange Cash (#7115#)" : "فتح أورانج كاش (#7115#)"}</span>
                </a>
                <button type="button" onclick="document.getElementById('receiptUploadInput')?.click()" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs hover:bg-emerald-400 transition">
                    <span>📸 ${isEn ? `Attach Receipt (${cleanDigits})` : "إرفاق الإيصال"}</span>
                </button>
            `;
        } else if (method === "barq") {
            instructionHtml = isEn
                ? `Barq wallet number <strong class="text-white font-mono">${info.value}</strong> copied! Open the Barq app and transfer <strong class="text-emerald-400">${info.amount} ${info.currencyTxt}</strong> to this number, then attach the receipt below.`
                : `تم نسخ رقم محفظة برق <strong class="text-white font-mono">${info.value}</strong> تلقائياً! افتح تطبيق برق وحوّل مبلغ <strong class="text-emerald-400">${info.amount} ${info.currencyTxt}</strong> للرقم المنسوخ ثم ارفع صورة الإيصال بالأسفل.`;
            actionButtonHtml = `
                <button type="button" onclick="document.getElementById('receiptUploadInput')?.click()" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs hover:bg-emerald-400 transition">
                    <span>📸 ${isEn ? "Attach Barq Receipt" : "إرفاق إيصال تحويل برق"}</span>
                </button>
            `;
        } else if (method === "instapay") {
            const isAndroid = /Android/i.test(navigator.userAgent || "");
            const instapayHref = isAndroid
                ? "intent://ipn#Intent;scheme=instapay;package=com.egyptianbanks.instapay;end"
                : "https://www.instapay.eg/";
            instructionHtml = isEn
                ? `InstaPay address <strong class="text-white font-mono">${info.value}</strong> copied! Open InstaPay, paste the address to send <strong class="text-emerald-400">${info.amount} ${info.currencyTxt}</strong>, then attach your receipt screenshot below.`
                : `تم نسخ عنوان الدفع <strong class="text-white font-mono">${info.value}</strong> في الحافظة! افتح تطبيق InstaPay والصق العنوان لتحويل <strong class="text-emerald-400">${info.amount} ${info.currencyTxt}</strong> ثم ارفع صورة الإيصال بالأسفل.`;
            actionButtonHtml = `
                <a href="${instapayHref}" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs hover:bg-emerald-400 transition">
                    <span>⚡ ${isEn ? "Open InstaPay & Paste Address" : "فتح تطبيق InstaPay للتحويل"}</span>
                </a>
            `;
        } else if (method === "stc") {
            const cleanDigits = info.value.replace(/\D/g, "");
            instructionHtml = isEn
                ? `STC Pay number <strong class="text-white font-mono">${info.value}</strong> copied! Open STC Pay and transfer <strong class="text-emerald-400">${info.amount} ${info.currencyTxt}</strong> to this number, then attach the transfer receipt below.`
                : `تم نسخ رقم STC Pay <strong class="text-white font-mono">${info.value}</strong> تلقائياً! افتح تطبيق STC Pay وحوّل مبلغ <strong class="text-emerald-400">${info.amount} ${info.currencyTxt}</strong> للرقم المنسوخ ثم ارفع صورة الإيصال بالأسفل.`;
            actionButtonHtml = `
                <button type="button" onclick="document.getElementById('receiptUploadInput')?.click()" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs hover:bg-emerald-400 transition">
                    <span>📸 ${isEn ? `Attach STC Pay Receipt (${cleanDigits})` : "إرفاق إيصال تحويل STC Pay الآن"}</span>
                </button>
            `;
        } else {
            instructionHtml = isEn
                ? `Bank IBAN <strong class="text-amber-400 font-mono">${info.value}</strong> (${info.bankName}) copied! Paste the IBAN in your banking app to transfer <strong class="text-emerald-400">${info.amount} ${info.currencyTxt}</strong>, then attach the transfer receipt below.`
                : `تم نسخ رقم الآيبان البنكي <strong class="text-amber-400 font-mono">${info.value}</strong> (${info.bankName}) تلقائياً! الصق الآيبان في تطبيق البنك لتحويل <strong class="text-emerald-400">${info.amount} ${info.currencyTxt}</strong> ثم ارفع صورة الإيصال بالأسفل.`;
            actionButtonHtml = `
                <button type="button" onclick="document.getElementById('receiptUploadInput')?.click()" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs hover:bg-emerald-400 transition">
                    <span>📸 ${isEn ? "Attach Bank Transfer Receipt" : "إرفاق صورة إيصال التحويل البنكي"}</span>
                </button>
            `;
        }

        if (activeBox) {
            activeBox.innerHTML = `
                <div class="font-black text-emerald-400 flex items-center justify-between">
                    <span>✅ ${isEn ? `Active Transfer: ${info.label}` : `تحويل نشط: ${info.label}`}</span>
                    <span class="font-mono text-white">${info.amount} ${info.currencyTxt}</span>
                </div>
                <p class="text-gray-200 leading-relaxed">${instructionHtml}</p>
                <div class="pt-1 flex flex-wrap items-center gap-2">
                    ${actionButtonHtml}
                </div>
            `;
            activeBox.classList.remove("hidden");
        }
    },

    // رفع إيصال التحويل إلى التخزين السحابي وإرساله لمراجعة الكوتش
    async confirmRenewalPayment() {
        const fileInput = document.getElementById("receiptUploadInput");
        const errorBox = document.getElementById("receiptUploadError");
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();

        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            const errMsg = isEn ? "⚠️ Please attach your payment transfer receipt first" : "⚠️ يرجى اختيار وإرفاق صورة إيصال التحويل أولاً لتأكيد التجديد";
            if (errorBox) {
                errorBox.innerText = errMsg;
                errorBox.classList.remove("hidden");
            }
            showToast(errMsg, "error");
            return;
        }

        const receiptFile = fileInput.files[0];
        const user = IronAuth.getCurrentUser();
        if (!user || user.role !== "trainee") return;

        const submitBtn = document.querySelector("#renewModal button[onclick*='confirmRenewalPayment']");
        if (submitBtn) submitBtn.disabled = true;

        try {
            const authUid = user.traineeData?.authUserId || (await IronSupabase.initClient().auth.getUser()).data?.user?.id;
            const { path, error } = await IronSupabase.uploadReceiptFile(authUid, receiptFile);
            if (error || !path) {
                throw new Error(error || "Upload failed");
            }
            const tier = this.getSubscriptionTierInfo(this.selectedSubscriptionMonths !== undefined ? this.selectedSubscriptionMonths : 1);
            await IronAuth.submitRenewalReceipt(path, receiptFile.name, receiptFile.size, user.id, tier);
            closeModal("renewModal");
            showToast(this.t("receipt_sent_review", { file: receiptFile.name }), "success");
            this.renderAppViews(IronAuth.getCurrentUser());
        } catch (err) {
            const msg = err?.message || (isEn ? "Failed to upload receipt" : "تعذر رفع الإيصال، حاول مرة أخرى");
            if (errorBox) {
                errorBox.innerText = msg;
                errorBox.classList.remove("hidden");
            }
            showToast(msg, "error");
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    },

    contactCoachWhatsapp() {
        const config = getAppConfig();
        const coachPhone = (config.coachInfo.whatsapp || "").replace(/\D/g, '');
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const user = IronAuth.getCurrentUser();
        let text = isEn ? "Hi Coach, I would like to renew my monthly IronCoach Pro subscription." : "مرحباً كوتش، أود تجديد اشتراكي الشهري في أيرون كوتش.";
        if (user && user.status === "pending" && user.traineeData) {
            const tr = user.traineeData;
            const dispName = typeof IronI18n !== "undefined" ? IronI18n.trName(tr) : tr.name;
            const dispGoal = typeof IronI18n !== "undefined" ? IronI18n.trGoal(tr.goal) : tr.goal;
            const dispProv = typeof IronI18n !== "undefined" ? IronI18n.trProvider(tr.authProvider) : (tr.authProvider || "");
            text = isEn
                ? `Hi Coach, I just signed up on IronCoach Pro via ${dispProv}.\nName: ${dispName}\nWeight: ${tr.weight} kg | Target: ${tr.calories} kcal\nGoal: ${dispGoal} | Split: ${tr.program}\nI'm ready to send the subscription payment receipt to activate my 30-day plan.`
                : `مرحباً كوتش، قمت بالتسجيل الآن عبر ${dispProv} في أيرون كوتش.\nالاسم: ${tr.name}\nالوزن: ${tr.weight} كجم | السعرات: ${tr.calories} kcal\nالهدف: ${tr.goal} | الجدول: ${tr.program}\nأود إرسال إيصال الدفع لتفعيل اشتراكي (30 يوماً).`;
        }
        window.open(`https://wa.me/${coachPhone}?text=${encodeURIComponent(text)}`, '_blank');
    },

    // =========================================================================
    // تسجيل اشتراك العملاء الجدد من الصفحة الرئيسية (Google / iCloud / مباشر / Phone OTP)
    // =========================================================================
    signupState: {
        mode: "login",
        provider: null,
        isOAuthOnboarding: false,
        otpToken: null,
        otpTimerId: null,
        verifiedPhone: "",
        verifiedEmail: "",
        verifiedName: "",
        verifiedPassword: ""
    },

    signupWizard: {
        step: 1,
        gender: "male",
        age: 26,
        height: 175,
        weight: 78,
        targetWeight: 72,
        goal: "تنشيف وخسارة دهون",
        fitnessLevel: "متوسط",
        injuries: ["لا يوجد إصابات"],
        trainingLocation: "gym",
        postCSection: false,
        preferredFoods: [],
        dislikedFoods: [],
        name: "",
        phone: "",
        countryCode: localStorage.getItem("iron_dial_code") || "+966",
        password: "",
        selectedPackageMonths: 1
    },

    WIZARD_INJURIES_LIST: [
        { key: "لا يوجد إصابات", ar: "لا يوجد إصابات", en: "No Injuries" },
        { key: "إصابات الظهر", ar: "إصابات الظهر", en: "Back Injury" },
        { key: "إصابات الكتف", ar: "إصابات الكتف", en: "Shoulder Injury" },
        { key: "إصابات الركبة", ar: "إصابات الركبة", en: "Knee Injury" },
        { key: "إصابات الكوع", ar: "إصابات الكوع", en: "Elbow Injury" },
        { key: "إصابات الرسغ واليد", ar: "إصابات الرسغ واليد", en: "Wrist / Hand Injury" },
        { key: "التمزقات العضلية", ar: "التمزقات العضلية", en: "Muscle Tears" },
        { key: "إصابات الأربطة والمفاصل", ar: "إصابات الأربطة والمفاصل", en: "Ligaments & Joints" },
        { key: "إصابات الرقبة", ar: "إصابات الرقبة", en: "Neck Injury" },
        { key: "الفتق", ar: "الفتق", en: "Hernia" },
        { key: "السكري", ar: "السكري", en: "Diabetes" }
    ],

    WIZARD_LIKED_FOODS: [
        { key: "بيض", ar: "بيض", en: "Eggs" },
        { key: "صدور دجاج", ar: "صدور دجاج", en: "Chicken Breast" },
        { key: "لحم", ar: "لحم", en: "Beef" },
        { key: "جمبري", ar: "جمبري", en: "Shrimp" },
        { key: "سمك", ar: "سمك", en: "Fish" },
        { key: "سلمون", ar: "سلمون", en: "Salmon" },
        { key: "تونة", ar: "تونة", en: "Tuna" },
        { key: "أرز", ar: "أرز", en: "Rice" },
        { key: "بطاطس", ar: "بطاطس", en: "Potatoes" },
        { key: "بطاطا حلوة", ar: "بطاطا حلوة", en: "Sweet Potato" },
        { key: "جبنة", ar: "جبنة", en: "Cheese" },
        { key: "مكرونة", ar: "مكرونة", en: "Pasta" },
        { key: "زبادي", ar: "زبادي", en: "Yogurt" },
        { key: "توست بر", ar: "توست بر", en: "Whole Wheat Toast" },
        { key: "حليب", ar: "حليب", en: "Milk" },
        { key: "شوفان", ar: "شوفان", en: "Oats" }
    ],

    WIZARD_DISLIKED_FOODS: [
        { key: "بروكلي", ar: "بروكلي", en: "Broccoli" },
        { key: "خيار", ar: "خيار", en: "Cucumber" },
        { key: "موز", ar: "موز", en: "Banana" },
        { key: "زيت زيتون", ar: "زيت زيتون", en: "Olive Oil" },
        { key: "لوز", ar: "لوز", en: "Almonds" },
        { key: "زبدة الفول السوداني", ar: "زبدة الفول السوداني", en: "Peanut Butter" },
        { key: "سيريلاك الأرز", ar: "سيريلاك الأرز", en: "Rice Cereal" },
        { key: "حمص", ar: "حمص", en: "Chickpeas" },
        { key: "عدس", ar: "عدس", en: "Lentils" },
        { key: "فاصوليا", ar: "فاصوليا", en: "Beans" },
        { key: "حليب اللوز غير المحلى", ar: "حليب اللوز غير المحلى", en: "Almond Milk" },
        { key: "حليب الشوفان", ar: "حليب الشوفان", en: "Oat Milk" },
        { key: "حليب الصويا", ar: "حليب الصويا", en: "Soy Milk" },
        { key: "بازلاء", ar: "بازلاء", en: "Green Peas" },
        { key: "فول", ar: "فول", en: "Fava Beans" },
        { key: "توست الحبوب الكاملة", ar: "توست الحبوب الكاملة", en: "Multigrain Toast" }
    ],

    showSignupError(msg = "") {
        const box = document.getElementById("signupError");
        if (!box) return;
        if (!msg) {
            box.classList.add("hidden");
            box.innerText = "";
        } else {
            box.innerText = msg;
            box.classList.remove("hidden");
        }
    },

    switchAuthMode(mode = "login") {
        this.signupState.mode = mode === "signup" ? "signup" : "login";
        const cardCont = document.getElementById("authCardContainer");
        const loginPanel = document.getElementById("loginPanel");
        const signupCont = document.getElementById("signupContainer");
        const tabLogin = document.getElementById("authTabLogin");
        const tabSignup = document.getElementById("authTabSignup");

        this.showSignupError("");
        const loginErr = document.getElementById("loginError");
        if (loginErr) loginErr.classList.add("hidden");
        const loginOtpErr = document.getElementById("loginOtpError");
        if (loginOtpErr) loginOtpErr.classList.add("hidden");

        if (this.signupState.mode === "signup") {
            if (cardCont) {
                cardCont.classList.remove("max-w-md");
                cardCont.classList.add("max-w-lg");
            }
            if (loginPanel) loginPanel.classList.add("hidden");
            if (signupCont) signupCont.classList.remove("hidden");
            if (tabSignup) tabSignup.className = "py-2 px-1.5 sm:px-3 rounded-xl text-[10.5px] sm:text-xs font-black bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 transition whitespace-nowrap";
            if (tabLogin) tabLogin.className = "py-2 px-1.5 sm:px-3 rounded-xl text-[10.5px] sm:text-xs font-bold text-gray-300 hover:text-white transition whitespace-nowrap";
            document.getElementById("signupStepMethod")?.classList.add("hidden");
            document.getElementById("signupStepWizard")?.classList.remove("hidden");
            this.renderSignupWizard();
        } else {
            if (cardCont) {
                cardCont.classList.remove("max-w-lg");
                cardCont.classList.add("max-w-md");
            }
            if (signupCont) signupCont.classList.add("hidden");
            if (loginPanel) loginPanel.classList.remove("hidden");
            if (tabLogin) tabLogin.className = "py-2 px-1.5 sm:px-3 rounded-xl text-[10.5px] sm:text-xs font-black bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 transition whitespace-nowrap";
            if (tabSignup) tabSignup.className = "py-2 px-1.5 sm:px-3 rounded-xl text-[10.5px] sm:text-xs font-bold text-gray-300 hover:text-white transition whitespace-nowrap";
        }
        this.refreshSignupHeaderLabels();
    },

    loginOtpState: {
        phone: "",
        timerId: null
    },

    async sendLoginOtp() {
        const phoneInput = document.getElementById("loginPhoneInput");
        const errBox = document.getElementById("loginOtpError");
        const sendBtn = document.getElementById("sendLoginOtpBtn");
        const code = document.getElementById("loginCountryCode")?.value || "+966";
        const rawPhone = (phoneInput?.value || "").trim();
        const digitsOnly = rawPhone.replace(/\D/g, "");

        if (errBox) errBox.classList.add("hidden");
        if (digitsOnly.length < 8) {
            if (errBox) {
                errBox.innerText = this.t("signup_err_phone");
                errBox.classList.remove("hidden");
            }
            return;
        }
        const phoneVal = this.buildFullPhone(code, rawPhone);

        if (sendBtn) sendBtn.disabled = true;
        try {
            const res = await IronAuth.sendPhoneOtp(phoneVal, "login");
            if (!res.ok) {
                if (res.error === "SMS_NOT_CONFIGURED") {
                    if (errBox) {
                        errBox.innerText = this.t("sms_not_configured");
                        errBox.classList.remove("hidden");
                    }
                    return;
                }
                if (res.error === "NOT_FOUND") {
                    if (errBox) {
                        errBox.innerHTML = `
                            <div>${this.t("login_err_not_found")}</div>
                            <button type="button" onclick="IronApp.switchToSignupWithPhone()" class="text-emerald-400 hover:text-emerald-300 font-black underline mt-1">
                                ${this.t("login_switch_to_signup")}
                            </button>
                        `;
                        errBox.classList.remove("hidden");
                    }
                    return;
                }
                if (errBox) {
                    errBox.innerText = res.error || this.t("signup_err_otp");
                    errBox.classList.remove("hidden");
                }
                return;
            }

            this.loginOtpState.phone = phoneVal;
            const verifyBox = document.getElementById("loginOtpVerifyBox");
            const codeInput = document.getElementById("loginOtpCode");
            if (verifyBox) verifyBox.classList.remove("hidden");
            if (codeInput) {
                codeInput.value = "";
                codeInput.focus();
            }
            showToast(this.t("signup_otp_sent", { phone: phoneVal }), "success");

            clearInterval(this.loginOtpState.timerId);
            const resendBtn = document.getElementById("resendLoginOtpBtn");
            let sec = 30;
            if (resendBtn) {
                resendBtn.disabled = true;
                resendBtn.innerText = `${this.t("signup_resend_otp")} (${sec}s)`;
                this.loginOtpState.timerId = setInterval(() => {
                    sec--;
                    if (sec <= 0) {
                        clearInterval(this.loginOtpState.timerId);
                        resendBtn.disabled = false;
                        resendBtn.innerText = this.t("signup_resend_otp");
                    } else {
                        resendBtn.innerText = `${this.t("signup_resend_otp")} (${sec}s)`;
                    }
                }, 1000);
            }
        } finally {
            if (sendBtn) sendBtn.disabled = false;
        }
    },

    async verifyLoginOtp() {
        const errBox = document.getElementById("loginOtpError");
        const verifyBtn = document.getElementById("verifyLoginOtpBtn");
        const code = (document.getElementById("loginOtpCode")?.value || "").trim();
        if (!code || code.length < 4) {
            if (errBox) {
                errBox.innerText = this.t("signup_err_otp");
                errBox.classList.remove("hidden");
            }
            return;
        }

        if (verifyBtn) verifyBtn.disabled = true;
        try {
            const res = await IronAuth.verifyPhoneOtp(this.loginOtpState.phone, code, "login");
            if (!res.ok) {
                if (errBox) {
                    errBox.innerText = this.t("signup_err_otp");
                    errBox.classList.remove("hidden");
                }
                return;
            }
            clearInterval(this.loginOtpState.timerId);
            window.location.reload();
        } finally {
            if (verifyBtn) verifyBtn.disabled = false;
        }
    },

    switchToSignupWithPhone() {
        const phoneVal = (document.getElementById("loginPhoneInput")?.value || "").trim();
        const codeVal = document.getElementById("loginCountryCode")?.value || "+966";
        this.signupWizard.phone = phoneVal;
        this.signupWizard.countryCode = codeVal;
        this.signupWizard.step = 1;
        this.switchAuthMode("signup");
    },

    refreshSignupHeaderLabels() {
        const titleEl = document.getElementById("authMainTitle");
        const subEl = document.getElementById("authMainSubtitle");
        const isSignup = this.signupState.mode === "signup";
        if (titleEl) titleEl.innerText = this.t(isSignup ? "signup_title" : "login_title");
        if (subEl) subEl.innerText = this.t(isSignup ? "signup_subtitle" : "login_subtitle");

        const p = this.signupState.provider;
        if (p) {
            const provName = p === "password"
                ? this.t("signup_password_badge")
                : this.t(p === "google" ? "provider_google" : p === "icloud" ? "provider_icloud" : "provider_phone");
            const icon = p === "google" ? "🔵" : p === "icloud" ? "☁️" : p === "password" ? "🔑" : "📱";
            const badge = document.getElementById("oauthProviderBadge");
            const stepBadge = document.getElementById("signupVerifiedBadge");
            if (badge) badge.innerText = `${icon} ${provName}`;
            if (stepBadge) stepBadge.innerText = `✅ ${provName}`;
        }
        if (isSignup && typeof this.renderSignupWizard === "function") {
            this.renderSignupWizard();
        }
    },

    async startOAuthSignup(provider) {
        this.signupState.provider = provider;
        this.signupState.isOAuthOnboarding = false;
        this.signupState.otpToken = null;
        this.showSignupError("");

        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const btnsWrap = document.getElementById("signupButtonsWrapper");
        const otpSec = document.getElementById("otpPhoneSection");
        const oauthCard = document.getElementById("oauthProviderCard");
        const passWrap = document.getElementById("regOauthPassWrap");
        const passInput = document.getElementById("regOauthPassword");
        const emailLbl = document.getElementById("regOauthEmailLbl");
        const emailInput = document.getElementById("regOauthEmail");

        if (btnsWrap) btnsWrap.classList.add("hidden");
        if (otpSec) otpSec.classList.add("hidden");
        if (oauthCard) oauthCard.classList.remove("hidden");
        if (passWrap) passWrap.classList.remove("hidden");
        if (passInput) passInput.required = true;

        if (provider === "google") {
            if (emailLbl) emailLbl.innerText = isEn ? "Google Email Address (Gmail) *" : "بريد حساب Google الإلكتروني (Gmail) *";
            if (emailInput) {
                emailInput.placeholder = "example@gmail.com";
                emailInput.required = true;
            }
        } else if (provider === "icloud") {
            if (emailLbl) emailLbl.innerText = isEn ? "iCloud / Apple ID Email Address *" : "بريد حساب iCloud / Apple ID الإلكتروني *";
            if (emailInput) {
                emailInput.placeholder = "example@icloud.com";
                emailInput.required = true;
            }
        }

        this.refreshSignupHeaderLabels();
        document.getElementById("regOauthName")?.focus();
    },

    startPasswordSignup() {
        this.signupState.provider = "password";
        this.signupState.isOAuthOnboarding = false;
        this.signupState.otpToken = null;
        this.showSignupError("");

        const btnsWrap = document.getElementById("signupButtonsWrapper");
        const otpSec = document.getElementById("otpPhoneSection");
        const oauthCard = document.getElementById("oauthProviderCard");
        const passWrap = document.getElementById("regOauthPassWrap");
        const passInput = document.getElementById("regOauthPassword");
        const emailLbl = document.getElementById("regOauthEmailLbl");
        const emailInput = document.getElementById("regOauthEmail");

        if (btnsWrap) btnsWrap.classList.add("hidden");
        if (otpSec) otpSec.classList.add("hidden");
        if (oauthCard) oauthCard.classList.remove("hidden");
        if (passWrap) passWrap.classList.remove("hidden");
        if (passInput) passInput.required = true;
        if (emailLbl) emailLbl.innerText = this.t("signup_oauth_email_opt");
        if (emailInput) {
            emailInput.placeholder = "name@gmail.com";
            emailInput.required = false;
        }
        this.refreshSignupHeaderLabels();
    },

    cancelOAuthSignup() {
        this.signupState.provider = null;
        this.signupState.isOAuthOnboarding = false;
        this.signupState.otpToken = null;
        this.showSignupError("");
        document.getElementById("oauthProviderCard")?.classList.add("hidden");
        document.getElementById("signupButtonsWrapper")?.classList.remove("hidden");
        document.getElementById("otpPhoneSection")?.classList.remove("hidden");
    },

    submitOAuthStep(e) {
        e.preventDefault();
        const name = (document.getElementById("regOauthName")?.value || "").trim();
        const email = (document.getElementById("regOauthEmail")?.value || "").trim().toLowerCase();
        const code = document.getElementById("regOauthCountryCode")?.value || "+966";
        localStorage.setItem("iron_dial_code", code);
        const phone = this.buildFullPhone(code, document.getElementById("regOauthPhone")?.value || "");
        const password = (document.getElementById("regOauthPassword")?.value || "").trim();
        const phoneDigits = phone.replace(/\D/g, "");

        if (!name) {
            this.showSignupError(this.t("signup_err_name"));
            return;
        }
        if (phoneDigits.length < 9) {
            this.showSignupError(this.t("signup_err_phone"));
            return;
        }
        if (password.length < 4) {
            this.showSignupError(this.t("signup_err_pass"));
            return;
        }
        if (email && !email.includes("@")) {
            this.showSignupError(this.t("signup_err_email"));
            return;
        }

        this.signupState.countryCode = code;
        this.signupState.verifiedName = name;
        this.signupState.verifiedEmail = email;
        this.signupState.verifiedPhone = phone;
        this.signupState.verifiedPassword = password;
        this.enterSignupProfileStep();
    },

    async sendSignupOtp() {
        const phoneInput = document.getElementById("regPhoneInput");
        const sendBtn = document.getElementById("sendOtpBtn");
        const code = document.getElementById("regOauthCountryCode")?.value || document.getElementById("loginCountryCode")?.value || "+966";
        const rawPhone = (phoneInput?.value || "").trim();
        const digits = rawPhone.replace(/\D/g, "");
        if (digits.length < 8) {
            this.showSignupError(this.t("signup_err_phone"));
            return;
        }
        const phoneVal = this.buildFullPhone(code, rawPhone);
        this.signupState.countryCode = code;

        this.showSignupError("");
        if (sendBtn) sendBtn.disabled = true;

        try {
            const res = await IronAuth.sendPhoneOtp(phoneVal, "signup");
            if (!res.ok) {
                if (res.error === "SMS_NOT_CONFIGURED") {
                    this.showSignupError(this.t("sms_not_configured"));
                } else {
                    this.showSignupError(res.error || this.t("signup_err_otp"));
                }
                return;
            }

            this.signupState.provider = "phone";
            this.signupState.verifiedPhone = phoneVal;

            const verifyBox = document.getElementById("otpVerifyBox");
            const otpInput = document.getElementById("regOtpCode");
            if (verifyBox) verifyBox.classList.remove("hidden");
            if (otpInput) {
                otpInput.value = "";
                otpInput.focus();
            }

            showToast(this.t("signup_otp_sent", { phone: phoneVal }), "success");

            clearInterval(this.signupState.otpTimerId);
            const resendBtn = document.getElementById("resendOtpBtn");
            let sec = 30;
            if (resendBtn) {
                resendBtn.disabled = true;
                resendBtn.innerText = `${this.t("signup_resend_otp")} (${sec}s)`;
                this.signupState.otpTimerId = setInterval(() => {
                    sec--;
                    if (sec <= 0) {
                        clearInterval(this.signupState.otpTimerId);
                        resendBtn.disabled = false;
                        resendBtn.innerText = this.t("signup_resend_otp");
                    } else {
                        resendBtn.innerText = `${this.t("signup_resend_otp")} (${sec}s)`;
                    }
                }, 1000);
            }
        } finally {
            if (sendBtn) sendBtn.disabled = false;
        }
    },

    async verifySignupOtp() {
        const code = (document.getElementById("regOtpCode")?.value || "").trim();
        if (!code || code.length < 4) {
            this.showSignupError(this.t("signup_err_otp"));
            return;
        }

        this.showSignupError("");
        const res = await IronAuth.verifyPhoneOtp(this.signupState.verifiedPhone, code, "signup");
        if (!res.ok) {
            this.showSignupError(this.t("signup_err_otp"));
            return;
        }

        clearInterval(this.signupState.otpTimerId);
        if (res.data?.session) {
            window.location.reload();
            return;
        }

        this.signupState.otpToken = res.data?.otpToken || null;
        this.signupState.verifiedEmail = "";
        this.signupState.verifiedName = "";
        this.enterSignupProfileStep();
    },

    enterSignupProfileStep() {
        this.showSignupError("");
        document.getElementById("signupStepMethod")?.classList.add("hidden");
        document.getElementById("signupStepWizard")?.classList.remove("hidden");
        if (this.signupState.verifiedName) this.signupWizard.name = this.signupState.verifiedName;
        if (this.signupState.verifiedPhone) this.signupWizard.phone = this.signupState.verifiedPhone;
        if (this.signupState.verifiedPassword) this.signupWizard.password = this.signupState.verifiedPassword;
        if (this.signupState.countryCode) this.signupWizard.countryCode = this.signupState.countryCode;
        if (!this.signupWizard.step || this.signupWizard.step < 1 || this.signupWizard.step > 14) {
            this.signupWizard.step = 1;
        }
        this.refreshSignupHeaderLabels();
        this.renderSignupWizard();
    },

    openSignupMethodShortcut() {
        this.showSignupError("");
        document.getElementById("signupStepWizard")?.classList.add("hidden");
        document.getElementById("signupStepMethod")?.classList.remove("hidden");
    },

    closeSignupMethodShortcut() {
        this.showSignupError("");
        document.getElementById("signupStepMethod")?.classList.add("hidden");
        document.getElementById("signupStepWizard")?.classList.remove("hidden");
        this.renderSignupWizard();
    },

    backToSignupMethod() {
        this.openSignupMethodShortcut();
    },

    syncWizardCredentialInputs() {
        const w = this.signupWizard;
        const nameEl = document.getElementById("wizardName");
        const phoneEl = document.getElementById("wizardPhone");
        const codeEl = document.getElementById("wizardCountryCode");
        const passEl = document.getElementById("wizardPassword");
        if (nameEl) w.name = nameEl.value;
        if (phoneEl) w.phone = phoneEl.value;
        if (codeEl) w.countryCode = codeEl.value;
        if (passEl) w.password = passEl.value;
    },

    setWizardField(field, value, rerender = true) {
        this.syncWizardCredentialInputs();
        this.signupWizard[field] = value;
        if (field === "gender" && value !== "female") {
            this.signupWizard.postCSection = false;
        }
        if (field === "trainingLocation" && value === "home") {
            // يحتفظ باختيار المنزل
        }
        if (field === "countryCode") {
            localStorage.setItem("iron_dial_code", value);
        }
        if (rerender) {
            this.renderSignupWizard();
        }
    },

    adjustWizardNum(field, delta, min, max) {
        this.syncWizardCredentialInputs();
        const cur = Number(this.signupWizard[field]) || min;
        const next = Math.max(min, Math.min(max, Math.round((cur + delta) * 2) / 2));
        this.signupWizard[field] = next;
        this.renderSignupWizard();
    },

    toggleWizardArrayItem(field, itemKey, exclusiveNoneKey = null) {
        this.syncWizardCredentialInputs();
        const arr = Array.isArray(this.signupWizard[field]) ? [...this.signupWizard[field]] : [];
        if (exclusiveNoneKey && itemKey === exclusiveNoneKey) {
            this.signupWizard[field] = [exclusiveNoneKey];
            this.renderSignupWizard();
            return;
        }
        const cleaned = exclusiveNoneKey ? arr.filter(x => x !== exclusiveNoneKey) : arr;
        const idx = cleaned.indexOf(itemKey);
        if (idx !== -1) {
            cleaned.splice(idx, 1);
        } else {
            cleaned.push(itemKey);
        }
        if (exclusiveNoneKey && cleaned.length === 0) {
            cleaned.push(exclusiveNoneKey);
        }
        this.signupWizard[field] = cleaned;
        this.renderSignupWizard();
    },

    getWizardActivityFactor() {
        const lvl = this.signupWizard.fitnessLevel;
        if (lvl === "مبتدئ") return 1.375;
        if (lvl === "متقدم") return 1.725;
        return 1.55;
    },

    computeWizardCalAndProgram() {
        const w = this.signupWizard;
        const activity = this.getWizardActivityFactor();
        const goalOffset = w.goal.includes("تضخيم") ? 350 : (w.goal.includes("تثبيت") || w.goal.includes("نحت")) ? 0 : -500;
        const calc = typeof IronCalculator !== "undefined"
            ? IronCalculator.calculate({ gender: w.gender, age: w.age, weight: w.weight, height: w.height, activity, goal: goalOffset })
            : { targetCalories: 2000 };

        let program = "PPL (Push Pull Legs)";
        if (w.gender === "female" && w.postCSection) {
            program = "Post-C-Section Recovery";
        } else if (w.trainingLocation === "home") {
            program = "Home Workouts (No Equipment)";
        } else if (w.goal.includes("تضخيم")) {
            program = "PPL (Bulking 3×10)";
        } else if (w.goal.includes("تثبيت") || w.goal.includes("نحت")) {
            program = "Upper / Lower Split";
        }

        return {
            calories: calc.targetCalories,
            activity,
            program
        };
    },

    prevWizardStep() {
        this.syncWizardCredentialInputs();
        this.showSignupError("");
        if (this.signupWizard.step <= 1) {
            this.switchAuthMode("login");
            return;
        }
        this.signupWizard.step--;
        this.renderSignupWizard();
    },

    nextWizardStep() {
        this.syncWizardCredentialInputs();
        this.showSignupError("");
        const w = this.signupWizard;

        if (w.step === 12) {
            const cleanName = (w.name || "").trim();
            const phoneDigits = String(w.phone || "").replace(/\D/g, "");
            const rawPass = (w.password || "").trim();
            if (!cleanName) {
                this.showSignupError(this.t("signup_err_name"));
                return;
            }
            if (phoneDigits.length < 8) {
                this.showSignupError(this.t("signup_err_phone"));
                return;
            }
            if (!this.signupState.otpToken && rawPass.length < 4) {
                this.showSignupError(this.t("signup_err_pass"));
                return;
            }
        }

        if (w.step < 14) {
            w.step++;
            this.renderSignupWizard();
        }
    },

    updateSignupCalPreview() {
        const previewEl = document.getElementById("wizardCalPreview");
        if (!previewEl) return;
        const plan = this.computeWizardCalAndProgram();
        previewEl.innerText = `${plan.calories} kcal`;
    },

    async completeWizardAccount({ openPayment = true } = {}) {
        this.syncWizardCredentialInputs();
        this.showSignupError("");
        const w = this.signupWizard;
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();

        const cleanName = (w.name || this.signupState.verifiedName || "").trim();
        if (!cleanName) {
            w.step = 12;
            this.renderSignupWizard();
            this.showSignupError(this.t("signup_err_name"));
            return;
        }

        const activeCode = w.countryCode || this.signupState.countryCode || "+966";
        const rawPhone = (w.phone || this.signupState.verifiedPhone || "").trim();
        const fullPhone = this.buildFullPhone(activeCode, rawPhone);
        const rawPass = (w.password || this.signupState.verifiedPassword || "").trim();
        if (fullPhone.replace(/\D/g, "").length < 9) {
            w.step = 12;
            this.renderSignupWizard();
            this.showSignupError(this.t("signup_err_phone"));
            return;
        }
        if (!this.signupState.otpToken && rawPass.length < 4) {
            w.step = 12;
            this.renderSignupWizard();
            this.showSignupError(this.t("signup_err_pass"));
            return;
        }

        const actionBtn = document.getElementById("wizardPayNowBtn") || document.getElementById("wizardLaterBtn");
        if (actionBtn) actionBtn.disabled = true;

        const computed = this.computeWizardCalAndProgram();
        const payload = {
            name: cleanName,
            email: this.signupState.verifiedEmail || "",
            phone: fullPhone,
            password: rawPass,
            otpToken: this.signupState.otpToken || "",
            authProvider: this.signupState.provider || "password",
            gender: w.gender === "female" ? "female" : "male",
            age: Number(w.age) || 26,
            weight: Number(w.weight) || 78,
            height: Number(w.height) || 175,
            activity: computed.activity,
            goal: w.goal || "تنشيف وخسارة دهون",
            program: computed.program,
            onboardingProfile: {
                targetWeight: Number(w.targetWeight) || Number(w.weight) || 72,
                fitnessLevel: w.fitnessLevel || "متوسط",
                trainingLocation: w.trainingLocation === "home" ? "home" : "gym",
                postCSection: w.gender === "female" ? Boolean(w.postCSection) : false,
                injuries: Array.isArray(w.injuries) ? w.injuries : ["لا يوجد إصابات"],
                preferredFoods: Array.isArray(w.preferredFoods) ? w.preferredFoods : [],
                dislikedFoods: Array.isArray(w.dislikedFoods) ? w.dislikedFoods : []
            }
        };

        try {
            const res = this.signupState.isOAuthOnboarding
                ? await IronAuth.completeOAuthClientProfile(payload)
                : await IronAuth.registerClient(payload);

            if (res && res.success) {
                this.selectedSubscriptionMonths = Number(w.selectedPackageMonths ?? 1);
                showToast(this.t("signup_created_toast"), "success");
                this.renderUserHeader(res.user);
                this.updateImpersonationBanner(res.user);
                this.renderAppViews(res.user);
                if (openPayment) {
                    this.openRenewPaymentModal();
                }
            } else {
                const msg = res?.error === "ACCOUNT_EXISTS"
                    ? this.t("signup_err_exists")
                    : (res?.message || res?.error || (isEn ? "Failed to create account" : "تعذر إنشاء الحساب"));
                w.step = 12;
                this.renderSignupWizard();
                this.showSignupError(msg);
            }
        } finally {
            if (actionBtn) actionBtn.disabled = false;
        }
    },

    renderSignupWizard() {
        const container = document.getElementById("signupStepWizard");
        if (!container) return;
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const w = this.signupWizard;
        const step = Math.max(1, Math.min(14, Number(w.step) || 1));

        let headerTitle = "";
        let counterText = "";
        let progressPct = 0;

        if (step <= 5) {
            headerTitle = isEn ? "Personal Information" : "المعلومات الشخصية";
            counterText = `${step}/5`;
            progressPct = Math.round((step / 5) * 100);
        } else if (step === 6) {
            headerTitle = isEn ? "Personal Info Saved" : "المعلومات الشخصية";
            counterText = "5/5 ✓";
            progressPct = 100;
        } else if (step <= 12) {
            const hStep = step - 6;
            headerTitle = isEn ? "Health & Training Profile" : "المعلومات الصحية";
            counterText = `${hStep}/6`;
            progressPct = Math.round((hStep / 6) * 100);
        } else if (step === 13) {
            headerTitle = isEn ? "Your Personalized Plan" : "خطتك الجاهزة";
            counterText = "✓";
            progressPct = 100;
        } else {
            headerTitle = isEn ? "Choose Package & Pay" : "الباقة والدفع";
            counterText = "💳";
            progressPct = 100;
        }

        const headerHtml = step === 6 ? "" : `
            <div class="space-y-2.5">
                <div class="flex items-center justify-between gap-2">
                    <button type="button" onclick="IronApp.prevWizardStep()"
                        class="w-9 h-9 rounded-full bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-white flex items-center justify-center text-sm font-black transition">
                        ${isEn ? "‹" : "›"}
                    </button>
                    <div class="text-xs font-black text-white">${headerTitle}</div>
                    <div class="text-xs font-black font-mono text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25">${counterText}</div>
                </div>
                <div class="h-1.5 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div class="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300" style="width:${progressPct}%"></div>
                </div>
            </div>
        `;

        let bodyHtml = "";

        if (step === 1) {
            bodyHtml = `
                <div class="space-y-4">
                    <h3 class="text-base sm:text-lg font-black text-white">${isEn ? "Please select your gender" : "يرجى تحديد الجنس"}</h3>
                    <div class="grid grid-cols-2 gap-3">
                        <button type="button" onclick="IronApp.setWizardField('gender', 'male')"
                            class="p-5 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-2.5 ${w.gender === 'male' ? 'wizard-pill-active' : 'bg-slate-950/75 border-slate-800 text-gray-300 hover:border-slate-700'}">
                            <span class="text-4xl">♂️</span>
                            <span class="text-sm font-black">${isEn ? "Male" : "ذكر"}</span>
                        </button>
                        <button type="button" onclick="IronApp.setWizardField('gender', 'female')"
                            class="p-5 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-2.5 ${w.gender === 'female' ? 'wizard-pill-active' : 'bg-slate-950/75 border-slate-800 text-gray-300 hover:border-slate-700'}">
                            <span class="text-4xl">♀️</span>
                            <span class="text-sm font-black">${isEn ? "Female" : "أنثى"}</span>
                        </button>
                    </div>
                    <button type="button" onclick="IronApp.nextWizardStep()"
                        class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/25 hover:opacity-95 transition">
                        ${isEn ? "Next" : "التالي"}
                    </button>
                    <button type="button" onclick="IronApp.openSignupMethodShortcut()"
                        class="w-full py-2 text-[11px] font-bold text-gray-400 hover:text-emerald-400 transition text-center">
                        ${isEn ? "⚡ Or quick link with Google / iCloud / Phone OTP" : "⚡ أو الربط السريع عبر Google / iCloud / رمز الجوال OTP"}
                    </button>
                </div>
            `;
        } else if (step === 2) {
            const ages = [];
            for (let a = Math.max(14, w.age - 3); a <= Math.min(80, w.age + 3); a++) ages.push(a);
            const approxYear = new Date().getFullYear() - w.age;
            bodyHtml = `
                <div class="space-y-4">
                    <div class="flex items-center justify-between gap-2">
                        <h3 class="text-base sm:text-lg font-black text-white">${isEn ? "What is your age?" : "ما هو عمرك؟"}</h3>
                        <span class="text-xs text-gray-400 font-bold">${isEn ? `Born ~${approxYear}` : `مواليد ~${approxYear}`}</span>
                    </div>
                    <div class="bg-slate-950/75 border border-slate-800 rounded-2xl p-4 space-y-3">
                        <div class="space-y-1 max-w-xs mx-auto">
                            ${ages.map(a => {
                                const isSel = a === Number(w.age);
                                const dist = Math.abs(a - Number(w.age));
                                return `
                                    <button type="button" onclick="IronApp.setWizardField('age', ${a})"
                                        class="w-full py-1.5 rounded-xl font-black font-mono transition ${isSel ? 'wizard-pill-active border text-xl py-2.5' : dist === 1 ? 'text-gray-300 text-base hover:bg-slate-900' : 'text-gray-500 text-xs hover:bg-slate-900'}">
                                        ${a} ${isSel ? (isEn ? "yrs" : "سنة") : ""}
                                    </button>
                                `;
                            }).join("")}
                        </div>
                        <div class="flex items-center justify-center gap-2 pt-2 border-t border-slate-800/80">
                            <button type="button" onclick="IronApp.adjustWizardNum('age', -1, 14, 80)" class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-sm">−</button>
                            <input type="number" min="14" max="80" value="${w.age}"
                                onchange="IronApp.setWizardField('age', Math.max(14, Math.min(80, parseInt(this.value)||26)))"
                                class="w-20 bg-slate-900 border border-emerald-500/40 rounded-xl py-1.5 text-center font-mono text-sm font-black text-emerald-400 outline-none">
                            <button type="button" onclick="IronApp.adjustWizardNum('age', 1, 14, 80)" class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-sm">+</button>
                        </div>
                    </div>
                    <button type="button" onclick="IronApp.nextWizardStep()"
                        class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/25 hover:opacity-95 transition">
                        ${isEn ? "Next" : "التالي"}
                    </button>
                </div>
            `;
        } else if (step === 3) {
            const heights = [];
            for (let h = Math.max(130, w.height - 3); h <= Math.min(220, w.height + 3); h++) heights.push(h);
            bodyHtml = `
                <div class="space-y-4">
                    <h3 class="text-base sm:text-lg font-black text-white">${isEn ? "What is your height?" : "ما هو طولك؟"}</h3>
                    <div class="bg-slate-950/75 border border-slate-800 rounded-2xl p-4 space-y-3">
                        <div class="space-y-1 max-w-xs mx-auto">
                            ${heights.map(h => {
                                const isSel = h === Number(w.height);
                                const dist = Math.abs(h - Number(w.height));
                                return `
                                    <button type="button" onclick="IronApp.setWizardField('height', ${h})"
                                        class="w-full py-1.5 rounded-full font-black font-mono transition ${isSel ? 'wizard-pill-active border text-xl py-2.5' : dist === 1 ? 'text-gray-300 text-base hover:bg-slate-900' : 'text-gray-500 text-xs hover:bg-slate-900'}">
                                        ${h} ${isSel ? (isEn ? "cm" : "سم") : ""}
                                    </button>
                                `;
                            }).join("")}
                        </div>
                        <div class="flex items-center justify-center gap-2 pt-2 border-t border-slate-800/80">
                            <button type="button" onclick="IronApp.adjustWizardNum('height', -1, 130, 220)" class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-sm">−</button>
                            <input type="number" min="130" max="220" value="${w.height}"
                                onchange="IronApp.setWizardField('height', Math.max(130, Math.min(220, parseInt(this.value)||175)))"
                                class="w-24 bg-slate-900 border border-emerald-500/40 rounded-xl py-1.5 text-center font-mono text-sm font-black text-emerald-400 outline-none">
                            <button type="button" onclick="IronApp.adjustWizardNum('height', 1, 130, 220)" class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-sm">+</button>
                        </div>
                    </div>
                    <button type="button" onclick="IronApp.nextWizardStep()"
                        class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/25 hover:opacity-95 transition">
                        ${isEn ? "Next" : "التالي"}
                    </button>
                </div>
            `;
        } else if (step === 4) {
            const renderWeightDial = (field, label) => {
                const val = Number(w[field]) || 75;
                const nums = [val - 2, val - 1, val, val + 1, val + 2].filter(n => n >= 35 && n <= 220);
                return `
                    <div class="bg-slate-950/75 border border-slate-800 rounded-2xl p-4 space-y-3">
                        <div class="text-sm font-black text-white">${label}</div>
                        <div class="flex items-center justify-center gap-2 sm:gap-3" dir="ltr">
                            <button type="button" onclick="IronApp.adjustWizardNum('${field}', -1, 35, 220)" class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-black text-sm">−</button>
                            ${nums.map(n => {
                                const isSel = n === val;
                                return `
                                    <button type="button" onclick="IronApp.setWizardField('${field}', ${n})"
                                        class="${isSel ? 'wizard-pill-active border w-14 h-14 rounded-full text-lg font-black' : 'text-gray-400 hover:text-white text-sm font-bold px-1.5'} font-mono transition flex flex-col items-center justify-center">
                                        <span>${n}</span>
                                    </button>
                                `;
                            }).join("")}
                            <button type="button" onclick="IronApp.adjustWizardNum('${field}', 1, 35, 220)" class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-black text-sm">+</button>
                        </div>
                        <div class="flex items-center justify-center gap-1.5">
                            <input type="number" step="0.5" min="35" max="220" value="${val}"
                                onchange="IronApp.setWizardField('${field}', Math.max(35, Math.min(220, parseFloat(this.value)||75)))"
                                class="w-20 bg-slate-900 border border-slate-700 rounded-lg py-1 text-center font-mono text-xs font-black text-emerald-400 outline-none">
                            <span class="text-xs text-gray-400 font-bold">${isEn ? "kg" : "كجم"}</span>
                        </div>
                    </div>
                `;
            };
            bodyHtml = `
                <div class="space-y-3.5">
                    ${renderWeightDial("weight", isEn ? "What is your current weight?" : "ما هو وزنك الحالي؟")}
                    ${renderWeightDial("targetWeight", isEn ? "What is your target weight?" : "ما هو الوزن المستهدف؟")}
                    <button type="button" onclick="IronApp.nextWizardStep()"
                        class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/25 hover:opacity-95 transition">
                        ${isEn ? "Next" : "التالي"}
                    </button>
                </div>
            `;
        } else if (step === 5) {
            const goals = [
                { val: "تنشيف وخسارة دهون", icon: "🔥", ar: "تنشيف (حرق الدهون)", en: "Cutting & Fat Loss" },
                { val: "تضخيم وبناء عضلات", icon: "💪", ar: "تضخيم (بناء العضلات)", en: "Bulking & Muscle Gain" },
                { val: "نحت الجسم وتثبيت الوزن", icon: "⚡", ar: "لياقة بدنية ونحت الجسم", en: "Fitness & Body Recomp" }
            ];
            bodyHtml = `
                <div class="space-y-4">
                    <h3 class="text-base sm:text-lg font-black text-white">${isEn ? "Please select your goal" : "برجاء تحديد هدفك"}</h3>
                    <div class="space-y-2.5">
                        ${goals.map(g => `
                            <button type="button" onclick="IronApp.setWizardField('goal', '${g.val}')"
                                class="w-full p-4 rounded-2xl border text-start font-black text-sm transition flex items-center justify-between ${w.goal === g.val ? 'wizard-pill-active' : 'bg-slate-950/75 border-slate-800 text-gray-200 hover:border-slate-700'}">
                                <span>${g.icon} ${isEn ? g.en : g.ar}</span>
                                <span class="text-xs">${w.goal === g.val ? "✓" : ""}</span>
                            </button>
                        `).join("")}
                    </div>
                    <button type="button" onclick="IronApp.nextWizardStep()"
                        class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/25 hover:opacity-95 transition">
                        ${isEn ? "Complete Personal Info" : "إنهاء المعلومات الشخصية"}
                    </button>
                </div>
            `;
        } else if (step === 6) {
            bodyHtml = `
                <div class="py-6 text-center space-y-5">
                    <div class="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/45 mx-auto flex items-center justify-center text-4xl text-emerald-400 shadow-lg shadow-emerald-500/20">
                        ✓
                    </div>
                    <div class="space-y-1.5">
                        <h3 class="text-lg font-black text-white">${isEn ? "Personal Data Saved Successfully" : "تم حفظ البيانات الشخصية بنجاح"}</h3>
                        <p class="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto">
                            ${isEn ? "Now complete your health profile, training location, and food preferences so we tailor everything for you." : "يرجى إكمال المعلومات الصحية وتحديد مكان التمرين والأطعمة المفضلة لتخصيص برنامجك."}
                        </p>
                    </div>
                    <button type="button" onclick="IronApp.nextWizardStep()"
                        class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/25 hover:opacity-95 transition">
                        ${isEn ? "Next" : "التالي"}
                    </button>
                </div>
            `;
        } else if (step === 7) {
            const levels = [
                { val: "مبتدئ", icon: "🌱", ar: "مبتدئ", subAr: "بداية جديدة أو عودة بعد انقطاع", en: "Beginner", subEn: "New or returning after a break" },
                { val: "متوسط", icon: "🔥", ar: "متوسط", subAr: "أتمرن بانتظام من عدة أشهر", en: "Intermediate", subEn: "Consistent training for months" },
                { val: "متقدم", icon: "⚡", ar: "متقدم", subAr: "خبرة عالية وأحمال تدريبية منتظمة", en: "Advanced", subEn: "Experienced lifter & high frequency" }
            ];
            bodyHtml = `
                <div class="space-y-4">
                    <h3 class="text-base sm:text-lg font-black text-white">${isEn ? "Please select your fitness level" : "من فضلك اختر مستواك"}</h3>
                    <div class="space-y-2.5">
                        ${levels.map(l => `
                            <button type="button" onclick="IronApp.setWizardField('fitnessLevel', '${l.val}')"
                                class="w-full p-4 rounded-2xl border text-start transition flex items-center justify-between gap-2 ${w.fitnessLevel === l.val ? 'wizard-pill-active' : 'bg-slate-950/75 border-slate-800 text-gray-200 hover:border-slate-700'}">
                                <div>
                                    <div class="font-black text-sm">${l.icon} ${isEn ? l.en : l.ar}</div>
                                    <div class="text-[11px] opacity-80 mt-0.5">${isEn ? l.subEn : l.subAr}</div>
                                </div>
                                <span class="text-xs font-black">${w.fitnessLevel === l.val ? "✓" : ""}</span>
                            </button>
                        `).join("")}
                    </div>
                    <button type="button" onclick="IronApp.nextWizardStep()"
                        class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/25 hover:opacity-95 transition">
                        ${isEn ? "Next" : "التالي"}
                    </button>
                </div>
            `;
        } else if (step === 8) {
            bodyHtml = `
                <div class="space-y-4">
                    <h3 class="text-base sm:text-lg font-black text-white">${isEn ? "Health conditions or injuries (if any)" : "برجاء تحديد الحالة الصحية أو الإصابات (إن وجدت)"}</h3>
                    <div class="flex flex-wrap gap-2">
                        ${this.WIZARD_INJURIES_LIST.map(inj => {
                            const active = Array.isArray(w.injuries) && w.injuries.includes(inj.key);
                            return `
                                <button type="button" onclick="IronApp.toggleWizardArrayItem('injuries', '${inj.key}', 'لا يوجد إصابات')"
                                    class="px-3.5 py-2 rounded-full border text-xs font-bold transition ${active ? 'wizard-pill-active' : 'bg-slate-950/75 border-slate-800 text-gray-300 hover:border-slate-700'}">
                                    ${active ? "✓ " : ""}${isEn ? inj.en : inj.ar}
                                </button>
                            `;
                        }).join("")}
                    </div>
                    <button type="button" onclick="IronApp.nextWizardStep()"
                        class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/25 hover:opacity-95 transition">
                        ${isEn ? "Next" : "التالي"}
                    </button>
                </div>
            `;
        } else if (step === 9) {
            bodyHtml = `
                <div class="space-y-4">
                    <h3 class="text-base sm:text-lg font-black text-white">${isEn ? "Where would you like to train?" : "هل ترغب أن يكون التمرين في البيت (المنزل) أم في النادي؟"}</h3>
                    <div class="space-y-2.5">
                        <button type="button" onclick="IronApp.setWizardField('trainingLocation', 'gym')"
                            class="w-full p-4 rounded-2xl border text-start transition flex items-center justify-between gap-2 ${w.trainingLocation === 'gym' ? 'wizard-pill-active' : 'bg-slate-950/75 border-slate-800 text-gray-200 hover:border-slate-700'}">
                            <div>
                                <div class="font-black text-sm">🏋️‍♂️ ${isEn ? "At the Gym (Machines & Weights)" : "في النادي الرياضي (الجيم بالأجهزة)"}</div>
                                <div class="text-[11px] opacity-80 mt-0.5">${isEn ? "Full gym split + cardio evaluation inside workouts" : "جدول النادي الكامل + الكارديو داخل التمرين"}</div>
                            </div>
                            <span class="text-xs font-black">${w.trainingLocation === 'gym' ? "✓" : ""}</span>
                        </button>
                        <button type="button" onclick="IronApp.setWizardField('trainingLocation', 'home')"
                            class="w-full p-4 rounded-2xl border text-start transition flex items-center justify-between gap-2 ${w.trainingLocation === 'home' ? 'wizard-pill-active' : 'bg-slate-950/75 border-slate-800 text-gray-200 hover:border-slate-700'}">
                            <div>
                                <div class="font-black text-sm">🏠 ${isEn ? "At Home (No Gym Equipment)" : "في البيت / المنزل (التمارين المنزلية)"}</div>
                                <div class="text-[11px] opacity-80 mt-0.5">${isEn ? "Unlocks the full Home Workouts section tailored without gym machines" : "يفعّل لك قسم التمارين المنزلية الكامل بالصور بدون أجهزة"}</div>
                            </div>
                            <span class="text-xs font-black">${w.trainingLocation === 'home' ? "✓" : ""}</span>
                        </button>
                    </div>

                    ${w.gender === "female" ? `
                        <div class="pt-3 border-t border-slate-800 space-y-2.5">
                            <div class="text-xs sm:text-sm font-black text-rose-300">🤱 ${isEn ? "Are you currently in Post-C-Section recovery?" : "هل أنتِ في مرحلة تأهيل ما بعد الولادة القيصرية؟"}</div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <button type="button" onclick="IronApp.setWizardField('postCSection', false)"
                                    class="p-3 rounded-xl border text-xs font-black text-start transition ${!w.postCSection ? 'wizard-pill-active' : 'bg-slate-950/75 border-slate-800 text-gray-300'}">
                                    ${!w.postCSection ? "✓ " : ""}${isEn ? "No, regular training" : "لا، تمرين عادي حسب هدفي"}
                                </button>
                                <button type="button" onclick="IronApp.setWizardField('postCSection', true)"
                                    class="p-3 rounded-xl border text-xs font-black text-start transition ${w.postCSection ? 'bg-rose-500/20 border-rose-400 text-white shadow-md shadow-rose-500/20' : 'bg-slate-950/75 border-slate-800 text-gray-300'}">
                                    ${w.postCSection ? "✓ " : ""}${isEn ? "Yes, enable Post-C-Section section" : "نعم، أحتاج قسم ما بعد الولادة القيصرية"}
                                </button>
                            </div>
                        </div>
                    ` : ""}

                    <div class="text-[11px] text-gray-400 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5">
                        💡 ${isEn ? "Your Home & Post-C-Section sections in the app appear based only on this choice." : "يعتمد ظهور قسم التمارين المنزلية وقسم ما بعد القيصرية في التطبيق على اختيارك هنا."}
                    </div>

                    <button type="button" onclick="IronApp.nextWizardStep()"
                        class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/25 hover:opacity-95 transition">
                        ${isEn ? "Next" : "التالي"}
                    </button>
                </div>
            `;
        } else if (step === 10) {
            bodyHtml = `
                <div class="space-y-4">
                    <h3 class="text-base sm:text-lg font-black text-white">${isEn ? "What foods do you prefer?" : "ما هي الأطعمة التي تفضلها؟"}</h3>
                    <div class="grid grid-cols-2 gap-2 max-h-[340px] overflow-y-auto wizard-wheel-scroll pr-0.5">
                        ${this.WIZARD_LIKED_FOODS.map(f => {
                            const active = Array.isArray(w.preferredFoods) && w.preferredFoods.includes(f.key);
                            return `
                                <button type="button" onclick="IronApp.toggleWizardArrayItem('preferredFoods', '${f.key}')"
                                    class="py-2.5 px-3 rounded-2xl border text-xs font-bold text-center transition ${active ? 'wizard-pill-active' : 'bg-slate-950/75 border-slate-800 text-gray-300 hover:border-slate-700'}">
                                    ${active ? "✓ " : ""}${isEn ? f.en : f.ar}
                                </button>
                            `;
                        }).join("")}
                    </div>
                    <button type="button" onclick="IronApp.nextWizardStep()"
                        class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/25 hover:opacity-95 transition">
                        ${isEn ? "Next" : "التالي"}
                    </button>
                </div>
            `;
        } else if (step === 11) {
            bodyHtml = `
                <div class="space-y-4">
                    <h3 class="text-base sm:text-lg font-black text-white">${isEn ? "What foods do you dislike?" : "ما هي الأطعمة التي لا تفضلها؟"}</h3>
                    <div class="grid grid-cols-2 gap-2 max-h-[340px] overflow-y-auto wizard-wheel-scroll pr-0.5">
                        ${this.WIZARD_DISLIKED_FOODS.map(f => {
                            const active = Array.isArray(w.dislikedFoods) && w.dislikedFoods.includes(f.key);
                            return `
                                <button type="button" onclick="IronApp.toggleWizardArrayItem('dislikedFoods', '${f.key}')"
                                    class="py-2.5 px-3 rounded-2xl border text-xs font-bold text-center transition ${active ? 'bg-rose-500/15 border-rose-400 text-white' : 'bg-slate-950/75 border-slate-800 text-gray-300 hover:border-slate-700'}">
                                    ${active ? "✕ " : ""}${isEn ? f.en : f.ar}
                                </button>
                            `;
                        }).join("")}
                    </div>
                    <button type="button" onclick="IronApp.nextWizardStep()"
                        class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/25 hover:opacity-95 transition">
                        ${isEn ? "Next" : "التالي"}
                    </button>
                </div>
            `;
        } else if (step === 12) {
            const plan = this.computeWizardCalAndProgram();
            const dialOpts = [
                { v: "+966", t: "🇸🇦 +966" },
                { v: "+20", t: "🇪🇬 +20" },
                { v: "+971", t: "🇦🇪 +971" },
                { v: "+965", t: "🇰🇼 +965" },
                { v: "+974", t: "🇶🇦 +974" },
                { v: "+973", t: "🇧🇭 +973" },
                { v: "+968", t: "🇴🇲 +968" },
                { v: "+962", t: "🇯🇴 +962" },
                { v: "custom", t: "🌍 +" }
            ];
            const progDisp = typeof IronI18n !== "undefined" && IronI18n.trProgram ? IronI18n.trProgram(plan.program) : plan.program;
            bodyHtml = `
                <div class="space-y-3.5">
                    <h3 class="text-base sm:text-lg font-black text-white">${isEn ? "Create Your Account & Review Plan" : "إنشاء بيانات حسابك وحفظ خطتك"}</h3>
                    <div>
                        <label class="block text-[11px] font-bold text-gray-300 mb-1">${isEn ? "Full Name *" : "الاسم بالكامل *"}</label>
                        <input type="text" id="wizardName" value="${String(w.name || "").replace(/"/g, "&quot;")}"
                            oninput="IronApp.signupWizard.name = this.value"
                            placeholder="${isEn ? "e.g., Mohamed El-Sayed" : "مثال: محمد السيد"}"
                            class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-bold outline-none focus:border-emerald-500">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold text-gray-300 mb-1">${isEn ? "Mobile Number (with country code) *" : "رقم الجوال (بكود الدولة) *"}</label>
                        <div class="flex gap-1.5" dir="ltr">
                            <select id="wizardCountryCode" onchange="IronApp.setWizardField('countryCode', this.value, false)"
                                class="w-[105px] bg-slate-950 border border-slate-700 rounded-xl px-2 py-2.5 text-xs text-emerald-400 font-black outline-none">
                                ${dialOpts.map(o => `<option value="${o.v}" ${w.countryCode === o.v ? "selected" : ""}>${o.t}</option>`).join("")}
                            </select>
                            <input type="tel" id="wizardPhone" value="${String(w.phone || "").replace(/"/g, "&quot;")}"
                                ${this.signupState.provider === "phone" ? "readonly" : ""}
                                oninput="IronApp.signupWizard.phone = this.value"
                                dir="ltr" placeholder="05xxxxxxxx / 01xxxxxxxx"
                                class="flex-1 min-w-0 bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-bold outline-none focus:border-emerald-500">
                        </div>
                    </div>
                    ${!this.signupState.otpToken ? `
                        <div>
                            <label class="block text-[11px] font-bold text-gray-300 mb-1">${isEn ? "Password (min 4 chars) *" : "الرقم السري لحسابك *"}</label>
                            <input type="password" id="wizardPassword" value="${String(w.password || "").replace(/"/g, "&quot;")}"
                                oninput="IronApp.signupWizard.password = this.value"
                                placeholder="••••••••"
                                class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-bold outline-none focus:border-emerald-500">
                        </div>
                    ` : ""}

                    <div class="bg-slate-950/85 border border-emerald-500/30 rounded-2xl p-3 space-y-1.5 text-xs">
                        <div class="flex items-center justify-between">
                            <span class="text-gray-400 font-bold">${isEn ? "Calculated Daily Target:" : "السعرات المحسوبة لهدفك:"}</span>
                            <strong id="wizardCalPreview" class="text-emerald-400 font-black font-mono text-sm">${plan.calories} kcal</strong>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-gray-400 font-bold">${isEn ? "Tailored Program:" : "البرنامج المخصص لك:"}</span>
                            <strong class="text-cyan-300 font-black text-[11px]">${progDisp}</strong>
                        </div>
                    </div>

                    <button type="button" onclick="IronApp.nextWizardStep()"
                        class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/25 hover:opacity-95 transition">
                        ${isEn ? "Review Plan & Continue →" : "مراجعة خطتك والمتابعة للاشتراك ←"}
                    </button>
                </div>
            `;
        } else if (step === 13) {
            const perks = isEn ? [
                "Custom workout program tailored to your goal",
                "Daily meal plan matching your preferences & calories",
                "Direct 1-on-1 follow-up with the Coach",
                "Weight, measurements & cardio progress tracking",
                "Continuous analytics for your progress"
            ] : [
                "برنامج تدريبي مخصص لهدفك",
                "جدول غذائي يناسب احتياجك وأكلاتك المفضلة",
                "متابعة شخصية مع الكوتش",
                "متابعة القياسات والوزن",
                "تحليل مستمر لتقدمك"
            ];
            bodyHtml = `
                <div class="text-center space-y-4 py-1">
                    <div class="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 mx-auto flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/25">
                        👑
                    </div>
                    <div class="space-y-1">
                        <span class="inline-block px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-black">
                            👑 ${isEn ? "Premium Access" : "ميزة مميزة"}
                        </span>
                        <h3 class="text-xl font-black text-white">${isEn ? "Ready to Start?" : "جاهز تبدأ؟"}</h3>
                        <p class="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto">
                            ${isEn ? "Subscribe now to unlock your tailored workout and nutrition plans with direct coaching." : "اشترك الآن واستلم خطتك التدريبية والغذائية المصممة خصيصاً لك، واستمتع بمتابعة شخصية وتحليل مستمر لتقدمك حتى تحقق هدفك."}
                        </p>
                    </div>
                    <div class="bg-slate-950/75 border border-slate-800 rounded-2xl p-3.5 space-y-2 text-start text-xs">
                        ${perks.map(p => `
                            <div class="flex items-center gap-2.5 font-bold text-gray-200">
                                <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px] flex-shrink-0">✓</span>
                                <span>${p}</span>
                            </div>
                        `).join("")}
                    </div>
                    <button type="button" onclick="IronApp.nextWizardStep()"
                        class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/25 hover:opacity-95 transition">
                        👑 ${isEn ? "Subscribe Now" : "اشترك الآن"}
                    </button>
                    <button type="button" id="wizardLaterBtn" onclick="IronApp.completeWizardAccount({ openPayment: false })"
                        class="w-full py-2 text-xs font-bold text-gray-400 hover:text-white transition">
                        ${isEn ? "Maybe later (Save account & pay later)" : "ربما لاحقاً"}
                    </button>
                </div>
            `;
        } else {
            const tiers = [
                { m: 0, titleAr: "تجربة يوم واحد ⚡", subAr: "يوم تجريبي كامل للتطبيق", titleEn: "1-Day Trial ⚡", subEn: "Full 1-day trial access", badge: "" },
                { m: 1, titleAr: "باقة شهر واحد", subAr: "خطة متكاملة + متابعة أسبوعية لمدة 30 يوم", titleEn: "1-Month Plan", subEn: "30 days full workouts & diet coaching", badge: "" },
                { m: 2, titleAr: "باقة شهرين", subAr: "60 يوماً • وفر 39 ر.س", titleEn: "2-Month Plan", subEn: "60 days • Save 39 SAR", badge: isEn ? "Save" : "وفر 39" },
                { m: 3, titleAr: "باقة 3 شهور 🔥", subAr: "الخيار الأفضل للنتائج الواضحة لمدة 90 يوم • وفر 118", titleEn: "3-Month Plan 🔥", subEn: "90 days best value • Save 118 SAR", badge: isEn ? "Best Value" : "وفر 118" }
            ];
            bodyHtml = `
                <div class="space-y-4">
                    <h3 class="text-base sm:text-lg font-black text-white">${isEn ? "Choose Your Best Plan" : "اختر الباقة المناسبة معك"}</h3>
                    <div class="space-y-2.5">
                        ${tiers.map(tr => {
                            const info = this.getSubscriptionTierInfo(tr.m);
                            const sel = Number(w.selectedPackageMonths) === tr.m;
                            return `
                                <button type="button" onclick="IronApp.setWizardField('selectedPackageMonths', ${tr.m})"
                                    class="w-full p-3.5 rounded-2xl border text-start transition flex items-center justify-between gap-3 ${sel ? 'wizard-pill-active' : 'bg-slate-950/75 border-slate-800 text-gray-200 hover:border-slate-700'}">
                                    <div class="min-w-0 flex-1">
                                        <div class="flex items-center gap-2 flex-wrap">
                                            <span class="font-black text-sm">${isEn ? tr.titleEn : tr.titleAr}</span>
                                            ${tr.badge ? `<span class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black">${tr.badge}</span>` : ""}
                                        </div>
                                        <div class="text-[11px] opacity-80 mt-0.5">${isEn ? tr.subEn : tr.subAr}</div>
                                    </div>
                                    <div class="text-end flex-shrink-0">
                                        <div class="text-base font-black text-emerald-400">${info.price} <span class="text-[11px]">${info.currencyTxt}</span></div>
                                    </div>
                                </button>
                            `;
                        }).join("")}
                    </div>
                    <button type="button" id="wizardPayNowBtn" onclick="IronApp.completeWizardAccount({ openPayment: true })"
                        class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/25 hover:opacity-95 transition">
                        💳 ${isEn ? "Pay Now" : "ادفع الآن"}
                    </button>
                </div>
            `;
        }

        container.innerHTML = `${headerHtml}${bodyHtml}`;
    },

    async handleCompleteClientSignup(e) {
        if (e) e.preventDefault();
        await this.completeWizardAccount({ openPayment: true });
    },

    initEventListeners() {
        // إغلاق النوافذ عند النقر خارجها
        document.querySelectorAll(".modal-overlay").forEach(overlay => {
            overlay.addEventListener("click", (e) => {
                if (e.target === overlay) {
                    closeModal(overlay.id);
                }
            });
        });

        // إغلاق النوافذ بزر Escape لتحسين تجربة الاستخدام
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                const activeOverlays = document.querySelectorAll(".modal-overlay.active");
                if (activeOverlays.length > 0) {
                    const lastOverlay = activeOverlays[activeOverlays.length - 1];
                    closeModal(lastOverlay.id);
                }
            }
        });
    }
};

// تشغيل التطبيق فور اكتمال تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
    IronApp.init();
});

// توسيع التعرف التلقائي على البرامج لتشمل البرامج المنزلية وما بعد الولادة القيصرية
if (typeof IronApp !== "undefined" && typeof IronApp.resolveProgramIdFromName === "function") {
    const _baseResolveProgramId = IronApp.resolveProgramIdFromName.bind(IronApp);
    IronApp.resolveProgramIdFromName = function(programName = "") {
        const low = String(programName || "").toLowerCase();
        if (low.includes("home") || low.includes("منزل")) return "prog_home";
        if (low.includes("csection") || low.includes("c-section") || low.includes("قيصر") || low.includes("ولادة")) return "prog_csection";
        return _baseResolveProgramId(programName);
    };
}
