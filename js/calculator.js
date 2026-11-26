/**
 * IronCoach Pro - NASM / Mifflin-St Jeor Calorie & Macro Engine
 * محرك حساب السعرات والماكروز العلمي المعتمد
 */

const IronCalculator = {
    calculate({ gender, age, weight, height, activity, goal }) {
        age = parseFloat(age) || 25;
        weight = parseFloat(weight) || 75;
        height = parseFloat(height) || 175;
        activity = parseFloat(activity) || 1.55;
        const parsedGoal = parseFloat(goal);
        const goalOffset = Number.isNaN(parsedGoal) ? -500 : parsedGoal;

        // 1. حساب معدل الأيض الأساسي (Mifflin-St Jeor BMR)
        let bmr = (10 * weight) + (6.25 * height) - (5 * age);
        bmr = gender === 'male' ? bmr + 5 : bmr - 161;

        // 2. حساب إجمالي استهلاك الطاقة اليومي (TDEE)
        const tdee = bmr * activity;

        // 3. السعرات المستهدفة
        const targetCalories = Math.max(1200, Math.round(tdee + goalOffset));

        // 4. توزيع الماكروز العلمي
        // البروتين: 2.0 جم لكل كجم من وزن الجسم (المعيار الذهبي لبناء واستشفاء العضلات)
        const proteinGrams = Math.round(weight * 2.0);
        const proteinCalories = proteinGrams * 4;

        // الدهون الصحية: 25% من إجمالي السعرات (ضرورية للهرمونات وصحة المفاصل)
        const fatCalories = targetCalories * 0.25;
        const fatGrams = Math.round(fatCalories / 9);

        // الكربوهيدرات: تغطية باقي السعرات لدعم الطاقة والأداء في الجيم
        const carbCalories = Math.max(0, targetCalories - (proteinCalories + fatCalories));
        const carbGrams = Math.round(carbCalories / 4);

        // حساب احتياج الماء اليومي (لتر/يوم)
        const waterLiters = (weight * 0.035).toFixed(1);

        return {
            bmr: Math.round(bmr),
            tdee: Math.round(tdee),
            targetCalories,
            proteinGrams,
            proteinCalories,
            proteinPct: Math.round((proteinCalories / targetCalories) * 100),
            fatGrams,
            fatCalories: Math.round(fatCalories),
            fatPct: 25,
            carbGrams,
            carbCalories: Math.round(carbCalories),
            carbPct: Math.round((carbCalories / targetCalories) * 100),
            waterLiters
        };
    },

    // حفظ النتائج في ملف المتدرب النشط فقط
    applyTargetToCurrentUser(results, inputs = null) {
        const currentUser = IronAuth.getCurrentUser();
        if (currentUser && currentUser.role === "trainee") {
            const trainee = currentUser.traineeData;
            trainee.calories = results.targetCalories;
            trainee.macros = {
                protein: results.proteinGrams,
                fats: results.fatGrams,
                carbs: results.carbGrams
            };
            if (inputs) {
                if (inputs.weight) trainee.weight = parseFloat(inputs.weight);
                if (inputs.height) trainee.height = parseFloat(inputs.height);
                if (inputs.age) trainee.age = parseInt(inputs.age);
                if (inputs.gender) trainee.gender = inputs.gender;
                if (inputs.activity) trainee.activity = parseFloat(inputs.activity);
                if (inputs.goalLabel) trainee.goal = inputs.goalLabel;
                if (inputs.goalOffset !== undefined && inputs.goalOffset !== null && !Number.isNaN(parseFloat(inputs.goalOffset))) {
                    trainee.goalOffset = parseFloat(inputs.goalOffset);
                }
            }
            IronAuth.updateTrainee(trainee);
            return true;
        }
        return false;
    }
};
