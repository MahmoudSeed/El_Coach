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

    init() {
        // 1. تهيئة النمط (الداكن / الفاتح)
        this.initTheme();

        // 2. تهيئة المشتركين الافتراضيين
        IronAuth.getAllTrainees();

        // 3. فحص الجلسة الحالية
        const user = IronAuth.getCurrentUser();

        this.renderUserHeader(user);
        this.updateImpersonationBanner(user);
        this.renderAppViews(user);
        this.initEventListeners();

        // تحديث حالة الاشتراك عند العودة للتطبيق بعد غياب
        document.addEventListener("visibilitychange", () => {
            if (!document.hidden) {
                const currentUser = IronAuth.getCurrentUser();
                if (currentUser && currentUser.role === "trainee") {
                    this.renderUserHeader(currentUser);
                    this.renderTraineeData(currentUser.traineeData);
                }
            }
        });
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
            labelEl.innerText = cleanTheme === "light" ? "الداكن" : "الفاتح";
        }

        if (notify) {
            showToast(cleanTheme === "light" ? "تم التبديل إلى النمط الفاتح ☀️" : "تم التبديل إلى النمط الداكن الفاخر 🌙", "success");
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
        if (p.includes("upper") || p.includes("علوي")) return "prog_upper_lower";
        if (p.includes("arnold") || p.includes("آرنولد")) return "prog_arnold";
        if (p.includes("bro") || p.includes("برو")) return "prog_bro";
        if (p.includes("anterior") || p.includes("أمامية")) return "prog_anterior_posterior";
        if (p.includes("full") || p.includes("كامل")) return "prog_full_body";
        return "prog_ppl";
    },

    // إظهار شريط المعاينة للكوتش فقط أثناء معاينة حساب أحد المتدربين (يُخفى تماماً عن العملاء)
    updateImpersonationBanner(user) {
        const banner = document.getElementById("impersonatingBanner");
        const nameEl = document.getElementById("impersonatingTraineeName");
        if (!banner) return;
        if (user && user.role === "trainee" && user.isImpersonating) {
            if (nameEl) nameEl.innerText = `${user.name} (@${user.username})`;
            banner.classList.remove("hidden");
        } else {
            banner.classList.add("hidden");
        }
    },

    // رسم شريط المستخدم العلوي (متجاوب يظهر حالة الاشتراك على الهواتف والحواسيب)
    renderUserHeader(user) {
        const area = document.getElementById("userHeaderArea");
        if (!area) return;

        if (!user) {
            area.innerHTML = `
                <button onclick="IronApp.showAuthScreen()" class="px-4 py-2 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition">
                    تسجيل الدخول 🔑
                </button>
            `;
            return;
        }

        if (user.role === "coach") {
            area.innerHTML = `
                <div class="flex items-center gap-2 sm:gap-3">
                    <div class="text-left">
                        <div class="text-xs font-black text-white flex items-center gap-1 justify-end">
                            <span class="truncate max-w-[110px] sm:max-w-none">${user.name}</span>
                            <span class="text-amber-400">👑</span>
                        </div>
                        <div class="text-[10px] text-emerald-400 font-bold hidden sm:block">لوحة الكوتش الإدارية</div>
                    </div>
                    <button onclick="IronAuth.logout()" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold text-xs rounded-xl border border-slate-700 transition" title="تسجيل الخروج">
                        خروج 🚪
                    </button>
                </div>
            `;
        } else {
            const statusColor = user.status === "active" ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                : user.status === "expiring" ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
                : "text-rose-400 border-rose-500/30 bg-rose-500/10";

            const statusText = user.status === "active" ? `باقي ${user.daysLeft} يوم 🔥`
                : user.status === "expiring" ? `باقي ${user.daysLeft} يوم ⚠️`
                : `منتهي 🚫`;

            area.innerHTML = `
                <div class="flex items-center gap-1.5 sm:gap-3">
                    ${user.isImpersonating ? `
                        <button onclick="IronAuth.returnToCoachDashboard()" class="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 font-black text-[11px] rounded-xl transition flex items-center gap-1" title="العودة للوحة الكوتش">
                            <span>👑 الكوتش</span>
                        </button>
                    ` : ''}
                    <div class="text-left">
                        <div class="text-[11px] sm:text-xs font-black text-white truncate max-w-[95px] sm:max-w-none">${user.name}</div>
                        <div class="text-[9px] sm:text-[10px] ${statusColor} px-2 py-0.5 rounded-full border inline-block font-bold">
                            ${statusText}
                        </div>
                    </div>
                    ${user.status === "expired" ? `
                        <button onclick="IronApp.openRenewPaymentModal()" class="px-2.5 py-1.5 bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition animate-pulse">
                            تجديد 💳
                        </button>
                    ` : ''}
                    <button onclick="IronAuth.logout()" class="px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold text-xs rounded-xl border border-slate-700 transition" title="تسجيل الخروج">
                        <span class="hidden sm:inline">خروج</span> 🚪
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

        // 2. إذا كان متدرب منتهي الاشتراك
        if (user.status === "expired") {
            expiredView.classList.remove("hidden");
            const config = getAppConfig();
            document.getElementById("expiredPriceDisplay").innerText = `${config.subscriptionPrice.monthly} ${config.subscriptionPrice.currency}`;
            document.getElementById("expiredVodafoneDisplay").innerText = config.coachInfo.vodafoneCash;
            document.getElementById("expiredInstapayDisplay").innerText = config.coachInfo.instapayUser;
            document.getElementById("expiredStcDisplay").innerText = config.coachInfo.stcPay;
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

        // الرئيسية
        document.getElementById("homeWelcomeName").innerText = `أهلاً بك يا ${trainee.name} 👋`;
        document.getElementById("homeDaysLeftBadge").innerText = `باقي ${trainee.daysLeft} يوماً في اشتراكك 🔥`;
        document.getElementById("homeTargetCal").innerText = `${targetCal} kcal`;
        document.getElementById("homeTargetProtein").innerText = `${proteinGrams}g`;
        document.getElementById("homeTargetCarbs").innerText = `${carbGrams}g`;
        document.getElementById("homeTargetWater").innerText = `${waterTargetLiters} لتر`;

        // بطاقة ملخص خطة العميل وتوجيهات الكوتش الخاصة به فقط
        this.renderHomePlanSummary(trainee);

        // إعداد الحاسبة بقيم المتدرب الخاصة
        if (document.getElementById("calcWeight")) document.getElementById("calcWeight").value = weight;
        if (document.getElementById("calcHeight")) document.getElementById("calcHeight").value = trainee.height || 175;
        if (document.getElementById("calcAge")) document.getElementById("calcAge").value = trainee.age || 26;
        if (document.getElementById("calcGender")) document.getElementById("calcGender").value = trainee.gender || "male";
        if (document.getElementById("calcActivity")) document.getElementById("calcActivity").value = trainee.activity || 1.55;
        if (document.getElementById("calcGoal")) {
            const gStr = String(trainee.goal || "");
            document.getElementById("calcGoal").value = gStr.includes("تضخيم") ? "450" : (gStr.includes("تثبيت") || gStr.includes("نحت")) ? "0" : "-500";
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

        this.renderWaterTracker(trainee, parseFloat(waterTargetLiters));
        this.runCalculator();
        this.generateDayDiet(false);
        this.renderMealsGrid();
        this.selectProgram(this.selectedProgramId);
        this.renderWorkoutLogs();
        this.renderExercisesGrid();
        this.renderCheckinHistory(trainee);
    },

    renderHomePlanSummary(trainee) {
        const card = document.getElementById("homePlanSummaryCard");
        if (!card || !trainee) return;
        const assignedProg = trainee.program || "PPL (Push Pull Legs)";
        const checkinsCount = Array.isArray(trainee.history) ? trainee.history.length : 0;

        card.innerHTML = `
            <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                        <span>📋 ملخص خطتك الخاصة وجدولك المعتمد</span>
                    </span>
                    <span class="text-[11px] text-gray-400 font-mono">تاريخ الاشتراك: ${trainee.joinedDate || '-'}</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div class="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                        <div class="text-[10px] text-gray-400 font-bold">هدفك التدريبي</div>
                        <div class="font-black text-white mt-0.5">${trainee.goal || 'تنشيف وخسارة دهون'}</div>
                    </div>
                    <div class="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                        <div class="text-[10px] text-gray-400 font-bold">جدول التمرين المخصص لك</div>
                        <div class="font-black text-emerald-400 mt-0.5">${assignedProg}</div>
                    </div>
                    <div class="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                        <div class="text-[10px] text-gray-400 font-bold">الوزن الحالي / المتابعات المسجلة</div>
                        <div class="font-black text-cyan-400 mt-0.5">${trainee.weight} كجم • ${checkinsCount} قراءات</div>
                    </div>
                </div>
                ${trainee.coachNote ? `
                    <div class="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3 text-xs">
                        <div class="text-[10px] font-black text-emerald-400 mb-1">💬 توجيهات الكوتش الخاصة لك:</div>
                        <p class="text-gray-200 leading-relaxed">${trainee.coachNote}</p>
                    </div>
                ` : ''}
            </div>
        `;
    },

    // =========================================================================
    // متتبع شرب الماء اليومي التفاعلي (Interactive Daily Water Tracker)
    // =========================================================================
    getTodayWaterKey(traineeId) {
        const today = new Date().toISOString().split("T")[0];
        return `${traineeId || "guest"}_${today}`;
    },

    renderWaterTracker(trainee, targetLiters = 3.0) {
        const box = document.getElementById("waterTrackerInteractiveBox");
        if (!box || !trainee) return;

        const logs = JSON.parse(localStorage.getItem("iron_water_logs") || "{}");
        const key = this.getTodayWaterKey(trainee.id);
        const cups = parseInt(logs[key]) || 0;
        const consumedLiters = (cups * 0.25).toFixed(2);
        const targetCups = Math.max(6, Math.round(targetLiters / 0.25));
        const pct = Math.min(100, Math.round((cups / targetCups) * 100));

        box.innerHTML = `
            <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="flex-1">
                    <div class="flex items-center justify-between mb-1.5">
                        <span class="text-xs font-black text-white flex items-center gap-1.5">
                            <span>💧 متابعة شرب الماء اليومي</span>
                            <span class="text-[11px] text-cyan-400 font-mono">(${consumedLiters} / ${targetLiters} لتر)</span>
                        </span>
                        <span class="text-xs font-black text-cyan-400">${cups} من ${targetCups} أكواب (${pct}%)</span>
                    </div>
                    <div class="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div class="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300" style="width: ${pct}%"></div>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="IronApp.addWaterCup(1)" class="water-cup-btn px-3.5 py-2 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-black flex items-center gap-1">
                        <span>+ كوب ماء (250 مل) 🥤</span>
                    </button>
                    ${cups > 0 ? `
                        <button onclick="IronApp.addWaterCup(-1)" class="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-xl text-xs font-bold" title="إنقاص كوب">
                            -
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    },

    addWaterCup(delta = 1) {
        const user = IronAuth.getCurrentUser();
        if (!user || !user.traineeData) return;
        const trainee = user.traineeData;
        const logs = JSON.parse(localStorage.getItem("iron_water_logs") || "{}");
        const key = this.getTodayWaterKey(trainee.id);
        const nextCups = Math.max(0, (parseInt(logs[key]) || 0) + delta);
        logs[key] = nextCups;
        localStorage.setItem("iron_water_logs", JSON.stringify(logs));

        const targetLiters = parseFloat(((parseFloat(trainee.weight) || 75) * 0.035).toFixed(1));
        this.renderWaterTracker(trainee, targetLiters);
        if (delta > 0) {
            showToast(`عاش! شربت ${(nextCups * 0.25).toFixed(2)} لتر ماء اليوم 💧`, "success");
        }
    },

    // =========================================================================
    // سجل التمارين المكتملة (Workout History Renderer)
    // =========================================================================
    renderWorkoutLogs() {
        const overviewContainer = document.getElementById("overviewWorkoutLogsContainer");
        const workoutsTabContainer = document.getElementById("workoutsTabLogsContainer");
        const user = IronAuth.getCurrentUser();
        const traineeId = user && user.id ? user.id : null;

        const allLogs = JSON.parse(localStorage.getItem("iron_workout_logs") || "[]");
        const myLogs = traineeId
            ? allLogs.filter(l => l.traineeId === traineeId)
            : [];

        const renderHtml = (limit = 5) => {
            if (myLogs.length === 0) {
                return `
                    <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center text-xs text-gray-400">
                        لم تسجل جلسات تمرين مكتملة بعد. افتح تبويب <strong>البرامج التدريبية</strong> واضغط "ابدأ التمرين الآن (وضع الجيم)" لتسجيل أول تمرين! 🏋️‍♂️
                    </div>
                `;
            }

            return `
                <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="text-sm font-black text-white flex items-center gap-2">
                            <span>🏆 سجل تمارينك المكتملة في الجيم (${myLogs.length} جلسة)</span>
                        </h4>
                        <span class="text-[11px] text-emerald-400 font-bold">آخر ${Math.min(limit, myLogs.length)} تمارين</span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        ${myLogs.slice(0, limit).map(log => {
                            const dateFormatted = new Date(log.date).toLocaleDateString("ar-EG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
                            return `
                                <div class="flex items-center justify-between bg-slate-950/70 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs">
                                    <div>
                                        <div class="font-black text-white">${log.dayTitle}</div>
                                        <div class="text-[10px] text-gray-400">${log.programName} • ${dateFormatted}</div>
                                    </div>
                                    <div class="text-left">
                                        <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px]">
                                            ${log.completedSets} جولة ✓
                                        </span>
                                        ${log.totalVolumeKg > 0 ? `<div class="text-[10px] text-amber-400 font-mono mt-0.5">حجم: ${log.totalVolumeKg} كجم</div>` : ''}
                                    </div>
                                </div>
                            `;
                        }).join("")}
                    </div>
                </div>
            `;
        };

        if (overviewContainer) overviewContainer.innerHTML = renderHtml(4);
        if (workoutsTabContainer) workoutsTabContainer.innerHTML = renderHtml(8);
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
                    <span>📈 منحنى تطور الوزن عبر الأسابيع</span>
                    <span class="font-mono text-emerald-400">من ${points[0].weight} كجم إلى ${points[points.length - 1].weight} كجم</span>
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

        const history = trainee.history || [];
        if (history.length === 0) {
            container.innerHTML = `<div class="text-xs text-gray-400 text-center py-4">لا توجد قراءات مسجلة بعد. أرسل أول متابعة أسبوعية لك!</div>`;
            return;
        }

        const chartHtml = this.renderWeightChartSvg(history);

        const rows = [...history].reverse().map((item, idx, arr) => {
            const prev = arr[idx + 1];
            let badge = `<span class="text-gray-400">قياس مبدئي</span>`;
            if (prev && typeof prev.weight === "number") {
                const diff = parseFloat((item.weight - prev.weight).toFixed(1));
                badge = diff < 0
                    ? `<span class="text-emerald-400 font-bold">${diff} كجم 📉</span>`
                    : diff > 0
                    ? `<span class="text-amber-400 font-bold">+${diff} كجم 📈</span>`
                    : `<span class="text-cyan-400 font-bold">ثبات 🎯</span>`;
            }
            return `
                <div class="bg-slate-950/70 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs space-y-1">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <span class="font-mono text-gray-400">${item.date}</span>
                            <strong class="text-white font-black">${item.weight} كجم</strong>
                            ${item.waist ? `<span class="text-gray-400">• الخصر: ${item.waist} سم</span>` : ''}
                        </div>
                        <div>${badge}</div>
                    </div>
                    ${(item.adherence || item.energy || item.notes) ? `
                        <div class="flex flex-wrap items-center gap-2 text-[10px] text-gray-400 pt-1 border-t border-slate-800/60">
                            ${item.adherence ? `<span>🥗 الالتزام: <strong class="text-emerald-400">${item.adherence}/10</strong></span>` : ''}
                            ${item.energy ? `<span>⚡ الطاقة: <strong class="text-cyan-400">${item.energy}/10</strong></span>` : ''}
                            ${item.notes ? `<span class="text-gray-300 truncate max-w-xs">📝 ${item.notes}</span>` : ''}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join("");

        container.innerHTML = `
            <div class="mt-6 pt-5 border-t border-slate-800">
                <h4 class="text-xs font-black text-emerald-400 mb-3 flex items-center gap-1.5">
                    <span>📊 سجل تطور الوزن والقياسات (${history.length} قراءات)</span>
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

        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // تشغيل الحاسبة وحساب النتائج فورياً
    runCalculator() {
        const gender = document.getElementById("calcGender")?.value || "male";
        const age = document.getElementById("calcAge")?.value || 25;
        const weight = document.getElementById("calcWeight")?.value || 75;
        const height = document.getElementById("calcHeight")?.value || 175;
        const activity = document.getElementById("calcActivity")?.value || 1.55;
        const goal = document.getElementById("calcGoal")?.value || -500;

        const results = IronCalculator.calculate({ gender, age, weight, height, activity, goal });

        if (document.getElementById("resBmr")) document.getElementById("resBmr").innerText = `${results.bmr} kcal`;
        if (document.getElementById("resTdee")) document.getElementById("resTdee").innerText = `${results.tdee} kcal`;
        if (document.getElementById("resTarget")) document.getElementById("resTarget").innerText = `${results.targetCalories} kcal`;
        if (document.getElementById("resProtein")) document.getElementById("resProtein").innerText = `${results.proteinGrams}g (${results.proteinCalories} kcal)`;
        if (document.getElementById("resCarbs")) document.getElementById("resCarbs").innerText = `${results.carbGrams}g (${results.carbCalories} kcal)`;
        if (document.getElementById("resFats")) document.getElementById("resFats").innerText = `${results.fatGrams}g (${results.fatCalories} kcal)`;
        if (document.getElementById("resWater")) document.getElementById("resWater").innerText = `${results.waterLiters} لتر`;

        this.latestCalcResults = results;
    },

    // حفظ السعرات ومزامنتها مع ملف المتدرب الحالي فقط
    saveTargetCalories() {
        if (!this.latestCalcResults) this.runCalculator();
        const goalSelect = document.getElementById("calcGoal");
        const goalLabel = goalSelect && goalSelect.selectedIndex >= 0 ? goalSelect.options[goalSelect.selectedIndex].text.split("(")[0].trim() : undefined;
        const inputs = {
            gender: document.getElementById("calcGender")?.value,
            age: document.getElementById("calcAge")?.value,
            weight: document.getElementById("calcWeight")?.value,
            height: document.getElementById("calcHeight")?.value,
            activity: document.getElementById("calcActivity")?.value,
            goalLabel
        };
        const applied = IronCalculator.applyTargetToCurrentUser(this.latestCalcResults, inputs);
        if (applied) {
            showToast("تم حفظ السعرات والماكروز في ملفك ومزامنتها بنجاح! 🎯", "success");
            const user = IronAuth.getCurrentUser();
            if (user) {
                this.generateDayDiet(true);
                this.renderTraineeData(user.traineeData);
            }
        } else {
            showToast("تم احتساب السعرات بنجاح", "success");
        }
    },

    // =========================================================================
    // توليد وحفظ دايت اليوم الكامل (معزول لكل متدرب بمعرفه الخاص)
    // =========================================================================
    saveDietPlanForCurrentUser(plan) {
        const user = IronAuth.getCurrentUser();
        if (!user || !user.id) return;
        const allSaved = JSON.parse(localStorage.getItem("iron_saved_diets") || "{}");
        allSaved[user.id] = {
            ...plan,
            targetCaloriesSnapshot: user.traineeData?.calories || 2000
        };
        localStorage.setItem("iron_saved_diets", JSON.stringify(allSaved));
    },

    getSavedDietPlanForCurrentUser() {
        const user = IronAuth.getCurrentUser();
        if (!user || !user.id) return null;
        const allSaved = JSON.parse(localStorage.getItem("iron_saved_diets") || "{}");
        return allSaved[user.id] || null;
    },

    generateDayDiet(forceNew = false) {
        const user = IronAuth.getCurrentUser();
        const targetCal = user && user.traineeData && user.traineeData.calories ? user.traineeData.calories : 2000;

        let plan = !forceNew ? this.getSavedDietPlanForCurrentUser() : null;
        const targetChanged = plan && plan.targetCaloriesSnapshot && Math.abs(plan.targetCaloriesSnapshot - targetCal) > 50;

        if (!plan || !plan.breakfast || !plan.lunch || !plan.dinner || !plan.snack || targetChanged) {
            plan = IronMealsEngine.generateFullDayPlan(targetCal);
            this.saveDietPlanForCurrentUser(plan);
        } else {
            plan.difference = Math.round(plan.totalCalories - targetCal);
        }

        this.generateDayDietWithPlan(plan);
        if (forceNew) {
            showToast("تم توليد وحفظ جدول دايت يومي جديد يطابق سعراتك! 🥗", "success");
        }
    },

    shareDietPlanWhatsapp() {
        if (!this.currentDayDiet) return;
        const d = this.currentDayDiet;
        const msg =
`🥗 *جدولي الغذائي اليومي - أيرون كوتش (IronCoach Pro)*
🔥 *إجمالي السعرات:* ${d.totalCalories} kcal
🥩 بروتين: ${d.totalProtein}g | 🍞 كارب: ${d.totalCarbs}g | 🥑 دهون: ${d.totalFats}g
-------------------------------------------
🍳 *الإفطار:* ${d.breakfast.name} (${d.breakfast.calories} سعرة)
• ${d.breakfast.ingredients}

🍗 *الغداء:* ${d.lunch.name} (${d.lunch.calories} سعرة)
• ${d.lunch.ingredients}

🥣 *العشاء:* ${d.dinner.name} (${d.dinner.calories} سعرة)
• ${d.dinner.ingredients}

🥜 *السناك:* ${d.snack.name} (${d.snack.calories} سعرة)
• ${d.snack.ingredients}`;

        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
    },

    renderDayDietSlotCard(slotTitle, meal, slotKey) {
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
                        <h5 class="font-black text-white text-xs mb-1 line-clamp-1">${meal.name}</h5>
                        <p class="text-[11px] text-gray-400 line-clamp-2 leading-relaxed mb-2">${meal.ingredients}</p>
                    </div>

                    <div>
                        <div class="flex justify-between items-center text-[10px] font-bold text-gray-300 bg-slate-950 p-2 rounded-lg mb-2">
                            <span class="text-emerald-400">🔥 ${meal.calories} ك</span>
                            <span>🥩 ${meal.protein}ج</span>
                            <span>🍞 ${meal.carbs}ج</span>
                            <span>🥑 ${meal.fats}ج</span>
                        </div>
                        <button onclick="IronApp.swapDayMeal('${slotKey}', '${meal.id}')" class="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold text-[11px] rounded-lg transition border border-slate-700 flex items-center justify-center gap-1">
                            <span>🔄 استبدال الوجبة</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // استبدال وجبة محددة بوجبة مكافئة وحفظ الخطة
    swapDayMeal(slotKey, currentMealId) {
        const alts = IronMealsEngine.findMealAlternatives(currentMealId);
        if (alts.length === 0) {
            showToast("لا توجد بدائل إضافية بنفس السعرات حالياً", "error");
            return;
        }

        const randomAlt = alts[Math.floor(Math.random() * alts.length)];
        this.currentDayDiet[slotKey] = randomAlt;

        const user = IronAuth.getCurrentUser();
        const targetCal = user && user.traineeData && user.traineeData.calories ? user.traineeData.calories : 2000;

        const d = this.currentDayDiet;
        d.totalCalories = d.breakfast.calories + d.lunch.calories + d.dinner.calories + d.snack.calories;
        d.totalProtein = d.breakfast.protein + d.lunch.protein + d.dinner.protein + d.snack.protein;
        d.totalCarbs = d.breakfast.carbs + d.lunch.carbs + d.dinner.carbs + d.snack.carbs;
        d.totalFats = d.breakfast.fats + d.lunch.fats + d.dinner.fats + d.snack.fats;
        d.difference = Math.round(d.totalCalories - targetCal);

        this.saveDietPlanForCurrentUser(d);
        this.generateDayDietWithPlan(d);
        showToast(`تم استبدال الوجبة بـ: ${randomAlt.name}`, "success");
    },

    generateDayDietWithPlan(plan) {
        this.currentDayDiet = plan;
        const container = document.getElementById("generatedDayPlanContainer");
        if (!container) return;
        const user = IronAuth.getCurrentUser();
        const targetCal = user && user.traineeData && user.traineeData.calories ? user.traineeData.calories : 2000;
        const diffVal = typeof plan.difference === "number" ? plan.difference : Math.round(plan.totalCalories - targetCal);
        const diffText = diffVal === 0 ? "مطابق تماماً 🎯"
            : diffVal > 0 ? `+${diffVal} سعرة`
            : `${diffVal} سعرة`;

        container.innerHTML = `
            <div class="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div class="flex items-center gap-3 flex-wrap">
                        <span class="text-xs text-gray-400">إجمالي سعرات الدايت:</span>
                        <strong class="text-emerald-400 font-black text-lg">${plan.totalCalories} kcal</strong>
                        <span class="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-gray-300 font-mono">الهدف: ${targetCal} (${diffText})</span>
                    </div>
                    <div class="flex items-center gap-3 text-xs font-bold flex-wrap">
                        <span class="text-white">🥩 بروتين: ${plan.totalProtein}g</span>
                        <span class="text-amber-400">🍞 كارب: ${plan.totalCarbs}g</span>
                        <span class="text-teal-400">🥑 دهون: ${plan.totalFats}g</span>
                        <button onclick="IronApp.shareDietPlanWhatsapp()" class="px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 rounded-lg text-[11px] font-bold transition">
                            📲 مشاركة واتساب
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    ${this.renderDayDietSlotCard("إفطار", plan.breakfast, "breakfast")}
                    ${this.renderDayDietSlotCard("غداء", plan.lunch, "lunch")}
                    ${this.renderDayDietSlotCard("عشاء", plan.dinner, "dinner")}
                    ${this.renderDayDietSlotCard("سناك", plan.snack, "snack")}
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

        if (counter) counter.innerText = `إجمالي الوجبات المعروضة: ${meals.length} وجبة`;

        if (meals.length === 0) {
            grid.innerHTML = `<div class="col-span-full text-center py-12 text-gray-400">لا توجد وجبات تطابق بحثك حالياً.</div>`;
            return;
        }

        grid.innerHTML = meals.map(m => `
            <div class="meal-card bg-slate-950/60 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition flex flex-col justify-between">
                <div class="relative h-44 w-full bg-slate-950 overflow-hidden">
                    <img src="${m.img}" onerror="this.onerror=null;this.src=IronApp.getMealFallbackSvg('${m.category}')" class="w-full h-full object-cover transition duration-300 hover:scale-105" alt="${m.name}" loading="lazy">
                    <div class="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur text-xs font-bold text-white border border-slate-700">
                        ${m.category}
                    </div>
                </div>

                <div class="p-4 flex-1 flex flex-col justify-between">
                    <div>
                        <h4 class="font-black text-white text-sm mb-1.5">${m.name}</h4>
                        <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-xs text-gray-300 leading-relaxed mb-3">
                            <div class="text-[10px] font-bold text-emerald-400 mb-1">🛒 المكونات والأوزان بالجرام:</div>
                            ${m.ingredients}
                        </div>
                    </div>

                    <div class="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold bg-slate-900 p-2 rounded-xl border border-slate-800 text-gray-300">
                        <div>
                            <span class="text-gray-400 block text-[9px]">كالوري</span>
                            <span class="text-emerald-400 font-black">${m.calories}</span>
                        </div>
                        <div>
                            <span class="text-gray-400 block text-[9px]">بروتين</span>
                            <span class="text-white">${m.protein}g</span>
                        </div>
                        <div>
                            <span class="text-gray-400 block text-[9px]">كارب</span>
                            <span class="text-amber-400">${m.carbs}g</span>
                        </div>
                        <div>
                            <span class="text-gray-400 block text-[9px]">دهون</span>
                            <span class="text-teal-400">${m.fats}g</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join("");
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
        if (assignedBadge) {
            assignedBadge.innerText = `الجدول المعتمد: ${program.nameAr}`;
        }

        document.querySelectorAll(".prog-select-btn").forEach(btn => {
            if (btn.getAttribute("data-prog") === assignedProgId) {
                btn.className = "prog-select-btn p-3 rounded-2xl border text-center transition bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold text-xs shadow-lg shadow-emerald-500/10";
            } else {
                btn.className = "prog-select-btn p-3 rounded-2xl border text-center transition bg-slate-950 border-slate-800 text-gray-300 font-bold text-xs hover:border-slate-700";
            }
        });

        container.innerHTML = `
            <div class="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">${program.frequency}</span>
                            <span class="px-2.5 py-0.5 rounded-full bg-slate-800 text-gray-300 text-[11px] font-bold">${program.level}</span>
                        </div>
                        <h2 class="text-xl font-black text-white">${program.nameAr}</h2>
                        <div class="text-xs text-gray-400 font-mono mb-3">${program.nameEn}</div>
                        <p class="text-xs text-gray-300 leading-relaxed max-w-3xl">${program.description}</p>
                    </div>
                    ${program.image ? `
                        <div class="w-full md:w-48 h-28 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0">
                            <img src="${program.image}" onerror="this.parentElement.style.display='none'" class="w-full h-full object-cover opacity-90" alt="${program.nameAr}">
                        </div>
                    ` : ''}
                </div>
            </div>

            <!-- قائمة الأيام التدريبية داخل البرنامج -->
            <div class="space-y-4">
                ${program.days.map((day) => `
                    <div class="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
                            <div>
                                <h4 class="font-black text-white text-base">${day.title}</h4>
                                <div class="text-xs text-emerald-400 font-bold mt-0.5">العضلات المستهدفة: ${day.targetMuscles}</div>
                            </div>
                            <button onclick="IronApp.startLiveWorkout('${program.id}', '${day.dayId}')" class="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-90 transition flex items-center justify-center gap-1.5">
                                <span>🏋️‍♂️ ابدأ التمرين الآن (وضع الجيم)</span>
                            </button>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            ${day.exercises.map(item => {
                                const ex = getExerciseById(item.exerciseId);
                                if (!ex) return '';
                                return `
                                    <div onclick="IronApp.openExerciseDetail('${ex.id}')" class="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3 hover:border-emerald-500/40 cursor-pointer transition">
                                        <img src="${ex.gif}" onerror="this.onerror=null;this.src=IronApp.getExerciseFallbackSvg('${ex.muscle}')" class="w-16 h-16 rounded-lg object-contain bg-slate-950 border border-slate-800 flex-shrink-0" alt="${ex.nameAr}" loading="lazy">
                                        <div class="flex-1 min-w-0">
                                            <h5 class="font-bold text-white text-xs truncate">${ex.nameAr}</h5>
                                            <div class="text-[10px] text-gray-400 font-mono truncate mb-1">${ex.nameEn}</div>
                                            <div class="flex items-center gap-2 text-[10px] font-bold">
                                                <span class="text-emerald-400">${item.sets} جولات × ${item.reps}</span>
                                                <span class="text-gray-400">راحة: ${item.restSec}ث</span>
                                            </div>
                                        </div>
                                        <div class="text-gray-400 hover:text-white text-xs">ℹ️</div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `).join('')}
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

        const query = (document.getElementById("exerciseSearchInput")?.value || "").toLowerCase();
        let list = exercisesDatabase;

        if (this.currentExerciseMuscle !== "all") {
            list = list.filter(e => e.muscle === this.currentExerciseMuscle);
        }

        if (query.trim() !== "") {
            list = list.filter(e => e.nameAr.toLowerCase().includes(query) || e.nameEn.toLowerCase().includes(query));
        }

        grid.innerHTML = list.map(e => `
            <div onclick="IronApp.openExerciseDetail('${e.id}')" class="exercise-card bg-slate-950/60 border border-slate-800/80 rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between">
                <div class="relative h-48 w-full bg-slate-950 overflow-hidden flex items-center justify-center p-2">
                    <img src="${e.gif}" onerror="this.onerror=null;this.src=IronApp.getExerciseFallbackSvg('${e.muscle}')" class="w-full h-full object-contain" alt="${e.nameAr}" loading="lazy">
                    <div class="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur text-[11px] font-bold text-emerald-400 border border-emerald-500/20">
                        ${e.muscle}
                    </div>
                </div>

                <div class="p-4 flex-1 flex flex-col justify-between">
                    <div>
                        <h4 class="font-black text-white text-sm">${e.nameAr}</h4>
                        <div class="text-xs text-gray-400 font-mono mb-2">${e.nameEn}</div>
                        <p class="text-xs text-gray-300 line-clamp-2 leading-relaxed mb-3">${e.setup}</p>
                    </div>

                    <div class="flex items-center justify-between border-t border-slate-800/80 pt-3">
                        <span class="text-[11px] text-gray-400">الأداة: ${e.equipment}</span>
                        <span class="text-xs font-bold text-emerald-400">التفاصيل والتكنيك ←</span>
                    </div>
                </div>
            </div>
        `).join("");
    },

    setExerciseMuscle(muscle) {
        this.currentExerciseMuscle = muscle;
        document.querySelectorAll(".ex-muscle-btn").forEach(btn => {
            if (btn.getAttribute("data-muscle") === muscle) {
                btn.className = "ex-muscle-btn px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950";
            } else {
                btn.className = "ex-muscle-btn px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-gray-300";
            }
        });
        this.renderExercisesGrid();
    },

    filterExercises() {
        this.renderExercisesGrid();
    },

    // فتح تفاصيل التمرين الكاملة
    openExerciseDetail(exId) {
        const ex = getExerciseById(exId);
        const container = document.getElementById("exerciseDetailModalContent");
        if (!container || !ex) return;

        const alternatives = getAlternativeExercises(exId);

        container.innerHTML = `
            <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div>
                    <span class="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">${ex.muscle}</span>
                    <h3 class="text-lg font-black text-white mt-1">${ex.nameAr}</h3>
                    <div class="text-xs text-gray-400 font-mono">${ex.nameEn}</div>
                </div>
                <button onclick="closeModal('exerciseDetailModal')" class="text-gray-400 hover:text-white text-xl">✕</button>
            </div>

            <div class="w-full h-56 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 mb-4 flex items-center justify-center p-2">
                <img src="${ex.gif}" onerror="this.onerror=null;this.src=IronApp.getExerciseFallbackSvg('${ex.muscle}')" class="w-full h-full object-contain" alt="${ex.nameAr}">
            </div>

            <div class="space-y-4 text-xs leading-relaxed">
                <div class="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                    <strong class="text-emerald-400 block mb-1">🏁 وضعية الاستعداد والتثبيت (Setup):</strong>
                    <p class="text-gray-300">${ex.setup}</p>
                </div>

                <div class="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                    <strong class="text-emerald-400 block mb-1">🚀 طريقة الأداء الصحيح خطوة بخطوة:</strong>
                    <p class="text-gray-300">${ex.execution}</p>
                </div>

                <div class="bg-rose-950/20 p-3.5 rounded-xl border border-rose-500/30">
                    <strong class="text-rose-400 block mb-1">⚠️ أبرز الأخطاء الشائعة لتجنب الإصابة:</strong>
                    <ul class="list-disc list-inside text-gray-300 space-y-1">
                        ${ex.mistakes.map(m => `<li>${m}</li>`).join('')}
                    </ul>
                </div>

                <div class="bg-cyan-950/20 p-3.5 rounded-xl border border-cyan-500/30">
                    <strong class="text-cyan-400 block mb-1">💨 تكنيك التنفس الصحيح:</strong>
                    <p class="text-gray-300">${ex.breathing}</p>
                </div>

                ${alternatives.length > 0 ? `
                    <div class="border-t border-slate-800 pt-3">
                        <strong class="text-amber-400 block mb-2">⚡ التمارين البديلة (إذا كان الجهاز مشغولاً):</strong>
                        <div class="grid grid-cols-2 gap-2">
                            ${alternatives.map(alt => `
                                <div onclick="IronApp.openExerciseDetail('${alt.id}')" class="bg-slate-900 p-2.5 rounded-xl border border-slate-800 hover:border-amber-500/40 cursor-pointer flex items-center gap-2">
                                    <img src="${alt.gif}" onerror="this.onerror=null;this.src=IronApp.getExerciseFallbackSvg('${alt.muscle}')" class="w-10 h-10 rounded-lg object-contain bg-slate-950" alt="${alt.nameAr}">
                                    <div class="min-w-0">
                                        <div class="font-bold text-white text-[11px] truncate">${alt.nameAr}</div>
                                        <div class="text-[9px] text-gray-400 truncate">${alt.equipment}</div>
                                    </div>
                                </div>
                            `).join('')}
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

    // تسجيل الدخول
    handleLogin(e) {
        e.preventDefault();
        const u = document.getElementById("loginUsername").value;
        const p = document.getElementById("loginPassword").value;
        const err = document.getElementById("loginError");

        const res = IronAuth.login(u, p);
        if (res.success) {
            window.location.reload();
        } else {
            err.innerText = res.message || "بيانات الدخول غير صحيحة";
            err.classList.remove("hidden");
        }
    },

    // تسجيل دخول سريع للحسابات التجريبية للمعاينة
    quickLogin(u, p) {
        const res = IronAuth.login(u, p);
        if (res.success) {
            window.location.reload();
        }
    },

    showAuthScreen() {
        IronAuth.logout();
    },

    // إضافة وجبة مخصصة
    handleAddCustomMeal(e) {
        e.preventDefault();
        const form = e.target;
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

        saveCustomMeal(newMeal);
        closeModal("addCustomMealModal");
        form.reset();
        showToast("تمت إضافة الوجبة وحفظها في مكتبتك بنجاح!", "success");
        this.renderMealsGrid();
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
    handleAddTrainee(e) {
        e.preventDefault();
        const form = e.target;
        const trainee = {
            name: form.tName.value.trim(),
            username: form.tUsername.value.trim().toLowerCase(),
            password: form.tPassword.value.trim() || "123",
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
            coachNote: form.tCoachNote ? form.tCoachNote.value.trim() : ""
        };

        IronAuth.addTrainee(trainee);
        closeModal("addTraineeModal");
        form.reset();
        showToast(`تم إنشاء حساب المتدرب ${trainee.name} بنجاح!`, "success");
        IronCoachPanel.renderCoachDashboard();
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
        if (errorBox) errorBox.classList.add("hidden");

        if (!input.files || !input.files[0]) {
            if (previewBox) previewBox.classList.add("hidden");
            return;
        }

        const file = input.files[0];
        if (previewBox) {
            const sizeKB = Math.max(1, Math.round(file.size / 1024));
            previewBox.innerHTML = `✅ تم إرفاق الإيصال: <strong class="text-white">${file.name}</strong> (${sizeKB} KB)`;
            previewBox.classList.remove("hidden");
        }
    },

    openRenewPaymentModal() {
        const config = getAppConfig();
        const priceEl = document.getElementById("renewModalPrice");
        const vodafone = document.getElementById("renewModalVodafone");
        const instapay = document.getElementById("renewModalInstapay");
        const stc = document.getElementById("renewModalStc");
        const stripe = document.getElementById("renewStripeLink");
        const fileInput = document.getElementById("receiptUploadInput");
        const previewBox = document.getElementById("receiptPreviewBox");
        const errorBox = document.getElementById("receiptUploadError");

        if (priceEl && config.subscriptionPrice) {
            priceEl.innerText = `${config.subscriptionPrice.monthly} ${config.subscriptionPrice.currency}`;
        }
        if (vodafone) vodafone.innerText = config.coachInfo.vodafoneCash;
        if (instapay) instapay.innerText = config.coachInfo.instapayUser;
        if (stc) stc.innerText = config.coachInfo.stcPay;
        if (stripe) stripe.href = config.coachInfo.paymentLink;
        if (fileInput) fileInput.value = "";
        if (previewBox) previewBox.classList.add("hidden");
        if (errorBox) errorBox.classList.add("hidden");

        openModal("renewModal");
    },

    // تأكيد التجديد بعد التحقق من إرفاق إيصال الدفع الفعلي
    confirmRenewalPayment() {
        const fileInput = document.getElementById("receiptUploadInput");
        const errorBox = document.getElementById("receiptUploadError");

        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            if (errorBox) {
                errorBox.innerText = "⚠️ يرجى اختيار وإرفاق صورة إيصال التحويل أولاً لتأكيد التجديد";
                errorBox.classList.remove("hidden");
            }
            showToast("يرجى إرفاق صورة إيصال التحويل أولاً لتأكيد التجديد ⚠️", "error");
            return;
        }

        const receiptFile = fileInput.files[0];
        const user = IronAuth.getCurrentUser();
        if (user && user.role === "trainee") {
            const receiptInfo = {
                fileName: receiptFile.name,
                fileSize: receiptFile.size,
                uploadedAt: new Date().toISOString()
            };
            IronAuth.renewSubscription(user.id, 30, receiptInfo);
            closeModal("renewModal");
            showToast(`تم استلام الإيصال (${receiptFile.name}) وتجديد اشتراكك لـ 30 يوماً بنجاح! 🔥`, "success");
            setTimeout(() => window.location.reload(), 1200);
        }
    },

    contactCoachWhatsapp() {
        const config = getAppConfig();
        const coachPhone = (config.coachInfo.whatsapp || "").replace(/\D/g, '');
        window.open(`https://wa.me/${coachPhone}?text=${encodeURIComponent('مرحباً كوتش، أود تجديد اشتراكي الشهري في أيرون كوتش.')}`, '_blank');
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
