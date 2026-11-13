/**
 * IronCoach Pro - Weekly Check-in & WhatsApp Direct Sync
 * نظام المتابعة والتقييم الأسبوعي وتوليد تقارير الواتساب المنسقة بنقرة واحدة
 */

const IronCheckinSync = {
    // إرسال التقرير الأسبوعي عبر واتساب
    sendWeeklyCheckin({ currentWeight, waist, adherenceRating, workoutEnergy, notes }) {
        const currentUser = IronAuth.getCurrentUser();
        const config = getAppConfig();
        const coachPhone = config.coachInfo.whatsapp.replace(/\D/g, '');

        if (!currentUser || currentUser.role !== "trainee") {
            showToast("يجب تسجيل الدخول كمتدرب لتسجيل التقرير", "error");
            return;
        }

        const trainee = currentUser.traineeData;
        const prevWeight = trainee.weight || currentWeight;
        const diff = (currentWeight - prevWeight).toFixed(1);
        const diffSymbol = diff < 0 ? `-${Math.abs(diff)} كجم 📉 (نزول)` : diff > 0 ? `+${diff} كجم 📈 (زيادة)` : `ثبات 🎯`;

        const todayStr = new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        // حفظ التقييم في سجل المتدرب
        trainee.weight = parseFloat(currentWeight);
        if (!trainee.history) trainee.history = [];
        trainee.history.push({
            date: new Date().toISOString().split('T')[0],
            weight: parseFloat(currentWeight),
            waist: parseFloat(waist) || null,
            adherence: adherenceRating,
            notes: notes
        });
        IronAuth.updateTrainee(trainee);

        // إنشاء نص الرسالة المنسق للواتساب
        const message = 
`🏋️‍♂️ *تقرير المتابعة الأسبوعي - أيرون كوتش (IronCoach Pro)*
-------------------------------------------
👤 *المتدرب:* ${trainee.name}
📅 *التاريخ:* ${todayStr}
⚖️ *الوزن الحالي:* ${currentWeight} كجم (${diffSymbol})
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
        showToast("تم حفظ التقييم وفتح واتساب الكوتش بنجاح!", "success");
    }
};
