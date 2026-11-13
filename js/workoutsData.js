/**
 * IronCoach Pro - 6 Structured Scientific Workout Programs
 * البرامج التدريبية المعتمدة مع تقسيم الأيام والجولات والتكرارات وفترات الراحة
 */

const workoutProgramsDatabase = [
    // ==========================================================
    // 1. برنامج Push / Pull / Legs (PPL) - 3 إلى 6 أيام
    // ==========================================================
    {
        id: "prog_ppl",
        nameAr: "نظام الدفع والسحب والأرجل (PPL)",
        nameEn: "Push - Pull - Legs Split",
        frequency: "3 - 6 أيام / أسبوع",
        level: "متوسط إلى متقدم",
        description: "النظام الأكثر شعبية وشهرة عالمياً لبناء الكتلة العضلية؛ يفصل عضلات الدفع (صدر، أكتاف، تراي) عن عضلات السحب (ظهر، باي، كتف خلفي) والأرجل.",
        image: "Training Programs/Push_pull_legs.png",
        days: [
            {
                dayId: "ppl_d1",
                title: "اليوم الأول: تمارين الدفع (Push Day)",
                targetMuscles: "صدر، أكتاف أمامية وجانبية، ترايسبس",
                exercises: [
                    { exerciseId: "ex_ch_1", sets: 4, reps: "6 - 8", restSec: 120, rpe: 8, note: "تركيز على زيادة الوزن تدريجياً" },
                    { exerciseId: "ex_ch_3", sets: 3, reps: "8 - 10", restSec: 90, rpe: 8, note: "زاوية البنش 30 درجة لقمة الصدر" },
                    { exerciseId: "ex_sh_1", sets: 3, reps: "10 - 12", restSec: 90, rpe: 8, note: "ضغط الكتف مع التحكم في النزول" },
                    { exerciseId: "ex_sh_3", sets: 4, reps: "12 - 15", restSec: 60, rpe: 9, note: "رفرفة جانبية لعرض الكتف" },
                    { exerciseId: "ex_arm_4", sets: 3, reps: "10 - 12", restSec: 60, rpe: 9, note: "عصر الترايسبس في الأسفل" },
                    { exerciseId: "ex_arm_5", sets: 3, reps: "10 - 12", restSec: 60, rpe: 8, note: "تثبيت الكوعين جيداً" }
                ]
            },
            {
                dayId: "ppl_d2",
                title: "اليوم الثاني: تمارين السحب (Pull Day)",
                targetMuscles: "عضلات الظهر كاملة، كتف خلفي، بايسبس",
                exercises: [
                    { exerciseId: "ex_bk_1", sets: 4, reps: "8 - 10", restSec: 90, rpe: 8, note: "سحب عريض لتعريض عضلات الظهر" },
                    { exerciseId: "ex_bk_3", sets: 4, reps: "8 - 10", restSec: 90, rpe: 8, note: "استقامة الظهر التامة وضغط اللوحين" },
                    { exerciseId: "ex_bk_4", sets: 3, reps: "10 - 12", restSec: 75, rpe: 8, note: "سحب أرضي لسمك الظهر" },
                    { exerciseId: "ex_sh_5", sets: 4, reps: "12 - 15", restSec: 60, rpe: 9, note: "حماية مفصل الكتف وتدوير خارجي" },
                    { exerciseId: "ex_arm_1", sets: 3, reps: "10 - 12", restSec: 60, rpe: 9, note: "إطالة كاملة للبايسبس" },
                    { exerciseId: "ex_arm_3", sets: 3, reps: "10 - 12", restSec: 60, rpe: 8, note: "ضخامة الساعد والبراكياليس" }
                ]
            },
            {
                dayId: "ppl_d3",
                title: "اليوم الثالث: تمارين الأرجل والكور (Legs & Core)",
                targetMuscles: "أفخاذ أمامية، خلفية، سمانة، بطن",
                exercises: [
                    { exerciseId: "ex_lg_1", sets: 4, reps: "6 - 8", restSec: 150, rpe: 8, note: "العمود الفقري مشدود والنزول موازي" },
                    { exerciseId: "ex_lg_2", sets: 4, reps: "8 - 10", restSec: 90, rpe: 8, note: "إطالة أوتار الركبة الخلفية والمؤخرة" },
                    { exerciseId: "ex_lg_3", sets: 3, reps: "10 - 12", restSec: 90, rpe: 8, note: "دفع الأرجل دون قفل الركبة" },
                    { exerciseId: "ex_lg_4", sets: 3, reps: "12 - 15", restSec: 60, rpe: 9, note: "عزل وضخ الدم في الفخذ الأمامي" },
                    { exerciseId: "ex_lg_5", sets: 3, reps: "10 - 12", restSec: 60, rpe: 9, note: "ثني أرجل خلفي" },
                    { exerciseId: "ex_ab_1", sets: 3, reps: "12 - 15", restSec: 60, rpe: 8, note: "رفع أرجل معلق لعضلات البطن" }
                ]
            }
        ]
    },

    // ==========================================================
    // 2. برنامج Upper / Lower Split - 4 أيام
    // ==========================================================
    {
        id: "prog_upper_lower",
        nameAr: "نظام الجزء العلوي والسفلي (Upper / Lower)",
        nameEn: "Upper / Lower Split",
        frequency: "4 أيام / أسبوع",
        level: "مناسب لجميع المستويات (أفضل استشفاء)",
        description: "يقسم الجسم إلى يومين علوي ويومين سفلي أسبوعياً، موفراً راحة 3 أيام أسبوعياً مع استهداف كل عضلة مرتين لبناء عضلي مثالي.",
        image: "Training Programs/Upper_Lower.jpeg",
        days: [
            {
                dayId: "ul_d1",
                title: "اليوم الأول: الجزء العلوي (قوة - Upper Power)",
                targetMuscles: "صدر، ظهر، أكتاف، ذراعين",
                exercises: [
                    { exerciseId: "ex_ch_1", sets: 4, reps: "5 - 7", restSec: 120, rpe: 8, note: "ضغط بنش ثقيل" },
                    { exerciseId: "ex_bk_3", sets: 4, reps: "6 - 8", restSec: 120, rpe: 8, note: "تجديف بار منحني" },
                    { exerciseId: "ex_sh_2", sets: 3, reps: "6 - 8", restSec: 90, rpe: 8, note: "ضغط عسكري واقفاً" },
                    { exerciseId: "ex_bk_1", sets: 3, reps: "8 - 10", restSec: 90, rpe: 8, note: "سحب ظهر عالي" },
                    { exerciseId: "ex_arm_2", sets: 3, reps: "8 - 10", restSec: 60, rpe: 8, note: "بايسبس بار زجزاج" },
                    { exerciseId: "ex_arm_5", sets: 3, reps: "8 - 10", restSec: 60, rpe: 8, note: "سكال كراشر للتراي" }
                ]
            },
            {
                dayId: "ul_d2",
                title: "اليوم الثاني: الجزء السفلي (قوة - Lower Power)",
                targetMuscles: "أفخاذ، سمانة، بطن وكور",
                exercises: [
                    { exerciseId: "ex_lg_1", sets: 4, reps: "6 - 8", restSec: 150, rpe: 8, note: "سكوات حر بالبار" },
                    { exerciseId: "ex_lg_2", sets: 4, reps: "8 - 10", restSec: 90, rpe: 8, note: "ديدليفت روماني للأفخاذ الخلفية" },
                    { exerciseId: "ex_lg_3", sets: 3, reps: "8 - 10", restSec: 90, rpe: 8, note: "لج برس ثقيل" },
                    { exerciseId: "ex_lg_5", sets: 3, reps: "10 - 12", restSec: 60, rpe: 8, note: "ثني خلفي بالجهاز" },
                    { exerciseId: "ex_ab_3", sets: 3, reps: "45 ثانية", restSec: 60, rpe: 8, note: "بلانك ثبات الكور" }
                ]
            },
            {
                dayId: "ul_d3",
                title: "اليوم الثالث: الجزء العلوي (ضخامة - Upper Hypertrophy)",
                targetMuscles: "صدر، ظهر، أكتاف جانبية وخلفية، ذراعين",
                exercises: [
                    { exerciseId: "ex_ch_3", sets: 4, reps: "8 - 12", restSec: 90, rpe: 8, note: "بنش مائل دمبل" },
                    { exerciseId: "ex_bk_2", sets: 4, reps: "8 - 10", restSec: 90, rpe: 8, note: "عقلة أو سحب عالي" },
                    { exerciseId: "ex_ch_4", sets: 3, reps: "12 - 15", restSec: 60, rpe: 9, note: "تفتيح كيبل لضخ الدم بالصدر" },
                    { exerciseId: "ex_sh_3", sets: 4, reps: "12 - 15", restSec: 60, rpe: 9, note: "رفرفة جانبية" },
                    { exerciseId: "ex_sh_5", sets: 3, reps: "15", restSec: 60, rpe: 9, note: "فيس بول للكتف الخلفي" },
                    { exerciseId: "ex_arm_1", sets: 3, reps: "10 - 12", restSec: 60, rpe: 8, note: "إنكلاين كيرل للباي" },
                    { exerciseId: "ex_arm_4", sets: 3, reps: "12 - 15", restSec: 60, rpe: 9, note: "تراي بالحبل" }
                ]
            },
            {
                dayId: "ul_d4",
                title: "اليوم الرابع: الجزء السفلي (ضخامة - Lower Hypertrophy)",
                targetMuscles: "أفخاذ أمامية وخلفية ومؤخرة وكور",
                exercises: [
                    { exerciseId: "ex_bk_6", sets: 3, reps: "5", restSec: 150, rpe: 8, note: "ديدليفت تقليدي" },
                    { exerciseId: "ex_lg_6", sets: 3, reps: "10 لكل رجل", restSec: 90, rpe: 8, note: "سكوات بلغاري" },
                    { exerciseId: "ex_lg_4", sets: 4, reps: "12 - 15", restSec: 60, rpe: 9, note: "فرد أرجل أمامي" },
                    { exerciseId: "ex_lg_5", sets: 3, reps: "12 - 15", restSec: 60, rpe: 9, note: "ثني أرجل خلفي" },
                    { exerciseId: "ex_ab_2", sets: 3, reps: "15", restSec: 60, rpe: 8, note: "طحن بطن بالكيبل" }
                ]
            }
        ]
    },

    // ==========================================================
    // 3. برنامج Arnold Split - 6 أيام
    // ==========================================================
    {
        id: "prog_arnold",
        nameAr: "نظام آرنولد شوارزنيجر (Arnold Split)",
        nameEn: "Arnold Schwarzenegger Split",
        frequency: "6 أيام / أسبوع",
        level: "متقدم (ضخامة عضلية أسطورية)",
        description: "البرنامج الأسطوري الذي بنى به آرنولد جسمه: يوم (صدر وظهر سوبر سيت لضخ دم خرافي)، يوم (أكتاف وذراعين لتناسق هائل)، ويوم (أرجل وبطن).",
        image: "Training Programs/Arnold_Split.png",
        days: [
            {
                dayId: "arn_d1",
                title: "اليوم الأول والرابع: عضلات الصدر والظهر (Chest & Back)",
                targetMuscles: "الصدر والظهر معاً (عضلات مضادة Antagonist)",
                exercises: [
                    { exerciseId: "ex_ch_1", sets: 4, reps: "8 - 10", restSec: 90, rpe: 8, note: "ضغط بنش مستوي بالبار" },
                    { exerciseId: "ex_bk_2", sets: 4, reps: "8 - 10", restSec: 90, rpe: 8, note: "عقلة بوزن الجسم" },
                    { exerciseId: "ex_ch_3", sets: 4, reps: "10 - 12", restSec: 75, rpe: 8, note: "بنش مائل دمبل" },
                    { exerciseId: "ex_bk_3", sets: 4, reps: "8 - 10", restSec: 75, rpe: 8, note: "تجديف بار منحني" },
                    { exerciseId: "ex_ch_4", sets: 3, reps: "12 - 15", restSec: 60, rpe: 9, note: "تفتيح كيبل" },
                    { exerciseId: "ex_bk_4", sets: 3, reps: "12 - 15", restSec: 60, rpe: 9, note: "سحب أرضي بالكيبل" }
                ]
            },
            {
                dayId: "arn_d2",
                title: "اليوم الثاني والخامس: الأكتاف والذراعين (Shoulders & Arms)",
                targetMuscles: "أكتاف كاملة، بايسبس، وترايسبس",
                exercises: [
                    { exerciseId: "ex_sh_1", sets: 4, reps: "8 - 10", restSec: 90, rpe: 8, note: "ضغط كتف بالدمبل" },
                    { exerciseId: "ex_sh_3", sets: 4, reps: "12 - 15", restSec: 60, rpe: 9, note: "رفرفة جانبية" },
                    { exerciseId: "ex_sh_6", sets: 3, reps: "12 - 15", restSec: 60, rpe: 9, note: "كتف خلفي بالجهاز" },
                    { exerciseId: "ex_arm_2", sets: 4, reps: "8 - 10", restSec: 60, rpe: 8, note: "بايسبس بار زجزاج" },
                    { exerciseId: "ex_arm_4", sets: 4, reps: "10 - 12", restSec: 60, rpe: 8, note: "تراي بالحبل" },
                    { exerciseId: "ex_arm_1", sets: 3, reps: "10 - 12", restSec: 60, rpe: 9, note: "إنكلاين كيرل باي" },
                    { exerciseId: "ex_arm_6", sets: 3, reps: "10 - 12", restSec: 60, rpe: 8, note: "تراي دمبل فوق الرأس" }
                ]
            },
            {
                dayId: "arn_d3",
                title: "اليوم الثالث والسادس: الأرجل والكور (Legs & Core)",
                targetMuscles: "أرجل أمامية وخلفية، سمانة، عضلات البطن",
                exercises: [
                    { exerciseId: "ex_lg_1", sets: 4, reps: "8 - 10", restSec: 120, rpe: 8, note: "سكوات بالبار" },
                    { exerciseId: "ex_lg_2", sets: 4, reps: "8 - 10", restSec: 90, rpe: 8, note: "ديدليفت روماني" },
                    { exerciseId: "ex_lg_3", sets: 3, reps: "10 - 12", restSec: 90, rpe: 8, note: "دفع أرجل بالماكينة" },
                    { exerciseId: "ex_lg_4", sets: 3, reps: "12 - 15", restSec: 60, rpe: 9, note: "فرد أرجل أمامي" },
                    { exerciseId: "ex_lg_5", sets: 3, reps: "12 - 15", restSec: 60, rpe: 9, note: "ثني أرجل خلفي" },
                    { exerciseId: "ex_ab_1", sets: 3, reps: "15", restSec: 60, rpe: 8, note: "رفع أرجل على العقلة" }
                ]
            }
        ]
    },

    // ==========================================================
    // 4. برنامج Bro Split (عضلة واحدة يومياً) - 5 أيام
    // ==========================================================
    {
        id: "prog_bro",
        nameAr: "نظام التقسيم الكلاسيكي (Bro Split)",
        nameEn: "Classic Bodybuilding 5-Day Split",
        frequency: "5 أيام / أسبوع",
        level: "جميع المستويات (تركيز فائق على كل عضلة)",
        description: "النظام المفضل في صالات الجيم الكلاسيكية؛ تخصيص يوم كامل لكل مجموعة عضلية لضخ الدم والإنهاك العضلي التام.",
        image: "Training Programs/Bro_Split.png",
        days: [
            {
                dayId: "bro_d1",
                title: "اليوم الأول: يوم الصدر (Chest Day)",
                targetMuscles: "عضلات الصدر كاملة",
                exercises: [
                    { exerciseId: "ex_ch_1", sets: 4, reps: "6 - 8", restSec: 120, rpe: 8, note: "بنش بار مستوي" },
                    { exerciseId: "ex_ch_3", sets: 4, reps: "8 - 10", restSec: 90, rpe: 8, note: "بنش دمبل مائل" },
                    { exerciseId: "ex_ch_5", sets: 3, reps: "10 - 12", restSec: 75, rpe: 8, note: "ضغط الصدر بالجهاز" },
                    { exerciseId: "ex_ch_4", sets: 3, reps: "12 - 15", restSec: 60, rpe: 9, note: "تفتيح كيبل كروس أوفر" },
                    { exerciseId: "ex_ch_6", sets: 3, reps: "فشل عضلي", restSec: 75, rpe: 9, note: "متوازي لأسفل الصدر" }
                ]
            },
            {
                dayId: "bro_d2",
                title: "اليوم الثاني: يوم الظهر (Back Day)",
                targetMuscles: "عضلات الظهر كاملة والمجانس",
                exercises: [
                    { exerciseId: "ex_bk_6", sets: 3, reps: "5 - 6", restSec: 150, rpe: 8, note: "ديدليفت ثقيل" },
                    { exerciseId: "ex_bk_1", sets: 4, reps: "8 - 10", restSec: 90, rpe: 8, note: "سحب عالي بالكيبل" },
                    { exerciseId: "ex_bk_3", sets: 4, reps: "8 - 10", restSec: 90, rpe: 8, note: "سحب بار منحني" },
                    { exerciseId: "ex_bk_5", sets: 3, reps: "10 - 12", restSec: 75, rpe: 8, note: "سحب دمبل فردي" },
                    { exerciseId: "ex_bk_4", sets: 3, reps: "12 - 15", restSec: 60, rpe: 9, note: "سحب أرضي بالكيبل" }
                ]
            },
            {
                dayId: "bro_d3",
                title: "اليوم الثالث: يوم الأكتاف (Shoulder Day)",
                targetMuscles: "كتف أمامي، جانبي، خلفي وترابيس",
                exercises: [
                    { exerciseId: "ex_sh_1", sets: 4, reps: "8 - 10", restSec: 90, rpe: 8, note: "ضغط دمبل جالس" },
                    { exerciseId: "ex_sh_3", sets: 4, reps: "12 - 15", restSec: 60, rpe: 9, note: "رفرفة جانبية بالدمبل" },
                    { exerciseId: "ex_sh_4", sets: 3, reps: "12 - 15", restSec: 60, rpe: 9, note: "رفرفة كيبل مفرد" },
                    { exerciseId: "ex_sh_6", sets: 4, reps: "12 - 15", restSec: 60, rpe: 9, note: "كتف خلفي بالجهاز" },
                    { exerciseId: "ex_sh_5", sets: 3, reps: "15", restSec: 60, rpe: 9, note: "فيس بول بالحبل" }
                ]
            },
            {
                dayId: "bro_d4",
                title: "اليوم الرابع: يوم الأرجل (Leg Day)",
                targetMuscles: "أفخاذ كاملة، سمانة، بطن",
                exercises: [
                    { exerciseId: "ex_lg_1", sets: 4, reps: "6 - 8", restSec: 150, rpe: 8, note: "سكوات بالبار" },
                    { exerciseId: "ex_lg_3", sets: 4, reps: "8 - 10", restSec: 90, rpe: 8, note: "دفع أرجل بالماكينة" },
                    { exerciseId: "ex_lg_2", sets: 3, reps: "8 - 10", restSec: 90, rpe: 8, note: "ديدليفت روماني بالدمبل" },
                    { exerciseId: "ex_lg_4", sets: 3, reps: "12 - 15", restSec: 60, rpe: 9, note: "فرد أرجل أمامي" },
                    { exerciseId: "ex_lg_5", sets: 3, reps: "12 - 15", restSec: 60, rpe: 9, note: "ثني أرجل خلفي" },
                    { exerciseId: "ex_ab_1", sets: 3, reps: "15", restSec: 60, rpe: 8, note: "رفع أرجل معلق" }
                ]
            },
            {
                dayId: "bro_d5",
                title: "اليوم الخامس: يوم الذراعين الكامل (Arms Day)",
                targetMuscles: "بايسبس، ترايسبس، وساعدين",
                exercises: [
                    { exerciseId: "ex_arm_2", sets: 4, reps: "8 - 10", restSec: 60, rpe: 8, note: "بار زجزاج للباي" },
                    { exerciseId: "ex_arm_5", sets: 4, reps: "8 - 10", restSec: 60, rpe: 8, note: "سكال كراشر للتراي" },
                    { exerciseId: "ex_arm_1", sets: 3, reps: "10 - 12", restSec: 60, rpe: 8, note: "إنكلاين كيرل للباي" },
                    { exerciseId: "ex_arm_4", sets: 3, reps: "12 - 15", restSec: 60, rpe: 9, note: "تراي بالحبل" },
                    { exerciseId: "ex_arm_3", sets: 3, reps: "10 - 12", restSec: 60, rpe: 8, note: "هامر كيرل للساعد والبراكياليس" },
                    { exerciseId: "ex_arm_6", sets: 3, reps: "10 - 12", restSec: 60, rpe: 8, note: "تراي فوق الرأس" }
                ]
            }
        ]
    },

    // ==========================================================
    // 5. برنامج Anterior / Posterior Split - 4 أيام
    // ==========================================================
    {
        id: "prog_anterior_posterior",
        nameAr: "نظام السلسلة الأمامية والخلفية (Anterior / Posterior)",
        nameEn: "Anterior & Posterior Chain Split",
        frequency: "4 أيام / أسبوع",
        level: "متقدم (توازن عضلي ميكانيكي)",
        description: "تقسيم الجسم وفق السلاسل الحركية الميكانيكية: يوم لعضلات السلسلة الأمامية (صدر، فخذ أمامي، كتف أمامي، بطن) ويوم لعضلات السلسلة الخلفية (ظهر، فخذ خلفي، مؤخرة، كتف خلفي).",
        image: "Training Programs/Anterior_Posterior.png",
        days: [
            {
                dayId: "ap_d1",
                title: "اليوم الأول: السلسلة الأمامية (Anterior Chain)",
                targetMuscles: "صدر، أفخاذ أمامية، أكتاف أمامية وجانبية، بطن",
                exercises: [
                    { exerciseId: "ex_lg_1", sets: 4, reps: "6 - 8", restSec: 120, rpe: 8, note: "سكوات" },
                    { exerciseId: "ex_ch_1", sets: 4, reps: "6 - 8", restSec: 120, rpe: 8, note: "ضغط بنش مستوي" },
                    { exerciseId: "ex_lg_4", sets: 3, reps: "12 - 15", restSec: 60, rpe: 9, note: "فرد أرجل أمامي" },
                    { exerciseId: "ex_sh_3", sets: 4, reps: "12 - 15", restSec: 60, rpe: 9, note: "رفرفة جانبية" },
                    { exerciseId: "ex_ab_2", sets: 3, reps: "15", restSec: 60, rpe: 8, note: "طحن بطن بالكيبل" }
                ]
            },
            {
                dayId: "ap_d2",
                title: "اليوم الثاني: السلسلة الخلفية (Posterior Chain)",
                targetMuscles: "ظهر، أفخاذ خلفية، مؤخرة، كتف خلفي",
                exercises: [
                    { exerciseId: "ex_bk_6", sets: 3, reps: "5", restSec: 150, rpe: 8, note: "ديدليفت تقليدي" },
                    { exerciseId: "ex_bk_1", sets: 4, reps: "8 - 10", restSec: 90, rpe: 8, note: "سحب عالي بالكيبل" },
                    { exerciseId: "ex_lg_2", sets: 3, reps: "8 - 10", restSec: 90, rpe: 8, note: "ديدليفت روماني" },
                    { exerciseId: "ex_bk_3", sets: 3, reps: "8 - 10", restSec: 90, rpe: 8, note: "سحب بار منحني" },
                    { exerciseId: "ex_sh_5", sets: 4, reps: "15", restSec: 60, rpe: 9, note: "فيس بول للكتف الخلفي" }
                ]
            }
        ]
    },

    // ==========================================================
    // 6. برنامج Full Body (جسم كامل 3 أيام)
    // ==========================================================
    {
        id: "prog_full_body",
        nameAr: "برنامج الجسم الكامل (Full Body 3-Day)",
        nameEn: "Full Body 3-Day Workout",
        frequency: "3 أيام / أسبوع",
        level: "مثالي للمبتدئين ولضيق الوقت",
        description: "تدريب الجسم بالكامل 3 مرات أسبوعياً بالتركيز على التمارين المركبة الأساسية، مما يمنح أسرع استجابة عضلية وحرقاً عالياً للسعرات مع 4 أيام راحة.",
        image: "Training Programs/PPL×Upper_ Lower.png",
        days: [
            {
                dayId: "fb_d1",
                title: "يوم الجسم الكامل (أ)",
                targetMuscles: "صدر، ظهر، أرجل، أكتاف، كور",
                exercises: [
                    { exerciseId: "ex_lg_1", sets: 3, reps: "8 - 10", restSec: 120, rpe: 8, note: "سكوات بالبار" },
                    { exerciseId: "ex_ch_1", sets: 3, reps: "8 - 10", restSec: 90, rpe: 8, note: "بنش بار مستوي" },
                    { exerciseId: "ex_bk_1", sets: 3, reps: "8 - 10", restSec: 90, rpe: 8, note: "سحب ظهر عالي" },
                    { exerciseId: "ex_sh_1", sets: 3, reps: "10 - 12", restSec: 75, rpe: 8, note: "ضغط كتف بالدمبل" },
                    { exerciseId: "ex_arm_4", sets: 3, reps: "12 - 15", restSec: 60, rpe: 9, note: "تراي بالحبل" },
                    { exerciseId: "ex_ab_3", sets: 3, reps: "45 ثانية", restSec: 60, rpe: 8, note: "بلانك" }
                ]
            },
            {
                dayId: "fb_d2",
                title: "يوم الجسم الكامل (ب)",
                targetMuscles: "أفخاذ خلفية، ظهر، صدر علوي، أكتاف جانبية، باي",
                exercises: [
                    { exerciseId: "ex_lg_2", sets: 3, reps: "8 - 10", restSec: 90, rpe: 8, note: "ديدليفت روماني" },
                    { exerciseId: "ex_ch_3", sets: 3, reps: "8 - 10", restSec: 90, rpe: 8, note: "بنش دمبل مائل" },
                    { exerciseId: "ex_bk_3", sets: 3, reps: "8 - 10", restSec: 90, rpe: 8, note: "سحب بار منحني" },
                    { exerciseId: "ex_sh_3", sets: 4, reps: "12 - 15", restSec: 60, rpe: 9, note: "رفرفة جانبية" },
                    { exerciseId: "ex_arm_2", sets: 3, reps: "10 - 12", restSec: 60, rpe: 8, note: "بايسبس بالبار" },
                    { exerciseId: "ex_ab_1", sets: 3, reps: "12 - 15", restSec: 60, rpe: 8, note: "رفع أرجل معلق" }
                ]
            }
        ]
    }
];

// استرجاع برنامج بالمعرف
function getProgramById(progId) {
    return workoutProgramsDatabase.find(p => p.id === progId) || null;
}
