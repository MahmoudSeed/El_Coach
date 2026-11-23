/**
 * IronCoach Pro - Meals & Smart Diet Generator Engine
 * محرك البحث والفلترة ومولد الدايت الذكي لليوم الكامل واستبدال الوجبات
 */

const IronMealsEngine = {
    // جلب جميع الوجبات (المدمجة + المخصصة)
    getAllMeals() {
        return getMealsDatabase();
    },

    // فلترة وبحث الوجبات
    filterMeals({ category = "all", query = "", maxCalories = null }) {
        let meals = this.getAllMeals();

        if (category && category !== "all") {
            meals = meals.filter(m => m.category === category);
        }

        if (query && query.trim() !== "") {
            const q = query.trim().toLowerCase();
            meals = meals.filter(m => {
                const trM = typeof IronI18n !== "undefined" ? IronI18n.trMeal(m) : m;
                return m.name.toLowerCase().includes(q) ||
                    m.ingredients.toLowerCase().includes(q) ||
                    (trM.name && trM.name.toLowerCase().includes(q)) ||
                    (trM.ingredients && trM.ingredients.toLowerCase().includes(q)) ||
                    (m.tags && m.tags.some(t => t.toLowerCase().includes(q)));
            });
        }

        if (maxCalories) {
            meals = meals.filter(m => m.calories <= maxCalories);
        }

        return meals;
    },

    // خوارزمية "مولد الدايت الذكي" لليوم الكامل
    generateFullDayPlan(targetCalories) {
        targetCalories = parseFloat(targetCalories) || 2000;
        const allMeals = this.getAllMeals();

        const breakfasts = allMeals.filter(m => m.category === "إفطار");
        const lunches = allMeals.filter(m => m.category === "غداء");
        const dinners = allMeals.filter(m => m.category === "عشاء");
        const snacks = allMeals.filter(m => m.category === "سناكس");

        // الأهداف التقريبية لكل وجبة:
        // الفطور ~25% | الغداء ~40% | العشاء ~25% | السناك ~10%
        const targetB = targetCalories * 0.25;
        const targetL = targetCalories * 0.40;
        const targetD = targetCalories * 0.25;
        const targetS = targetCalories * 0.10;

        // دالة لاختيار وجبة عشوائية قريبة من الهدف
        function pickClosest(list, target) {
            // فرز حسب الأقرب
            const sorted = [...list].sort((a, b) => Math.abs(a.calories - target) - Math.abs(b.calories - target));
            // اختيار أحد أفضل 4 عشوائياً للتنويع
            const topSlice = sorted.slice(0, Math.min(4, sorted.length));
            return topSlice[Math.floor(Math.random() * topSlice.length)];
        }

        let bestPlan = null;
        let smallestDiff = Infinity;

        // تجربة 20 توليفة سريعة لاختيار الأكثر دقة ومطابقة للهدف
        for (let i = 0; i < 20; i++) {
            const b = pickClosest(breakfasts, targetB);
            const l = pickClosest(lunches, targetL);
            const d = pickClosest(dinners, targetD);
            const s = pickClosest(snacks, targetS);

            const totalCal = b.calories + l.calories + d.calories + s.calories;
            const diff = Math.abs(totalCal - targetCalories);

            if (diff < smallestDiff) {
                smallestDiff = diff;
                bestPlan = {
                    breakfast: b,
                    lunch: l,
                    dinner: d,
                    snack: s,
                    totalCalories: totalCal,
                    totalProtein: b.protein + l.protein + d.protein + s.protein,
                    totalCarbs: b.carbs + l.carbs + d.carbs + s.carbs,
                    totalFats: b.fats + l.fats + d.fats + s.fats,
                    difference: Math.round(totalCal - targetCalories)
                };
            }
        }

        return bestPlan;
    },

    // البحث عن بدائل لوجبة معينة بنفس السعرات والماكروز (Meal Swap - BUG-4 FIX)
    findMealAlternatives(mealId) {
        const allMeals = this.getAllMeals();
        const currentMeal = allMeals.find(m => m.id === mealId);
        if (!currentMeal) return [];

        const sameCategory = allMeals.filter(m => m.category === currentMeal.category && m.id !== currentMeal.id);

        // البحث في نفس التصنيف بفارق سعرات لا يتعدى ±80 سعرة أولاً
        const withinRange = sameCategory
            .filter(m => Math.abs(m.calories - currentMeal.calories) <= 80)
            .sort((a, b) => Math.abs(a.calories - currentMeal.calories) - Math.abs(b.calories - currentMeal.calories));

        if (withinRange.length > 0) {
            return withinRange.slice(0, 5);
        }

        // في حال عدم توفر بديل ضمن ±80 سعرة (مثل وجبة مخصصة عالية السعرات)، نختار الأقرب في السعرات
        return sameCategory
            .sort((a, b) => Math.abs(a.calories - currentMeal.calories) - Math.abs(b.calories - currentMeal.calories))
            .slice(0, 5);
    }
};
