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
    },

    // =========================================================================
    // 8. برنامج التمارين المنزلية الكامل (بدون أجهزة جيم) - Home Workouts
    // =========================================================================
    {
        id: "prog_home",
        nameAr: "التمارين المنزلية (بدون أجهزة) — Home Full-Body",
        nameEn: "Home Workouts — No Gym Equipment (4 Days)",
        frequency: "4 Days / Week",
        level: "Beginner to Intermediate (Home)",
        description: "برنامج منزلي متكامل يعتمد على وزن الجسم أو أدوات بسيطة بالمنزل لبناء العضلات وحرق الدهون بدون حاجة للذهاب إلى النادي، مع كارديو منزلي وتوقيت متابعة يومي.",
        descriptionEn: "Complete home workout split using bodyweight or simple household items to build muscle and burn fat without needing a gym, paired with daily cardio timing tracking.",
        image: "https://fitnessprogramer.com/wp-content/uploads/2021/05/Bodyweight-Squat.gif",
        recommendedCardio: { defaultMinutes: 20, machines: ["ex_cardio_treadmill", "ex_cardio_cycle", "ex_cardio_elliptical"] },
        days: [
            {
                dayId: "home_d1",
                title: "DAY 1 — HOME UPPER BODY & CORE",
                targetMuscles: "Chest, Back, Triceps & Abs (At Home)",
                exercises: [
                    { exerciseId: "ex_hm_incline_pushup", displayNameEn: "Incline / Wall Push-Ups (Warm-Up)", sets: 3, reps: "15", restSec: 45 },
                    { exerciseId: "ex_hm_pushup", displayNameEn: "Home Push-Ups", sets: 4, reps: "12-15", restSec: 60 },
                    { exerciseId: "ex_hm_row", displayNameEn: "Single-Arm Home Row", sets: 4, reps: "12 / arm", restSec: 60 },
                    { exerciseId: "ex_hm_dips", displayNameEn: "Chair Triceps Dips", sets: 3, reps: "15", restSec: 45 },
                    { exerciseId: "ex_hm_superman", displayNameEn: "Superman Back Extension", sets: 3, reps: "15", restSec: 45 },
                    { exerciseId: "ex_hm_plank", displayNameEn: "Home Forearm Plank", sets: 3, reps: "45s", restSec: 45 }
                ]
            },
            {
                dayId: "home_d2",
                title: "DAY 2 — HOME LOWER BODY & GLUTES",
                targetMuscles: "Quads, Glutes, Hamstrings & Calves (At Home)",
                exercises: [
                    { exerciseId: "ex_hm_squat", displayNameEn: "Home Bodyweight Squat", sets: 4, reps: "20", restSec: 60 },
                    { exerciseId: "ex_hm_lunge", displayNameEn: "Home Alternating Lunges", sets: 4, reps: "14 / leg", restSec: 60 },
                    { exerciseId: "ex_hm_bridge", displayNameEn: "Floor Glute Bridge", sets: 4, reps: "20", restSec: 45 },
                    { exerciseId: "ex_hm_wallsit", displayNameEn: "Wall Sit Isometric Hold", sets: 3, reps: "45s", restSec: 60 },
                    { exerciseId: "ex_hm_calf", displayNameEn: "Stair Standing Calf Raise", sets: 4, reps: "20", restSec: 45 }
                ]
            },
            {
                dayId: "home_d3",
                title: "DAY 3 — HOME FAT-BURN & FULL BODY",
                targetMuscles: "Cardio Conditioning, Legs, Chest & Core",
                exercises: [
                    { exerciseId: "ex_hm_jacks", displayNameEn: "Home Jumping Jacks Cardio", sets: 4, reps: "45s", restSec: 30 },
                    { exerciseId: "ex_hm_squat", displayNameEn: "Home Bodyweight Squat", sets: 4, reps: "18", restSec: 45 },
                    { exerciseId: "ex_hm_pushup", displayNameEn: "Home Push-Ups", sets: 3, reps: "12-15", restSec: 45 },
                    { exerciseId: "ex_hm_lunge", displayNameEn: "Home Alternating Lunges", sets: 3, reps: "12 / leg", restSec: 45 },
                    { exerciseId: "ex_hm_plank", displayNameEn: "Home Forearm Plank", sets: 3, reps: "45-60s", restSec: 45 }
                ]
            },
            {
                dayId: "home_d4",
                title: "DAY 4 — HOME POSTURE, GLUTES & MOBILITY",
                targetMuscles: "Back Posture, Glutes, Core & Light Cardio",
                exercises: [
                    { exerciseId: "ex_hm_row", displayNameEn: "Single-Arm Home Row", sets: 4, reps: "15 / arm", restSec: 45 },
                    { exerciseId: "ex_hm_dips", displayNameEn: "Chair Triceps Dips", sets: 3, reps: "12-15", restSec: 45 },
                    { exerciseId: "ex_hm_bridge", displayNameEn: "Floor Glute Bridge", sets: 4, reps: "20", restSec: 45 },
                    { exerciseId: "ex_hm_superman", displayNameEn: "Superman Back Extension", sets: 3, reps: "15", restSec: 45 },
                    { exerciseId: "ex_cs_walking", displayNameEn: "Brisk Home/Outdoor Walk", sets: 1, reps: "20 min", restSec: 0 }
                ]
            }
        ]
    },

    // =========================================================================
    // 9. برنامج تأهيل ما بعد الولادة القيصرية (Post-C-Section Recovery)
    // =========================================================================
    {
        id: "prog_csection",
        nameAr: "تأهيل ما بعد الولادة القيصرية — Post-C-Section",
        nameEn: "Post-C-Section Safe Recovery (Phased)",
        frequency: "3–4 Days / Week (Gentle)",
        level: "Postpartum Safety Cleared (6–12+ Wks)",
        isPostpartumSafety: true,
        description: "برنامج تأهيل واستعادة لياقة متدرج خصيصاً لما بعد الولادة القيصرية: يبدأ بالتنفس البطني العميق، تقوية قاع الحوض، علاج الانفصال العضلي بلطف، ثم تقوية القوام والأرداف بدون ضغط أو كرانش عنيف على جرح البطن.",
        descriptionEn: "Phased postpartum C-section recovery plan: starts with 360° diaphragmatic breathing, pelvic floor rehab & gentle diastasis support before progressing to glute, posture & light cardio strength without abdominal strain.",
        image: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Diaphragmatic_breathing.gif?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
        recommendedCardio: { defaultMinutes: 15, machines: ["ex_cardio_treadmill", "ex_cardio_cycle", "ex_cardio_elliptical"] },
        days: [
            {
                dayId: "cs_phase1",
                title: "PHASE 1 — WEEKS 6–8+: BREATHING & DEEP CORE",
                targetMuscles: "Diaphragm, Pelvic Floor, Deep TVA (Zero Strain)",
                exercises: [
                    { exerciseId: "ex_cs_breathing", displayNameEn: "360° Diaphragmatic Breathing", sets: 3, reps: "8 breaths", restSec: 30 },
                    { exerciseId: "ex_cs_pelvic_floor", displayNameEn: "Postpartum Pelvic Floor (Kegel)", sets: 3, reps: "10 (3-5s)", restSec: 45 },
                    { exerciseId: "ex_cs_pelvic_tilt", displayNameEn: "Gentle Supine Pelvic Tilt", sets: 3, reps: "10", restSec: 45 },
                    { exerciseId: "ex_cs_walking", displayNameEn: "Gentle Postpartum Walk", sets: 1, reps: "10-15 min", restSec: 0 }
                ]
            },
            {
                dayId: "cs_phase2",
                title: "PHASE 2 — WEEKS 8–12+: MOBILITY & GLUTE REHAB",
                targetMuscles: "Glutes, Spine Mobility, Anti-Coning Core Control",
                exercises: [
                    { exerciseId: "ex_cs_breathing", displayNameEn: "360° Diaphragmatic Breathing", sets: 2, reps: "8 breaths", restSec: 30 },
                    { exerciseId: "ex_cs_cat_cow", displayNameEn: "Gentle Cat-Cow Spine Mobility", sets: 3, reps: "10", restSec: 45 },
                    { exerciseId: "ex_cs_dead_bug", displayNameEn: "Postpartum Heel Slides / Dead Bug", sets: 3, reps: "10 / leg", restSec: 45 },
                    { exerciseId: "ex_cs_bridge", displayNameEn: "Gentle Postpartum Glute Bridge", sets: 3, reps: "12-15", restSec: 45 },
                    { exerciseId: "ex_cs_walking", displayNameEn: "Progressive Postpartum Walk", sets: 1, reps: "15-20 min", restSec: 0 }
                ]
            },
            {
                dayId: "cs_phase3",
                title: "PHASE 3 — WEEKS 12+: POSTURE & SAFE STRENGTH",
                targetMuscles: "Upper Back Posture, Safe Chest, Balance & Cardio",
                exercises: [
                    { exerciseId: "ex_cs_bird_dog", displayNameEn: "Gentle Bird-Dog Core Stability", sets: 3, reps: "10 / side", restSec: 45 },
                    { exerciseId: "ex_cs_band_row", displayNameEn: "Seated Resistance Band Row", sets: 3, reps: "15", restSec: 45 },
                    { exerciseId: "ex_cs_wall_pushup", displayNameEn: "C-Section Safe Wall Push-Up", sets: 3, reps: "12", restSec: 45 },
                    { exerciseId: "ex_cs_bridge", displayNameEn: "Gentle Postpartum Glute Bridge", sets: 3, reps: "15", restSec: 45 },
                    { exerciseId: "ex_cs_walking", displayNameEn: "Steady Postpartum Walk / Cycle", sets: 1, reps: "20-25 min", restSec: 0 }
                ]
            }
        ]
    }
];

// بيانات أجهزة الكارديو الثلاثة المعتمدة للتقييم اليومي (السير + السايكل + الأوبتكال)
const CARDIO_MACHINES_CATALOG = [
    {
        key: "treadmill",
        exerciseId: "ex_cardio_treadmill",
        icon: "🏃",
        nameAr: "السير الكهربائي",
        nameEn: "Treadmill",
        badgeAr: "حرق عالي • ميلان وسرعة",
        badgeEn: "High Burn • Incline & Speed",
        defaultMinutes: 20,
        targetHintAr: "مثال: سرعة 5.5 • ميلان 8% • 20 دقيقة",
        targetHintEn: "e.g., Speed 5.5 • Incline 8% • 20 min"
    },
    {
        key: "cycle",
        exerciseId: "ex_cardio_cycle",
        icon: "🚴",
        nameAr: "الدراجة الثابتة (السايكل)",
        nameEn: "Stationary Cycle",
        badgeAr: "آمن للركبة والمفاصل",
        badgeEn: "Joint & Knee Friendly",
        defaultMinutes: 20,
        targetHintAr: "مثال: مقاومة 7 • 80 RPM • 20 دقيقة",
        targetHintEn: "e.g., Resistance 7 • 80 RPM • 20 min"
    },
    {
        key: "elliptical",
        exerciseId: "ex_cardio_elliptical",
        icon: "⚡",
        nameAr: "جهاز الأوبتكال البيضاوي",
        nameEn: "Elliptical Trainer",
        badgeAr: "جسم كامل بدون صدمات",
        badgeEn: "Full-Body Low Impact",
        defaultMinutes: 20,
        targetHintAr: "مثال: مستوى 6 • حركة كاملة • 20 دقيقة",
        targetHintEn: "e.g., Level 6 • Full Stride • 20 min"
    }
];

// استرجاع برنامج بالمعرف
function getProgramById(progId) {
    return workoutProgramsDatabase.find(p => p.id === progId) || null;
}
