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

    PORTION_MULTIPLIERS: [0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.5],

    // تحجيم الوجبة حسب مضاعف الحصة مع حفظ القيم الأساسية للماكروز
    scaleMeal(meal, mult = 1) {
        if (!meal) return meal;
        const cleanMult = Math.max(0.5, Number(mult) || 1);
        const baseCal = Number(meal.baseCalories ?? meal.calories) || 0;
        const baseProt = Number(meal.baseProtein ?? meal.protein) || 0;
        const baseCarb = Number(meal.baseCarbs ?? meal.carbs) || 0;
        const baseFat = Number(meal.baseFats ?? meal.fats) || 0;
        return {
            ...meal,
            baseCalories: baseCal,
            baseProtein: baseProt,
            baseCarbs: baseCarb,
            baseFats: baseFat,
            portionMultiplier: cleanMult,
            calories: Math.round(baseCal * cleanMult),
            protein: Math.round(baseProt * cleanMult),
            carbs: Math.round(baseCarb * cleanMult),
            fats: Math.round(baseFat * cleanMult)
        };
    },

    // مطابقة وجبة بديلة لأقرب سعرات مطلوبة للخانة
    scaleMealToTarget(meal, targetSlotCalories) {
        if (!meal) return meal;
        const target = parseFloat(targetSlotCalories) || meal.calories || 300;
        const baseCal = Number(meal.baseCalories ?? meal.calories) || 300;
        let bestMult = 1;
        let bestScore = Infinity;
        for (const mult of this.PORTION_MULTIPLIERS) {
            const diff = Math.abs(Math.round(baseCal * mult) - target);
            const multPenalty = mult === 1 ? 0 : (mult % 0.5 === 0 ? 4 : 9);
            const score = diff + multPenalty;
            if (score < bestScore) {
                bestScore = score;
                bestMult = mult;
            }
        }
        return this.scaleMeal(meal, bestMult);
    },

    // خوارزمية "مولد الدايت الذكي" لليوم الكامل (يتوافق بدقة مع جميع مستويات السعرات 1200–4500+)
    generateFullDayPlan(targetCalories) {
        targetCalories = Math.max(1000, Math.round(parseFloat(targetCalories) || 2000));
        const allMeals = this.getAllMeals();

        const breakfasts = allMeals.filter(m => m.category === "إفطار");
        const lunches = allMeals.filter(m => m.category === "غداء");
        const dinners = allMeals.filter(m => m.category === "عشاء");
        const snacks = allMeals.filter(m => m.category === "سناكس");

        const targetB = targetCalories * 0.25;
        const targetL = targetCalories * 0.40;
        const targetD = targetCalories * 0.25;
        const targetS = targetCalories * 0.10;

        const multipliers = targetCalories <= 1450
            ? [0.75, 1, 1.25, 1.5]
            : targetCalories <= 2100
                ? [1, 1.25, 1.5, 1.75, 2]
                : [1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.5];

        const buildCandidates = (list, slotTarget) => {
            const pool = [];
            for (const meal of list) {
                let bestMult = 1;
                let bestDiff = Infinity;
                for (const mult of multipliers) {
                    const scaledCal = Math.round(meal.calories * mult);
                    const prefPenalty = (mult % 0.5 === 0) ? 0 : 12;
                    const diff = Math.abs(scaledCal - slotTarget) + prefPenalty;
                    if (diff < bestDiff) {
                        bestDiff = diff;
                        bestMult = mult;
                    }
                }
                pool.push({
                    scaled: this.scaleMeal(meal, bestMult),
                    diff: Math.abs(Math.round(meal.calories * bestMult) - slotTarget)
                });
            }
            pool.sort((a, b) => a.diff - b.diff);
            return pool.slice(0, Math.min(10, pool.length)).map(x => x.scaled);
        };

        const bPool = buildCandidates(breakfasts, targetB);
        const lPool = buildCandidates(lunches, targetL);
        const dPool = buildCandidates(dinners, targetD);

        // بناء كافة خيارات السناك المحجمة لموازنة المجموع النهائي بدقة عالية
        const snackOptions = [];
        for (const s of snacks) {
            for (const mult of this.PORTION_MULTIPLIERS) {
                snackOptions.push(this.scaleMeal(s, mult));
            }
        }

        let bestPlan = null;
        let smallestScore = Infinity;

        // تجربة 160 توليفة متنوعة واختيار السناك الأنسب للوصول إلى السعرات المستهدفة بأقل فرق ممكن
        for (let i = 0; i < 160; i++) {
            const b = bPool[Math.floor(Math.random() * bPool.length)];
            const l = lPool[Math.floor(Math.random() * lPool.length)];
            const d = dPool[Math.floor(Math.random() * dPool.length)];
            const remainingForSnack = targetCalories - (b.calories + l.calories + d.calories);

            // تجنب أن يكون السناك سالباً أو كبيراً جداً إلا للضرورة
            let chosenS = snackOptions[0];
            let bestSnackScore = Infinity;
            for (const sCand of snackOptions) {
                const totalCal = b.calories + l.calories + d.calories + sCand.calories;
                const dayDiff = Math.abs(totalCal - targetCalories);
                const snackPenalty = Math.abs(sCand.calories - Math.max(120, targetS)) * 0.08;
                const cleanMultPenalty = (sCand.portionMultiplier % 0.5 === 0) ? 0 : 3;
                const sc = dayDiff + snackPenalty + cleanMultPenalty;
                if (sc < bestSnackScore) {
                    bestSnackScore = sc;
                    chosenS = sCand;
                }
            }

            const totalCal = b.calories + l.calories + d.calories + chosenS.calories;
            const rawDiff = Math.abs(totalCal - targetCalories);
            const multComplexity = [b, l, d, chosenS].reduce((acc, m) => acc + (m.portionMultiplier % 0.5 === 0 ? 0 : 1.5), 0);
            const score = rawDiff + multComplexity;

            if (score < smallestScore) {
                smallestScore = score;
                bestPlan = {
                    breakfast: b,
                    lunch: l,
                    dinner: d,
                    snack: chosenS,
                    totalCalories: totalCal,
                    totalProtein: b.protein + l.protein + d.protein + chosenS.protein,
                    totalCarbs: b.carbs + l.carbs + d.carbs + chosenS.carbs,
                    totalFats: b.fats + l.fats + d.fats + chosenS.fats,
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
