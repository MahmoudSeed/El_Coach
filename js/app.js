/**
 * IronCoach Pro - Main Application Controller
 * المتحكم الرئيسي للتطبيق وإدارة التبويبات والواجهات
 */

// أدوات مساعدة عامة للنوافذ المنبثقة والإشعارات
function openModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add("active");
}

function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove("active");
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
        // تهيئة المشتركين الافتراضيين
        IronAuth.getAllTrainees();

        // فحص الجلسة الحالية أو تسجيل دخول افتراضي لأحمد (متدرب نشط للمعاينة الفورية)
        let user = IronAuth.getCurrentUser();
        if (!user) {
            const loginRes = IronAuth.login("ahmed", "123");
            if (loginRes.success) {
                user = loginRes.user;
            }
        }

        this.renderUserHeader(user);
        this.renderAppViews(user);
        this.initEventListeners();
    },

    // رسم شريط المستخدم العلوي
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
                <div class="flex items-center gap-3">
                    <div class="text-left hidden sm:block">
                        <div class="text-xs font-black text-white flex items-center gap-1 justify-end">
                            <span>${user.name}</span>
                            <span class="text-amber-400">👑</span>
                        </div>
                        <div class="text-[10px] text-emerald-400 font-bold">لوحة الكوتش الإدارية</div>
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
                : user.status === "expiring" ? `ينتهي قريباً (${user.daysLeft} يوم) ⚠️` 
                : `منتهي الاشتراك 🚫`;

            area.innerHTML = `
                <div class="flex items-center gap-2 sm:gap-3">
                    <div class="text-left hidden sm:block">
                        <div class="text-xs font-black text-white">${user.name}</div>
                        <div class="text-[10px] ${statusColor} px-2 py-0.5 rounded-full border inline-block mt-0.5 font-bold">
                            ${statusText}
                        </div>
                    </div>
                    ${user.status === "expired" ? `
                        <button onclick="IronApp.openRenewPaymentModal()" class="px-3 py-1.5 bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition animate-pulse">
                            تجديد 💳
                        </button>
                    ` : ''}
                    <button onclick="IronAuth.logout()" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold text-xs rounded-xl border border-slate-700 transition" title="تسجيل الخروج">
                        خروج 🚪
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

        // إخفاء الكل أولاً
        authView.classList.add("hidden");
        expiredView.classList.add("hidden");
        coachDashboardView.classList.add("hidden");
        traineeAppContainer.classList.add("hidden");

        if (!user) {
            authView.classList.remove("hidden");
            if (desktopNav) desktopNav.classList.add("hidden");
            if (mobileNav) mobileNav.classList.add("hidden");
            return;
        }

        if (desktopNav) desktopNav.classList.remove("hidden");
        if (mobileNav) mobileNav.classList.remove("hidden");

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
        traineeAppContainer.classList.remove("hidden");
        this.renderTraineeData(user.traineeData);
    },

    // تعبئة بيانات شاشات المتدرب
    renderTraineeData(trainee) {
        if (!trainee) return;

        // الرئيسية
        document.getElementById("homeWelcomeName").innerText = `أهلاً بك يا ${trainee.name} 👋`;
        document.getElementById("homeDaysLeftBadge").innerText = `باقي ${trainee.daysLeft} يوماً في اشتراكك 🔥`;
        document.getElementById("homeTargetCal").innerText = `${trainee.calories || 2000} kcal`;
        document.getElementById("homeTargetProtein").innerText = `${trainee.macros ? trainee.macros.protein : Math.round(trainee.weight * 2)}g`;
        document.getElementById("homeTargetCarbs").innerText = `${trainee.macros ? trainee.macros.carbs : 200}g`;
        document.getElementById("homeTargetWater").innerText = `${(trainee.weight * 0.035).toFixed(1)} لتر`;

        // إعداد الحاسبة بقيم المتدرب
        if (document.getElementById("calcWeight")) document.getElementById("calcWeight").value = trainee.weight || 75;
        if (document.getElementById("calcHeight")) document.getElementById("calcHeight").value = trainee.height || 175;
        if (document.getElementById("calcAge")) document.getElementById("calcAge").value = trainee.age || 26;
        if (document.getElementById("calcGender")) document.getElementById("calcGender").value = trainee.gender || "male";
        if (document.getElementById("calcActivity")) document.getElementById("calcActivity").value = trainee.activity || 1.55;

        this.runCalculator();
        this.generateDayDiet();
        this.renderMealsGrid();
        this.selectProgram(this.selectedProgramId);
        this.renderExercisesGrid();
    },

    // تبديل التبويبات
    switchTab(tabId) {
        this.currentTab = tabId;

        // تحديث محتوى التبويب
        document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
        const target = document.getElementById(`tab-${tabId}`);
        if (target) target.classList.add("active");

        // تحديث أزرار النافبار العلوي
        document.querySelectorAll(".tab-btn-desktop").forEach(btn => {
            if (btn.getAttribute("data-tab") === tabId) {
                btn.className = "tab-btn-desktop px-4 py-2 rounded-xl text-xs font-black bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20";
            } else {
                btn.className = "tab-btn-desktop px-4 py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition";
            }
        });

        // تحديث النافبار السفلي للهواتف
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

    // حفظ السعرات ومزامنتها مع المتدرب
    saveTargetCalories() {
        if (!this.latestCalcResults) this.runCalculator();
        const applied = IronCalculator.applyTargetToCurrentUser(this.latestCalcResults);
        if (applied) {
            showToast("تم حفظ السعرات والماكروز في ملفك ومزامنتها بنجاح! 🎯", "success");
            const user = IronAuth.getCurrentUser();
            if (user) this.renderTraineeData(user.traineeData);
        } else {
            showToast("تم احتساب السعرات بنجاح", "success");
        }
    },

    // توليد دايت لليوم الكامل
    generateDayDiet() {
        const user = IronAuth.getCurrentUser();
        const targetCal = user && user.traineeData && user.traineeData.calories ? user.traineeData.calories : 2000;
        const plan = IronMealsEngine.generateFullDayPlan(targetCal);
        this.currentDayDiet = plan;

        const container = document.getElementById("generatedDayPlanContainer");
        if (!container || !plan) return;

        const diffText = plan.difference === 0 ? "مطابق تماماً 🎯" 
            : plan.difference > 0 ? `+${plan.difference} سعرة` 
            : `${plan.difference} سعرة`;

        container.innerHTML = `
            <div class="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div class="flex items-center gap-3">
                        <span class="text-xs text-gray-400">إجمالي سعرات الدايت:</span>
                        <strong class="text-emerald-400 font-black text-lg">${plan.totalCalories} kcal</strong>
                        <span class="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-gray-300 font-mono">الهدف: ${targetCal} (${diffText})</span>
                    </div>
                    <div class="flex items-center gap-3 text-xs font-bold">
                        <span class="text-white">🥩 بروتين: ${plan.totalProtein}g</span>
                        <span class="text-amber-400">🍞 كارب: ${plan.totalCarbs}g</span>
                        <span class="text-teal-400">🥑 دهون: ${plan.totalFats}g</span>
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

    renderDayDietSlotCard(slotTitle, meal, slotKey) {
        return `
            <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition">
                <div class="relative h-28 w-full overflow-hidden bg-slate-950">
                    <img src="${meal.img}" class="w-full h-full object-cover" alt="${meal.name}" loading="lazy">
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

    // استبدال وجبة محددة بوجبة مكافئة
    swapDayMeal(slotKey, currentMealId) {
        const alts = IronMealsEngine.findMealAlternatives(currentMealId);
        if (alts.length === 0) {
            showToast("لا توجد بدائل إضافية بنفس السعرات حالياً", "error");
            return;
        }

        const randomAlt = alts[Math.floor(Math.random() * alts.length)];
        this.currentDayDiet[slotKey] = randomAlt;

        // إعادة حساب الإجماليات
        const d = this.currentDayDiet;
        d.totalCalories = d.breakfast.calories + d.lunch.calories + d.dinner.calories + d.snack.calories;
        d.totalProtein = d.breakfast.protein + d.lunch.protein + d.dinner.protein + d.snack.protein;
        d.totalCarbs = d.breakfast.carbs + d.lunch.carbs + d.dinner.carbs + d.snack.carbs;
        d.totalFats = d.breakfast.fats + d.lunch.fats + d.dinner.fats + d.snack.fats;

        this.generateDayDietWithPlan(d);
        showToast(`تم استبدال الوجبة بـ: ${randomAlt.name}`, "success");
    },

    generateDayDietWithPlan(plan) {
        this.currentDayDiet = plan;
        const container = document.getElementById("generatedDayPlanContainer");
        if (!container) return;
        const user = IronAuth.getCurrentUser();
        const targetCal = user && user.traineeData && user.traineeData.calories ? user.traineeData.calories : 2000;
        const diffText = plan.difference === 0 ? "مطابق تماماً 🎯" 
            : plan.difference > 0 ? `+${plan.difference} سعرة` 
            : `${plan.difference} سعرة`;

        container.innerHTML = `
            <div class="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div class="flex items-center gap-3">
                        <span class="text-xs text-gray-400">إجمالي سعرات الدايت:</span>
                        <strong class="text-emerald-400 font-black text-lg">${plan.totalCalories} kcal</strong>
                        <span class="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-gray-300 font-mono">الهدف: ${targetCal} (${diffText})</span>
                    </div>
                    <div class="flex items-center gap-3 text-xs font-bold">
                        <span class="text-white">🥩 بروتين: ${plan.totalProtein}g</span>
                        <span class="text-amber-400">🍞 كارب: ${plan.totalCarbs}g</span>
                        <span class="text-teal-400">🥑 دهون: ${plan.totalFats}g</span>
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
            <div class="bg-slate-950/60 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition flex flex-col justify-between">
                <div class="relative h-44 w-full bg-slate-950 overflow-hidden">
                    <img src="${m.img}" class="w-full h-full object-cover transition duration-300 hover:scale-105" alt="${m.name}" loading="lazy">
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

    // اختيار وعرض برنامج تدريبي
    selectProgram(progId) {
        this.selectedProgramId = progId;
        const program = getProgramById(progId);
        const container = document.getElementById("workoutProgramDetails");
        if (!container || !program) return;

        // تحديث أزرار البرامج
        document.querySelectorAll(".prog-select-btn").forEach(btn => {
            if (btn.getAttribute("data-prog") === progId) {
                btn.className = "prog-select-btn p-3 rounded-2xl border text-center transition bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold text-xs shadow-lg shadow-emerald-500/10";
            } else {
                btn.className = "prog-select-btn p-3 rounded-2xl border text-center transition bg-slate-950 border-slate-800 text-gray-300 font-bold text-xs hover:border-slate-700";
            }
        });

        container.innerHTML = `
            <div class="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">${program.frequency}</span>
                            <span class="px-2.5 py-0.5 rounded-full bg-slate-800 text-gray-300 text-[11px] font-bold">${program.level}</span>
                        </div>
                        <h2 class="text-xl font-black text-white">${program.nameAr}</h2>
                        <div class="text-xs text-gray-400 font-mono">${program.nameEn}</div>
                    </div>
                </div>
                <p class="text-xs text-gray-300 leading-relaxed max-w-3xl">${program.description}</p>
            </div>

            <!-- قائمة الأيام التدريبية داخل البرنامج -->
            <div class="space-y-4">
                ${program.days.map((day, dIdx) => `
                    <div class="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
                            <div>
                                <h4 class="font-black text-white text-base">${day.title}</h4>
                                <div class="text-xs text-emerald-400 font-bold mt-0.5">العضلات المستهدفة: ${day.targetMuscles}</div>
                            </div>
                            <!-- زر بدء الجلسة في الجيم -->
                            <button onclick="IronApp.startLiveWorkout('${program.id}', '${day.dayId}')" class="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-90 transition flex items-center justify-center gap-1.5">
                                <span>🏋️‍♂️ ابدأ التمرين الآن (وضع الجيم)</span>
                            </button>
                        </div>

                        <!-- جدول تمارين اليوم -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            ${day.exercises.map(item => {
                                const ex = getExerciseById(item.exerciseId);
                                if (!ex) return '';
                                return `
                                    <div onclick="IronApp.openExerciseDetail('${ex.id}')" class="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3 hover:border-emerald-500/40 cursor-pointer transition">
                                        <img src="${ex.gif}" class="w-16 h-16 rounded-lg object-contain bg-slate-950 border border-slate-800 flex-shrink-0" alt="${ex.nameAr}" loading="lazy">
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
                    <img src="${e.gif}" class="w-full h-full object-contain" alt="${e.nameAr}" loading="lazy">
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
                <img src="${ex.gif}" class="w-full h-full object-contain" alt="${ex.nameAr}">
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
                                    <img src="${alt.gif}" class="w-10 h-10 rounded-lg object-contain bg-slate-950" alt="${alt.nameAr}">
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

    // إضافة متدرب جديد
    handleAddTrainee(e) {
        e.preventDefault();
        const form = e.target;
        const trainee = {
            name: form.tName.value,
            username: form.tUsername.value,
            password: form.tPassword.value,
            phone: form.tPhone.value,
            subscriptionDays: parseInt(form.tDays.value) || 30,
            weight: parseFloat(form.tWeight.value) || 75,
            calories: parseInt(form.tCalories.value) || 2000,
            program: form.tProgram.value
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

    openRenewPaymentModal() {
        const config = getAppConfig();
        const vodafone = document.getElementById("renewModalVodafone");
        const instapay = document.getElementById("renewModalInstapay");
        const stc = document.getElementById("renewModalStc");
        const stripe = document.getElementById("renewStripeLink");

        if (vodafone) vodafone.innerText = config.coachInfo.vodafoneCash;
        if (instapay) instapay.innerText = config.coachInfo.instapayUser;
        if (stc) stc.innerText = config.coachInfo.stcPay;
        if (stripe) stripe.href = config.coachInfo.paymentLink;

        openModal("renewModal");
    },

    confirmRenewalPayment() {
        const user = IronAuth.getCurrentUser();
        if (user && user.role === "trainee") {
            IronAuth.renewSubscription(user.id, 30);
            closeModal("renewModal");
            showToast("تم استلام إيصال التحويل وتجديد اشتراكك لـ 30 يوماً بنجاح! شكراً لالتزامك 🔥", "success");
            setTimeout(() => window.location.reload(), 1500);
        }
    },

    contactCoachWhatsapp() {
        const config = getAppConfig();
        const coachPhone = config.coachInfo.whatsapp.replace(/\D/g, '');
        window.open(`https://wa.me/${coachPhone}?text=${encodeURIComponent('مرحباً كوتش، أود تجديد اشتراكي الشهري في أيرون كوتش.')}`, '_blank');
    },

    initEventListeners() {
        // إغلاق النوافذ عند النقر خارجها
        document.querySelectorAll(".modal-overlay").forEach(overlay => {
            overlay.addEventListener("click", (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove("active");
                }
            });
        });
    }
};

// تشغيل التطبيق فور اكتمال تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
    IronApp.init();
});
