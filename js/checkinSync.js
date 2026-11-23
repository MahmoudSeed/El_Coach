/**
 * IronCoach Pro - Weekly Check-in & WhatsApp Direct Sync
 * نظام المتابعة والتقييم الأسبوعي وتوليد تقارير الواتساب المنسقة بنقرة واحدة
 */

const IronCheckinSync = {
    // إرسال التقرير الأسبوعي عبر واتساب (BUG-7 FIX: حساب فرق الوزن بدقة وعرض سجل المتابعات)
    sendWeeklyCheckin({ currentWeight, waist, adherenceRating, workoutEnergy, notes }) {
        const currentUser = IronAuth.getCurrentUser();
        const config = getAppConfig();
        const coachPhone = (config.coachInfo.whatsapp || "").replace(/\D/g, '');

        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();

        if (!currentUser || currentUser.role !== "trainee") {
            showToast(isEn ? "Please sign in as a trainee to submit a check-in" : "يجب تسجيل الدخول كمتدرب لتسجيل التقرير", "error");
            return;
        }

        const parsedWeight = parseFloat(currentWeight);
        if (isNaN(parsedWeight) || parsedWeight <= 0) {
            showToast(isEn ? "Please enter a valid weight" : "يرجى إدخال وزن صحيح", "error");
            return;
        }

        const trainee = currentUser.traineeData;
        if (!trainee.history) trainee.history = [];

        // تحديد الوزن السابق من آخر قراءة مسجلة في السجل أو الوزن المبدئي
        const lastHistoryEntry = trainee.history.length > 0 ? trainee.history[trainee.history.length - 1] : null;
        const hasBaseline = lastHistoryEntry && typeof lastHistoryEntry.weight === "number";
        let diffSymbol = isEn ? "First Baseline 🎯" : "أول تسجيل قياس 🎯";
        const unitKg = isEn ? "kg" : "كجم";

        if (hasBaseline) {
            const prevWeight = parseFloat(lastHistoryEntry.weight);
            const diff = parseFloat((parsedWeight - prevWeight).toFixed(1));
            diffSymbol = diff < 0
                ? (isEn ? `-${Math.abs(diff)} kg 📉 (Loss)` : `-${Math.abs(diff)} كجم 📉 (نزول)`)
                : diff > 0
                ? (isEn ? `+${diff} kg 📈 (Gain)` : `+${diff} كجم 📈 (زيادة)`)
                : (isEn ? `Stable (0.0 kg) 🎯` : `ثبات (0.0 كجم) 🎯`);
        }

        const todayStr = new Date().toLocaleDateString(isEn ? 'en-US' : 'ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        // حفظ التقييم في سجل المتدرب
        trainee.weight = parsedWeight;
        trainee.history.push({
            date: new Date().toISOString().split('T')[0],
            weight: parsedWeight,
            waist: parseFloat(waist) || null,
            adherence: adherenceRating,
            energy: workoutEnergy,
            notes: notes
        });
        IronAuth.updateTrainee(trainee);

        // تحديث واجهة المتدرب وسجل المتابعات وملخص الخطة فوراً
        if (typeof IronApp !== "undefined") {
            if (IronApp.renderCheckinHistory) IronApp.renderCheckinHistory(trainee);
            if (IronApp.renderHomePlanSummary) IronApp.renderHomePlanSummary(trainee);
        }

        const displayName = typeof IronI18n !== "undefined" ? IronI18n.trName(trainee) : trainee.name;
        const displayGoal = typeof IronI18n !== "undefined" ? IronI18n.trGoal(trainee.goal || "تنشيف وبناء عضلات") : (trainee.goal || "تنشيف وبناء عضلات");

        // إنشاء نص الرسالة المنسق للواتساب
        const message = isEn ?
`🏋️‍♂️ *Weekly Check-in Report - IronCoach Pro*
-------------------------------------------
👤 *Client:* ${displayName}
📅 *Date:* ${todayStr}
⚖️ *Current Weight:* ${parsedWeight} kg (${diffSymbol})
📏 *Waist:* ${waist ? waist + ' cm' : 'Not set'}
🎯 *Current Goal:* ${displayGoal} (${trainee.calories || 2000} kcal)
💪 *Workout Split:* ${trainee.program || 'PPL'}
🥗 *Diet Adherence:* ${adherenceRating}/10
⚡ *Workout Energy:* ${workoutEnergy}/10
-------------------------------------------
📝 *Client Notes:*
${notes || 'No additional notes, everything is going smoothly.'}
-------------------------------------------
_Sent automatically via IronCoach Pro_` :
`🏋️‍♂️ *تقرير المتابعة الأسبوعي - أيرون كوتش (IronCoach Pro)*
-------------------------------------------
👤 *المتدرب:* ${trainee.name}
📅 *التاريخ:* ${todayStr}
⚖️ *الوزن الحالي:* ${parsedWeight} كجم (${diffSymbol})
📏 *محيط الخصر:* ${waist ? waist + ' سم' : 'لم يُحدد'}
🎯 *الهدف الحالي:* ${trainee.goal || 'تنشيف وبناء عضلات'} (${trainee.calories || 2000} سعرة)
💪 *البرنامج التدريبي:* ${trainee.program || 'PPL'}
🥗 *الالتزام بالدايت:* ${adherenceRating}/10
⚡ *طاقة التمرين والنشاط:* ${workoutEnergy}/10
-------------------------------------------
📝 *ملاحظات واستفسار المتدرب:*
${notes || 'لا توجد ملاحظات إضافية، الأمور ممتازة.'}
-------------------------------------------
_تم إرسال هذا التقرير تلقائياً عبر تطبيق أيرون كوتش_`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${coachPhone}?text=${encodedMessage}`;

        // فتح الواتساب في نافذة جديدة
        window.open(whatsappUrl, '_blank');
        showToast(isEn ? "Check-in saved and Coach WhatsApp opened!" : "تم حفظ التقييم في سجلك وفتح واتساب الكوتش بنجاح!", "success");
    }
};
