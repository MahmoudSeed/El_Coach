/**
 * IronCoach Pro - 6 Official Training Programs Matching Design Templates
 * البرامج التدريبية الـ 6 مطابقة حرفياً لصور التصميم المعتمدة (التمارين بالإنجليزية + عدد الجولات والتكرارات)
 */

const workoutProgramsDatabase = [
    // ==========================================================
    // 1. Push / Pull / Legs — Cutting & Weight Loss (4 × 20)
    // ==========================================================
    {
        id: "prog_ppl",
        nameAr: "Push / Pull / Legs (تنشيف وخسارة الوزن 4×20)",
        nameEn: "Push / Pull / Legs — Cutting & Fat Loss (4×20)",
        frequency: "8-Day Training Cycle (3 Days On • 1 Day Off)",
        level: "Cutting & Weight Loss • 4 × 20",
        description: "Cutting & Weight Loss Edition (4 Sets × 20 Reps) — Day 1: Push | Day 2: Pull | Day 3: Legs | Day 4: Rest | Day 5: Push | Day 6: Pull | Day 7: Legs | Day 8: Rest — Rest Between Sets: 60 sec.",
        image: "Training Programs/Push_pull_legs.png",
        days: [
            {
                dayId: "ppl_d1",
                title: "PUSH (Days 1 & 5)",
                targetMuscles: "Chest, Shoulders, Triceps",
                exercises: [
                    { exerciseId: "ex_ch_5", displayNameEn: "Chest Press", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_ch_7", displayNameEn: "Incline Chest Press", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_sh_3", displayNameEn: "Lateral Raise", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_sh_8", displayNameEn: "Front Raise", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_arm_15", displayNameEn: "Triceps Machine", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_arm_14", displayNameEn: "Overhead Triceps Extension", sets: 4, reps: "20", restSec: 60 }
                ]
            },
            {
                dayId: "ppl_d2",
                title: "PULL (Days 2 & 6)",
                targetMuscles: "Back, Rear Delts, Biceps",
                exercises: [
                    { exerciseId: "ex_bk_1", displayNameEn: "Lat Pulldown", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_bk_4", displayNameEn: "Seated Row", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_bk_8", displayNameEn: "Low Row", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_sh_6", displayNameEn: "Reverse Pec Deck", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_arm_7", displayNameEn: "Dumbbell Curl", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_arm_8", displayNameEn: "Cable Curl", sets: 4, reps: "20", restSec: 60 }
                ]
            },
            {
                dayId: "ppl_d3",
                title: "LEGS (Days 3 & 7)",
                targetMuscles: "Quads, Hamstrings, Glutes, Calves",
                exercises: [
                    { exerciseId: "ex_lg_4", displayNameEn: "Leg Extension", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_lg_5", displayNameEn: "Lying Leg Curl", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_lg_3", displayNameEn: "Leg Press", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_lg_7", displayNameEn: "Seated Leg Curl", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_lg_9", displayNameEn: "Hip Thrust", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_lg_1", displayNameEn: "Squat", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_lg_11", displayNameEn: "Calf Raise", sets: 4, reps: "20", restSec: 60 }
                ]
            }
        ]
    },

    // ==========================================================
    // 1B. Push / Pull / Legs — Bulking & Hypertrophy (3 × 10)
    // ==========================================================
    {
        id: "prog_ppl_bulk",
        nameAr: "Push / Pull / Legs (تضخيم وبناء عضلات 3×10)",
        nameEn: "Push / Pull / Legs — Bulking & Hypertrophy (3×10)",
        frequency: "8-Day Training Cycle (3 Days On • 1 Day Off)",
        level: "Bulking & Hypertrophy • 3 × 10",
        description: "Bulking & Muscle Building Edition (3 Sets × 10 Reps) — Same PPL Exercises | Day 1: Push | Day 2: Pull | Day 3: Legs | Day 4: Rest | Day 5: Push | Day 6: Pull | Day 7: Legs | Day 8: Rest — Rest: 60 sec.",
        image: "Training Programs/Push_pull_legs.png",
        days: [
            {
                dayId: "ppl_bulk_d1",
                title: "PUSH — BULKING (Days 1 & 5)",
                targetMuscles: "Chest, Shoulders, Triceps",
                exercises: [
                    { exerciseId: "ex_ch_5", displayNameEn: "Chest Press", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_ch_7", displayNameEn: "Incline Chest Press", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_sh_3", displayNameEn: "Lateral Raise", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_sh_8", displayNameEn: "Front Raise", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_arm_15", displayNameEn: "Triceps Machine", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_arm_14", displayNameEn: "Overhead Triceps Extension", sets: 3, reps: "10", restSec: 60 }
                ]
            },
            {
                dayId: "ppl_bulk_d2",
                title: "PULL — BULKING (Days 2 & 6)",
                targetMuscles: "Back, Rear Delts, Biceps",
                exercises: [
                    { exerciseId: "ex_bk_1", displayNameEn: "Lat Pulldown", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_bk_4", displayNameEn: "Seated Row", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_bk_8", displayNameEn: "Low Row", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_sh_6", displayNameEn: "Reverse Pec Deck", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_arm_7", displayNameEn: "Dumbbell Curl", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_arm_8", displayNameEn: "Cable Curl", sets: 3, reps: "10", restSec: 60 }
                ]
            },
            {
                dayId: "ppl_bulk_d3",
                title: "LEGS — BULKING (Days 3 & 7)",
                targetMuscles: "Quads, Hamstrings, Glutes, Calves",
                exercises: [
                    { exerciseId: "ex_lg_4", displayNameEn: "Leg Extension", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_lg_5", displayNameEn: "Lying Leg Curl", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_lg_3", displayNameEn: "Leg Press", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_lg_7", displayNameEn: "Seated Leg Curl", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_lg_9", displayNameEn: "Hip Thrust", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_lg_1", displayNameEn: "Squat", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_lg_11", displayNameEn: "Calf Raise", sets: 3, reps: "10", restSec: 60 }
                ]
            }
        ]
    },

    // ==========================================================
    // 2. Upper / Lower Split (Training Programs/Upper_Lower.jpeg)
    // ==========================================================
    {
        id: "prog_upper_lower",
        nameAr: "Upper / Lower Split",
        nameEn: "Upper / Lower Split",
        frequency: "8-Day Training Cycle (Upper, Lower, Cardio 60 Min, Rest)",
        level: "Standard Template (Supersets)",
        description: "Supersets: Perform exercise 1 then exercise 2 with no rest. Rest 30 sec after each pair. Repeat for 4 rounds. Warm-up 10 min + Post-workout Cardio 30 min LISS.",
        image: "Training Programs/Upper_Lower.jpeg",
        days: [
            {
                dayId: "ul_d1",
                title: "UPPER (Days 1 & 5)",
                targetMuscles: "Chest, Back, Shoulders, Arms (Supersets A-D)",
                exercises: [
                    { exerciseId: "ex_ch_5", pair: "A1", displayNameEn: "Chest Press Machine", sets: 4, reps: "15", restSec: 30 },
                    { exerciseId: "ex_ch_8", pair: "A2", displayNameEn: "Fly Machine", sets: 4, reps: "15", restSec: 30 },
                    { exerciseId: "ex_bk_1", pair: "B1", displayNameEn: "Lat Pulldown", sets: 4, reps: "15", restSec: 30 },
                    { exerciseId: "ex_bk_4", pair: "B2", displayNameEn: "Seated Row Machine", sets: 4, reps: "15", restSec: 30 },
                    { exerciseId: "ex_sh_7", pair: "C1", displayNameEn: "Shoulder Press Machine", sets: 4, reps: "15", restSec: 30 },
                    { exerciseId: "ex_sh_3", pair: "C2", displayNameEn: "Dumbbell Lateral Raise", sets: 4, reps: "15", restSec: 30 },
                    { exerciseId: "ex_arm_10", pair: "D1", displayNameEn: "Biceps Curl Machine", sets: 4, reps: "15", restSec: 30 },
                    { exerciseId: "ex_arm_15", pair: "D2", displayNameEn: "Triceps Extension Machine", sets: 4, reps: "15", restSec: 30 }
                ]
            },
            {
                dayId: "ul_d2",
                title: "LOWER (Days 2 & 6)",
                targetMuscles: "Quads, Hamstrings, Glutes, Calves (Supersets A-C)",
                exercises: [
                    { exerciseId: "ex_lg_4", pair: "A1", displayNameEn: "Leg Extension", sets: 4, reps: "15", restSec: 30 },
                    { exerciseId: "ex_lg_7", pair: "A2", displayNameEn: "Seated Leg Curl", sets: 4, reps: "15", restSec: 30 },
                    { exerciseId: "ex_lg_3", pair: "B1", displayNameEn: "Leg Press Machine", sets: 4, reps: "15", restSec: 30 },
                    { exerciseId: "ex_lg_9", pair: "B2", displayNameEn: "Hip Thrust Machine", sets: 4, reps: "15", restSec: 30 },
                    { exerciseId: "ex_lg_11", pair: "C1", displayNameEn: "Standing Calf Machine", sets: 4, reps: "15", restSec: 30 },
                    { exerciseId: "ex_lg_12", pair: "C2", displayNameEn: "Seated Calf Machine", sets: 4, reps: "15", restSec: 30 }
                ]
            }
        ]
    },

    // ==========================================================
    // 3. Arnold Split (Training Programs/Arnold_Split.png)
    // ==========================================================
    {
        id: "prog_arnold",
        nameAr: "Arnold Split",
        nameEn: "Arnold Split",
        frequency: "8-Day Training Cycle (3 Days On / 1 Day Off)",
        level: "Upper Body: 3 × 10 • Legs: 4 × 20",
        description: "Days 1 & 5: Chest & Back | Days 2 & 6: Shoulders & Arms | Days 3 & 7: Legs | Days 4 & 8: Rest — Repeat the Cycle.",
        image: "Training Programs/Arnold_Split.png",
        days: [
            {
                dayId: "arn_d1",
                title: "CHEST & BACK (Days 1 & 5)",
                targetMuscles: "Chest & Back",
                exercises: [
                    { exerciseId: "ex_ch_5", displayNameEn: "Chest Press Machine", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_ch_7", displayNameEn: "Incline Chest Press Machine", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_ch_8", displayNameEn: "Fly", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_bk_1", displayNameEn: "Lat Pulldown", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_bk_4", displayNameEn: "Seated Row", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_bk_8", displayNameEn: "Low Row", sets: 3, reps: "10", restSec: 60 }
                ]
            },
            {
                dayId: "arn_d2",
                title: "SHOULDERS & ARMS (Days 2 & 6)",
                targetMuscles: "Shoulders, Biceps, Triceps",
                exercises: [
                    { exerciseId: "ex_sh_4", displayNameEn: "Cable Lateral Raise", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_sh_9", displayNameEn: "Cable Front Raise", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_sh_6", displayNameEn: "Reverse Fly", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_arm_7", displayNameEn: "Dumbbell Curl", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_arm_11", displayNameEn: "Machine Preacher Curl", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_arm_4", displayNameEn: "Rope Triceps Pushdown", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_arm_14", displayNameEn: "Overhead Rope Triceps Extension", sets: 3, reps: "10", restSec: 60 }
                ]
            },
            {
                dayId: "arn_d3",
                title: "LEGS (Days 3 & 7)",
                targetMuscles: "Quads, Hamstrings, Glutes, Calves",
                exercises: [
                    { exerciseId: "ex_lg_8", displayNameEn: "Lunges", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_lg_4", displayNameEn: "Leg Extension", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_lg_3", displayNameEn: "Leg Press", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_lg_5", displayNameEn: "Leg Curl", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_lg_10", displayNameEn: "Glute Kickback", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_lg_11", displayNameEn: "Calf Raise", sets: 4, reps: "20", restSec: 60 }
                ]
            }
        ]
    },

    // ==========================================================
    // 4. Bro Split (Training Programs/Bro_Split.png)
    // ==========================================================
    {
        id: "prog_bro",
        nameAr: "Bro Split",
        nameEn: "Bro Split",
        frequency: "8-Day Training Cycle (3 Days On / 1 Day Off)",
        level: "Upper: 3 × 10 • Legs: 4 × 20",
        description: "Day 1: Chest & Triceps | Day 2: Back & Biceps | Day 3: Quads & Calves | Day 4: Rest | Day 5: Shoulders | Day 6: Biceps & Triceps | Day 7: Hamstrings & Glutes | Day 8: Rest.",
        image: "Training Programs/Bro_Split.png",
        days: [
            {
                dayId: "bro_d1",
                title: "DAY 1 — CHEST & TRICEPS",
                targetMuscles: "Chest & Triceps",
                exercises: [
                    { exerciseId: "ex_ch_3", displayNameEn: "Incline Dumbbell Press", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_ch_2", displayNameEn: "Flat Dumbbell Press", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_ch_8", displayNameEn: "Fly", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_ch_7", displayNameEn: "Incline Chest Press Machine", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_ch_5", displayNameEn: "Chest Press Machine", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_arm_4", displayNameEn: "Rope Triceps Pushdown", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_arm_14", displayNameEn: "Overhead Rope Triceps Extension", sets: 3, reps: "10", restSec: 60 }
                ]
            },
            {
                dayId: "bro_d2",
                title: "DAY 2 — BACK & BICEPS",
                targetMuscles: "Back & Biceps",
                exercises: [
                    { exerciseId: "ex_bk_1", displayNameEn: "Lat Pulldown", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_bk_4", displayNameEn: "Seated Row", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_bk_7", displayNameEn: "Close-Grip Lat Pulldown", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_bk_8", displayNameEn: "Low Row", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_bk_9", displayNameEn: "T-Bar Row", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_bk_10", displayNameEn: "Back Extension", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_arm_7", displayNameEn: "Dumbbell Curl", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_arm_11", displayNameEn: "Machine Preacher Curl", sets: 3, reps: "10", restSec: 60 }
                ]
            },
            {
                dayId: "bro_d3",
                title: "DAY 3 — QUADS & CALVES",
                targetMuscles: "Quads & Calves",
                exercises: [
                    { exerciseId: "ex_lg_8", displayNameEn: "Lunges", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_lg_4", displayNameEn: "Leg Extension", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_lg_3", displayNameEn: "Leg Press", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_lg_11", displayNameEn: "Calf Raise", sets: 4, reps: "20", restSec: 60 }
                ]
            },
            {
                dayId: "bro_d5",
                title: "DAY 5 — SHOULDERS",
                targetMuscles: "Front, Lateral & Rear Shoulders",
                exercises: [
                    { exerciseId: "ex_sh_4", displayNameEn: "Cable Lateral Raise", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_sh_9", displayNameEn: "Cable Front Raise", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_sh_10", displayNameEn: "Rear Delt Row", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_sh_3", displayNameEn: "Dumbbell Lateral Raise", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_sh_8", displayNameEn: "Dumbbell Front Raise", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_sh_6", displayNameEn: "Reverse Fly", sets: 3, reps: "10", restSec: 60 }
                ]
            },
            {
                dayId: "bro_d6",
                title: "DAY 6 — BICEPS & TRICEPS",
                targetMuscles: "Biceps & Triceps",
                exercises: [
                    { exerciseId: "ex_arm_8", displayNameEn: "Straight Bar Cable Curl", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_arm_13", displayNameEn: "Straight Bar Triceps Pushdown", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_arm_12", displayNameEn: "Cable Rope Hammer Curl", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_arm_4", displayNameEn: "Rope Triceps Pushdown", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_arm_10", displayNameEn: "Machine Biceps Curl", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_arm_15", displayNameEn: "Machine Triceps Extension", sets: 3, reps: "10", restSec: 60 }
                ]
            },
            {
                dayId: "bro_d7",
                title: "DAY 7 — HAMSTRINGS & GLUTES",
                targetMuscles: "Hamstrings, Glutes, Calves",
                exercises: [
                    { exerciseId: "ex_lg_5", displayNameEn: "Leg Curl", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_lg_10", displayNameEn: "Glute Kickback", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_lg_3", displayNameEn: "Leg Press", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_lg_11", displayNameEn: "Calf Raise", sets: 4, reps: "20", restSec: 60 }
                ]
            }
        ]
    },

    // ==========================================================
    // 5. Anterior / Posterior (Training Programs/Anterior_Posterior.png)
    // ==========================================================
    {
        id: "prog_anterior_posterior",
        nameAr: "Anterior / Posterior",
        nameEn: "Anterior / Posterior",
        frequency: "8-Day Training Cycle (Anterior, Posterior, Cardio 60 Min, Rest)",
        level: "Standard Template • 4 × 15",
        description: "Days 1 & 5: Anterior | Days 2 & 6: Posterior | Days 3 & 7: Cardio 60 Min | Days 4 & 8: Rest. Warm-up 10 min + Post-workout Cardio 30 min LISS.",
        image: "Training Programs/Anterior_Posterior.png",
        days: [
            {
                dayId: "ap_d1",
                title: "ANTERIOR (Days 1 & 5)",
                targetMuscles: "Chest, Shoulders, Biceps, Quads",
                exercises: [
                    { exerciseId: "ex_ch_5", displayNameEn: "Chest Press Machine", sets: 4, reps: "15", restSec: 60 },
                    { exerciseId: "ex_ch_8", displayNameEn: "Fly Machine", sets: 4, reps: "15", restSec: 60 },
                    { exerciseId: "ex_sh_7", displayNameEn: "Shoulder Press Machine", sets: 4, reps: "15", restSec: 60 },
                    { exerciseId: "ex_sh_3", displayNameEn: "Dumbbell Lateral Raise", sets: 4, reps: "15", restSec: 60 },
                    { exerciseId: "ex_arm_10", displayNameEn: "Biceps Curl Machine", sets: 4, reps: "15", restSec: 60 },
                    { exerciseId: "ex_arm_9", displayNameEn: "Barbell Curl", sets: 4, reps: "15", restSec: 60 },
                    { exerciseId: "ex_lg_3", displayNameEn: "Leg Press Machine", sets: 4, reps: "15", restSec: 60 },
                    { exerciseId: "ex_lg_4", displayNameEn: "Leg Extension", sets: 4, reps: "15", restSec: 60 }
                ]
            },
            {
                dayId: "ap_d2",
                title: "POSTERIOR (Days 2 & 6)",
                targetMuscles: "Back, Rear Delts, Triceps, Hamstrings, Glutes, Calves",
                exercises: [
                    { exerciseId: "ex_bk_1", displayNameEn: "Lat Pulldown", sets: 4, reps: "15", restSec: 60 },
                    { exerciseId: "ex_bk_4", displayNameEn: "Seated Row Machine", sets: 4, reps: "15", restSec: 60 },
                    { exerciseId: "ex_sh_6", displayNameEn: "Reverse Pec Deck", sets: 4, reps: "15", restSec: 60 },
                    { exerciseId: "ex_arm_15", displayNameEn: "Triceps Extension Machine", sets: 4, reps: "15", restSec: 60 },
                    { exerciseId: "ex_arm_4", displayNameEn: "Rope Triceps Pushdown", sets: 4, reps: "15", restSec: 60 },
                    { exerciseId: "ex_lg_7", displayNameEn: "Seated Leg Curl", sets: 4, reps: "15", restSec: 60 },
                    { exerciseId: "ex_lg_9", displayNameEn: "Hip Thrust Machine", sets: 4, reps: "15", restSec: 60 },
                    { exerciseId: "ex_lg_11", displayNameEn: "Standing Calf Machine", sets: 4, reps: "15", restSec: 60 }
                ]
            }
        ]
    },

    // ==========================================================
    // 6. PPL × Upper / Lower (Training Programs/PPL×Upper_ Lower.png)
    // ==========================================================
    {
        id: "prog_ppl_upper_lower",
        nameAr: "PPL × Upper / Lower",
        nameEn: "PPL × Upper / Lower",
        frequency: "5 Training Days • 7-Day Cycle",
        level: "Upper Body: 3 × 10 • Legs: 4 × 20",
        description: "Day 1: Push | Day 2: Pull | Day 3: Legs | Day 4: Rest | Day 5: Upper | Day 6: Lower | Day 7: Rest — Repeat Weekly.",
        image: "Training Programs/PPL×Upper_ Lower.png",
        days: [
            {
                dayId: "pplul_d1",
                title: "DAY 1 — PUSH",
                targetMuscles: "Chest, Lateral Delts, Triceps",
                exercises: [
                    { exerciseId: "ex_ch_5", displayNameEn: "Chest Press Machine", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_ch_7", displayNameEn: "Incline Chest Press Machine", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_ch_8", displayNameEn: "Fly", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_sh_3", displayNameEn: "Dumbbell Lateral Raise", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_arm_4", displayNameEn: "Rope Triceps Pushdown", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_arm_14", displayNameEn: "Overhead Rope Triceps Extension", sets: 3, reps: "10", restSec: 60 }
                ]
            },
            {
                dayId: "pplul_d2",
                title: "DAY 2 — PULL",
                targetMuscles: "Back, Rear Delts, Biceps",
                exercises: [
                    { exerciseId: "ex_bk_1", displayNameEn: "Lat Pulldown", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_bk_4", displayNameEn: "Seated Row", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_bk_8", displayNameEn: "Low Row", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_sh_6", displayNameEn: "Reverse Pec Deck", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_arm_7", displayNameEn: "Dumbbell Curl", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_arm_8", displayNameEn: "Cable Curl", sets: 3, reps: "10", restSec: 60 }
                ]
            },
            {
                dayId: "pplul_d3",
                title: "DAY 3 — LEGS",
                targetMuscles: "Quads, Hamstrings, Glutes, Calves",
                exercises: [
                    { exerciseId: "ex_lg_8", displayNameEn: "Lunges", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_lg_4", displayNameEn: "Leg Extension", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_lg_3", displayNameEn: "Leg Press", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_lg_7", displayNameEn: "Seated Leg Curl", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_lg_9", displayNameEn: "Hip Thrust Machine", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_lg_11", displayNameEn: "Calf Raise", sets: 4, reps: "20", restSec: 60 }
                ]
            },
            {
                dayId: "pplul_d5",
                title: "DAY 5 — UPPER",
                targetMuscles: "Chest, Back, Shoulders, Arms",
                exercises: [
                    { exerciseId: "ex_ch_5", displayNameEn: "Chest Press Machine", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_bk_1", displayNameEn: "Lat Pulldown", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_bk_4", displayNameEn: "Seated Row", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_sh_7", displayNameEn: "Shoulder Press Machine", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_sh_3", displayNameEn: "Dumbbell Lateral Raise", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_arm_10", displayNameEn: "Biceps Curl Machine", sets: 3, reps: "10", restSec: 60 },
                    { exerciseId: "ex_arm_4", displayNameEn: "Rope Triceps Pushdown", sets: 3, reps: "10", restSec: 60 }
                ]
            },
            {
                dayId: "pplul_d6",
                title: "DAY 6 — LOWER",
                targetMuscles: "Quads, Hamstrings, Glutes, Calves",
                exercises: [
                    { exerciseId: "ex_lg_3", displayNameEn: "Leg Press", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_lg_4", displayNameEn: "Leg Extension", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_lg_5", displayNameEn: "Leg Curl", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_lg_9", displayNameEn: "Hip Thrust Machine", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_lg_10", displayNameEn: "Glute Kickback", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_lg_11", displayNameEn: "Calf Raise", sets: 4, reps: "20", restSec: 60 }
                ]
            }
        ]
    }
];

// استرجاع برنامج بالمعرف
function getProgramById(progId) {
    return workoutProgramsDatabase.find(p => p.id === progId) || null;
}
