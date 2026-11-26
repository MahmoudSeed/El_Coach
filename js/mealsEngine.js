/**
 * IronCoach Pro - Meals & Custom Smart Diet Generator Engine
 * محرك البحث والفلترة + مصمم الوجبات الذكي المخصص بالمكونات والأوزان الدقيقة حسب السعرات المستهدفة
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

    // قاعدة القيم الغذائية القياسية لتصميم وجبات ذكية مخصصة خارج المكتبة بأوزان جرامات حقيقية دقيقة
    CHEF_FOODS: {
        chicken:        { p: 0.295, c: 0.000, f: 0.035, ar: "صدور دجاج مشوية", en: "Grilled chicken breast", unitAr: "ج", unitEn: "g" },
        beef_lean:      { p: 0.265, c: 0.000, f: 0.070, ar: "ستيك بقري صافي مشوي", en: "Grilled lean beef steak", unitAr: "ج", unitEn: "g" },
        salmon:         { p: 0.220, c: 0.000, f: 0.125, ar: "فيليه سلمون مشوي", en: "Grilled salmon fillet", unitAr: "ج", unitEn: "g" },
        white_fish:     { p: 0.225, c: 0.000, f: 0.015, ar: "فيليه سمك أبيض مشوي", en: "Grilled white fish fillet", unitAr: "ج", unitEn: "g" },
        shrimp:         { p: 0.240, c: 0.002, f: 0.012, ar: "روبيان (جمبري) مشوي", en: "Grilled peeled shrimp", unitAr: "ج", unitEn: "g" },
        tuna:           { p: 0.255, c: 0.000, f: 0.010, ar: "تونة مصفاة بالماء", en: "Water-drained tuna", unitAr: "ج", unitEn: "g" },
        turkey:         { p: 0.220, c: 0.020, f: 0.020, ar: "شرائح ديك رومي مدخن", en: "Smoked turkey slices", unitAr: "ج", unitEn: "g" },
        egg_whole:      { p: 0.126, c: 0.007, f: 0.095, ar: "بيض كامل", en: "Whole eggs", unitAr: "ج", unitEn: "g" },
        egg_white:      { p: 0.109, c: 0.007, f: 0.002, ar: "بياض بيض", en: "Egg whites", unitAr: "ج", unitEn: "g" },
        greek_yogurt:   { p: 0.100, c: 0.040, f: 0.020, ar: "زبادي يوناني لايت", en: "Light Greek yogurt", unitAr: "ج", unitEn: "g" },
        cottage:        { p: 0.125, c: 0.034, f: 0.023, ar: "جبن قريش خفيف", en: "Low-fat cottage cheese", unitAr: "ج", unitEn: "g" },
        halloumi:       { p: 0.230, c: 0.025, f: 0.170, ar: "جبن حلوم لايت مشوي", en: "Grilled light halloumi", unitAr: "ج", unitEn: "g" },
        whey:           { p: 0.800, c: 0.060, f: 0.040, ar: "واي بروتين", en: "Whey protein", unitAr: "ج", unitEn: "g" },

        rice:           { p: 0.027, c: 0.280, f: 0.003, ar: "أرز بسمتي مطبوخ", en: "Cooked basmati rice", unitAr: "ج", unitEn: "g" },
        brown_rice:     { p: 0.026, c: 0.230, f: 0.009, ar: "أرز بني مطبوخ", en: "Cooked brown rice", unitAr: "ج", unitEn: "g" },
        potato:         { p: 0.020, c: 0.200, f: 0.001, ar: "بطاطس مسلوقة/بالفرن", en: "Boiled/baked potatoes", unitAr: "ج", unitEn: "g" },
        sweet_potato:   { p: 0.020, c: 0.210, f: 0.001, ar: "بطاطا حلوة مشوية", en: "Roasted sweet potato", unitAr: "ج", unitEn: "g" },
        quinoa:         { p: 0.044, c: 0.213, f: 0.019, ar: "كينوا مطبوخة", en: "Cooked quinoa", unitAr: "ج", unitEn: "g" },
        pasta_dry:      { p: 0.130, c: 0.710, f: 0.020, ar: "مكرونة قمح كامل (قبل السلق)", en: "Dry whole-wheat pasta", unitAr: "ج", unitEn: "g" },
        oats:           { p: 0.132, c: 0.677, f: 0.065, ar: "شوفان حبوب كاملة", en: "Rolled oats", unitAr: "ج", unitEn: "g" },
        bread_wheat:    { p: 0.105, c: 0.430, f: 0.035, ar: "خبز بر أسمر", en: "Whole-wheat bread", unitAr: "ج", unitEn: "g" },
        tortilla:       { p: 0.085, c: 0.460, f: 0.065, ar: "خبز تورتيلا بر", en: "Whole-wheat tortilla", unitAr: "ج", unitEn: "g" },
        lentils:        { p: 0.090, c: 0.201, f: 0.004, ar: "عدس مطبوخ", en: "Cooked lentils", unitAr: "ج", unitEn: "g" },
        chickpeas:      { p: 0.089, c: 0.274, f: 0.026, ar: "حمص مسلوق", en: "Boiled chickpeas", unitAr: "ج", unitEn: "g" },
        banana:         { p: 0.011, c: 0.228, f: 0.003, ar: "موز ناضج", en: "Ripe banana", unitAr: "ج", unitEn: "g" },
        dates:          { p: 0.024, c: 0.750, f: 0.004, ar: "تمر منزوع النوى", en: "Pitted dates", unitAr: "ج", unitEn: "g" },
        berries:        { p: 0.010, c: 0.120, f: 0.003, ar: "توت وفراولة طازجة", en: "Fresh berries & strawberries", unitAr: "ج", unitEn: "g" },
        apple:          { p: 0.003, c: 0.138, f: 0.002, ar: "تفاح مقطع", en: "Sliced apple", unitAr: "ج", unitEn: "g" },
        skim_milk:      { p: 0.034, c: 0.050, f: 0.002, ar: "حليب خالي الدسم", en: "Skim milk", unitAr: "مل", unitEn: "ml" },
        honey:          { p: 0.003, c: 0.824, f: 0.000, ar: "عسل نحل طبيعي", en: "Natural honey", unitAr: "ج", unitEn: "g" },

        olive_oil:      { p: 0.000, c: 0.000, f: 1.000, ar: "زيت زيتون بكر", en: "Extra-virgin olive oil", unitAr: "ج", unitEn: "g" },
        peanut_butter:  { p: 0.250, c: 0.200, f: 0.500, ar: "زبدة فول سوداني طبيعية", en: "Natural peanut butter", unitAr: "ج", unitEn: "g" },
        almond_butter:  { p: 0.210, c: 0.188, f: 0.555, ar: "زبدة اللوز الطبيعية", en: "Natural almond butter", unitAr: "ج", unitEn: "g" },
        avocado:        { p: 0.020, c: 0.085, f: 0.147, ar: "أفوكادو طازج", en: "Fresh avocado", unitAr: "ج", unitEn: "g" },
        almonds:        { p: 0.212, c: 0.216, f: 0.499, ar: "لوز نيء/محمص", en: "Raw/roasted almonds", unitAr: "ج", unitEn: "g" },
        walnuts:        { p: 0.152, c: 0.137, f: 0.652, ar: "جوز (عين جمل)", en: "Walnuts", unitAr: "ج", unitEn: "g" },
        tahini:         { p: 0.170, c: 0.210, f: 0.538, ar: "طحينة سمسم", en: "Sesame tahini", unitAr: "ج", unitEn: "g" },
        chia:           { p: 0.165, c: 0.420, f: 0.307, ar: "بذور الشيا", en: "Chia seeds", unitAr: "ج", unitEn: "g" },

        veggies_green:  { p: 0.020, c: 0.045, f: 0.002, ar: "خضار طازجة (بروكلي/خس/خيار)", en: "Fresh greens (broccoli/lettuce/cucumber)", unitAr: "ج", unitEn: "g" },
        veggies_tomato: { p: 0.010, c: 0.045, f: 0.002, ar: "طماطم وبصل وفلفل", en: "Tomato, onion & pepper", unitAr: "ج", unitEn: "g" }
    },

    // قوالب الوجبات المخصصة المصممة خارج المكتبة مع صور مطابقة 100%
    CHEF_BLUEPRINTS: {
        breakfast: [
            {
                code: "chef_b_oats_whey",
                nameAr: "وعاء الشوفان الرياضي بالبروتين والموز وزبدة الفول السوداني",
                nameEn: "Chef Pro Oats with Whey, Banana & Peanut Butter",
                img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Oatmeal.jpg/960px-Oatmeal.jpg",
                pFood: "whey", pMin: 20, pMax: 45, pStep: 5,
                cFood: "oats", cMin: 30, cMax: 120, cStep: 5,
                fFood: "peanut_butter", fMin: 5, fMax: 30, fStep: 5,
                extras: [{ key: "skim_milk", grams: 180 }, { key: "banana", grams: 70 }]
            },
            {
                code: "chef_b_shakshuka",
                nameAr: "شكشوكة بروتينية بالبيض وبياض البيض مع الخبز الأسمر",
                nameEn: "High-Protein Olive-Oil Shakshuka & Brown Pita",
                img: "https://www.themealdb.com/images/media/meals/g373701551450225.jpg",
                pFood: "egg_whole", pMin: 100, pMax: 200, pStep: 50,
                cFood: "bread_wheat", cMin: 30, cMax: 120, cStep: 10,
                fFood: "olive_oil", fMin: 3, fMax: 14, fStep: 1,
                extras: [{ key: "egg_white", grams: 90 }, { key: "veggies_tomato", grams: 140 }]
            },
            {
                code: "chef_b_omelette",
                nameAr: "أومليت السبانخ والبيض بالجبن القريش والتوست البر",
                nameEn: "Spinach Omelette with Cottage Cheese & Whole-Wheat Toast",
                img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b1/FoodOmelete.jpg/960px-FoodOmelete.jpg",
                pFood: "egg_whole", pMin: 100, pMax: 200, pStep: 50,
                cFood: "bread_wheat", cMin: 30, cMax: 120, cStep: 10,
                fFood: "olive_oil", fMin: 3, fMax: 14, fStep: 1,
                extras: [{ key: "cottage", grams: 80 }, { key: "veggies_green", grams: 60 }]
            },
            {
                code: "chef_b_pancake",
                nameAr: "بان كيك الشوفان والواي بروتين بالموز والعسل",
                nameEn: "Custom Protein Oat Pancakes with Banana & Honey",
                img: "https://www.themealdb.com/images/media/meals/c400ok1764439058.jpg",
                pFood: "whey", pMin: 20, pMax: 45, pStep: 5,
                cFood: "oats", cMin: 35, cMax: 110, cStep: 5,
                fFood: "almonds", fMin: 5, fMax: 25, fStep: 5,
                extras: [{ key: "egg_white", grams: 100 }, { key: "banana", grams: 60 }]
            },
            {
                code: "chef_b_avotoast",
                nameAr: "توست الأفوكادو بالبيض المسلوق والخبز البر",
                nameEn: "Avocado Whole-Wheat Toast with Boiled Eggs",
                img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5b/Avocado_toast_at_Voyager_Espresso_%2833134505776%29.jpg/960px-Avocado_toast_at_Voyager_Espresso_%2833134505776%29.jpg",
                pFood: "egg_whole", pMin: 100, pMax: 200, pStep: 50,
                cFood: "bread_wheat", cMin: 40, cMax: 130, cStep: 10,
                fFood: "avocado", fMin: 30, fMax: 100, fStep: 10,
                extras: [{ key: "egg_white", grams: 60 }]
            },
            {
                code: "chef_b_yogurt_bowl",
                nameAr: "طبق الزبادي اليوناني بالشوفان والتوت واللوز والعسل",
                nameEn: "Greek Yogurt Oats Bowl with Berries, Honey & Almonds",
                img: "https://upload.wikimedia.org/wikipedia/commons/9/94/Granola%2C_yogurt%2C_fruit._%2816696981528%29.jpg",
                pFood: "greek_yogurt", pMin: 150, pMax: 300, pStep: 25,
                cFood: "oats", cMin: 25, cMax: 95, cStep: 5,
                fFood: "almonds", fMin: 5, fMax: 30, fStep: 5,
                extras: [{ key: "berries", grams: 60 }, { key: "honey", grams: 10 }]
            }
        ],
        lunch: [
            {
                code: "chef_l_chicken_rice",
                nameAr: "صدور دجاج مشوية مع الأرز البسمتي والبروكلي وزيت الزيتون",
                nameEn: "Custom Grilled Chicken Breast, Basmati Rice & Broccoli",
                img: "https://www.themealdb.com/images/media/meals/nlxald1764112200.jpg",
                pFood: "chicken", pMin: 120, pMax: 280, pStep: 10,
                cFood: "rice", cMin: 80, cMax: 360, cStep: 10,
                fFood: "olive_oil", fMin: 3, fMax: 18, fStep: 1,
                extras: [{ key: "veggies_green", grams: 120 }]
            },
            {
                code: "chef_l_salmon_potato",
                nameAr: "فيليه سلمون مشوي بالأعشاب مع البطاطس والخضار",
                nameEn: "Custom Grilled Salmon with Herb Potatoes & Veggies",
                img: "https://www.themealdb.com/images/media/meals/1548772327.jpg",
                pFood: "salmon", pMin: 120, pMax: 260, pStep: 10,
                cFood: "potato", cMin: 100, cMax: 420, cStep: 10,
                fFood: "olive_oil", fMin: 2, fMax: 14, fStep: 1,
                extras: [{ key: "veggies_green", grams: 120 }]
            },
            {
                code: "chef_l_steak_sweet",
                nameAr: "ستيك لحم بقري مشوي قليل الدهن مع البطاطا الحلوة المشوية",
                nameEn: "Custom Lean Beef Steak with Roasted Sweet Potato",
                img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/Steak_with_shitaki_mushrooms.jpg/960px-Steak_with_shitaki_mushrooms.jpg",
                pFood: "beef_lean", pMin: 120, pMax: 260, pStep: 10,
                cFood: "sweet_potato", cMin: 100, cMax: 400, cStep: 10,
                fFood: "olive_oil", fMin: 3, fMax: 16, fStep: 1,
                extras: [{ key: "veggies_green", grams: 100 }]
            },
            {
                code: "chef_l_kabsa_chicken",
                nameAr: "كبسة دجاج رياضية بالأرز البسمتي والطماطم وزيت الزيتون",
                nameEn: "Athlete Chicken Kabsa with Basmati Rice",
                img: "https://www.themealdb.com/images/media/meals/utqnjv1763598650.jpg",
                pFood: "chicken", pMin: 130, pMax: 280, pStep: 10,
                cFood: "rice", cMin: 90, cMax: 360, cStep: 10,
                fFood: "olive_oil", fMin: 3, fMax: 18, fStep: 1,
                extras: [{ key: "veggies_tomato", grams: 100 }]
            },
            {
                code: "chef_l_pasta_chicken",
                nameAr: "مكرونة قمح كامل بصدور الدجاج وصوص الطماطم",
                nameEn: "Whole-Wheat Pasta with Grilled Chicken & Marinara",
                img: "https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg",
                pFood: "chicken", pMin: 120, pMax: 260, pStep: 10,
                cFood: "pasta_dry", cMin: 40, cMax: 145, cStep: 5,
                fFood: "olive_oil", fMin: 3, fMax: 18, fStep: 1,
                extras: [{ key: "veggies_tomato", grams: 110 }]
            },
            {
                code: "chef_l_shrimp_brown",
                nameAr: "روبيان مشوي بالثوم مع الأرز البني والخضار",
                nameEn: "Garlic-Herb Grilled Shrimp with Brown Rice",
                img: "https://www.themealdb.com/images/media/meals/sl6vqv1763335988.jpg",
                pFood: "shrimp", pMin: 140, pMax: 300, pStep: 10,
                cFood: "brown_rice", cMin: 90, cMax: 380, cStep: 10,
                fFood: "olive_oil", fMin: 4, fMax: 20, fStep: 1,
                extras: [{ key: "veggies_green", grams: 100 }]
            },
            {
                code: "chef_l_quinoa_chicken",
                nameAr: "بول الدجاج المشوي بالكينوا والأفوكادو والخضار اليونانية",
                nameEn: "Grilled Chicken, Quinoa & Avocado Power Bowl",
                img: "https://www.themealdb.com/images/media/meals/k29viq1585565980.jpg",
                pFood: "chicken", pMin: 130, pMax: 260, pStep: 10,
                cFood: "quinoa", cMin: 80, cMax: 350, cStep: 10,
                fFood: "avocado", fMin: 25, fMax: 100, fStep: 5,
                extras: [{ key: "veggies_green", grams: 100 }]
            }
        ],
        dinner: [
            {
                code: "chef_d_tuna_salad",
                nameAr: "سلطة التونة البروتينية بالأفوكادو والتوست الأسمر",
                nameEn: "Tuna & Avocado Protein Salad with Brown Toast",
                img: "https://www.themealdb.com/images/media/meals/yypwwq1511304979.jpg",
                pFood: "tuna", pMin: 110, pMax: 220, pStep: 10,
                cFood: "bread_wheat", cMin: 20, cMax: 110, cStep: 10,
                fFood: "avocado", fMin: 25, fMax: 90, fStep: 5,
                extras: [{ key: "veggies_green", grams: 140 }]
            },
            {
                code: "chef_d_chicken_wrap",
                nameAr: "راب التورتيلا بالدجاج المشوي والأفوكادو والخس",
                nameEn: "Grilled Chicken & Avocado Whole-Wheat Wrap",
                img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f8/Smoked_chicken_and_avocado_wrap.jpg/960px-Smoked_chicken_and_avocado_wrap.jpg",
                pFood: "chicken", pMin: 100, pMax: 220, pStep: 10,
                cFood: "tortilla", cMin: 40, cMax: 130, cStep: 10,
                fFood: "avocado", fMin: 20, fMax: 80, fStep: 5,
                extras: [{ key: "veggies_green", grams: 80 }]
            },
            {
                code: "chef_d_turkey_club",
                nameAr: "كلوب ساندويتش الديك الرومي المدخن بالخبز البر",
                nameEn: "Smoked Turkey Whole-Wheat Club Sandwich",
                img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Club_sandwich_at_Caf%C3%A9_Picnic.jpg/960px-Club_sandwich_at_Caf%C3%A9_Picnic.jpg",
                pFood: "turkey", pMin: 90, pMax: 220, pStep: 10,
                cFood: "bread_wheat", cMin: 40, cMax: 130, cStep: 10,
                fFood: "olive_oil", fMin: 3, fMax: 15, fStep: 1,
                extras: [{ key: "veggies_tomato", grams: 80 }]
            },
            {
                code: "chef_d_lentil_chicken",
                nameAr: "شوربة عدس غنية بالبروتين مع قطع الدجاج والتوست",
                nameEn: "Protein Lentil Soup with Chicken & Toast",
                img: "https://upload.wikimedia.org/wikipedia/commons/6/61/EgFoodLentilSoup.jpg",
                pFood: "chicken", pMin: 80, pMax: 180, pStep: 10,
                cFood: "lentils", cMin: 100, cMax: 320, cStep: 10,
                fFood: "olive_oil", fMin: 3, fMax: 15, fStep: 1,
                extras: [{ key: "bread_wheat", grams: 30 }]
            },
            {
                code: "chef_d_halloumi_plate",
                nameAr: "طبق الحلوم المشوي مع الطماطم وزيت الزيتون والخبز البر",
                nameEn: "Grilled Light Halloumi, Tomatoes & Brown Bread",
                img: "https://upload.wikimedia.org/wikipedia/commons/5/57/Halloumislice_zoom.jpg",
                pFood: "halloumi", pMin: 60, pMax: 150, pStep: 10,
                cFood: "bread_wheat", cMin: 30, cMax: 120, cStep: 10,
                fFood: "olive_oil", fMin: 2, fMax: 12, fStep: 1,
                extras: [{ key: "veggies_tomato", grams: 120 }]
            },
            {
                code: "chef_d_cottage_salad",
                nameAr: "سلطة الجبن القريش والبيض المسلوق مع التوست البر",
                nameEn: "Cottage Cheese & Boiled Eggs Protein Salad",
                img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/16/Cottagecheese200px.jpg/960px-Cottagecheese200px.jpg",
                pFood: "cottage", pMin: 120, pMax: 260, pStep: 20,
                cFood: "bread_wheat", cMin: 20, cMax: 110, cStep: 10,
                fFood: "olive_oil", fMin: 4, fMax: 18, fStep: 1,
                extras: [{ key: "egg_whole", grams: 100 }, { key: "veggies_green", grams: 100 }]
            }
        ],
        snack: [
            {
                code: "chef_s_yogurt_berries",
                nameAr: "زبادي يوناني بالتوت والعسل واللوز المحمص",
                nameEn: "Greek Yogurt, Fresh Berries, Honey & Almonds",
                img: "https://www.themealdb.com/images/media/meals/oe8rg51699014028.jpg",
                pFood: "greek_yogurt", pMin: 100, pMax: 280, pStep: 20,
                cFood: "honey", cMin: 5, cMax: 30, cStep: 5,
                fFood: "almonds", fMin: 5, fMax: 35, fStep: 5,
                extras: [{ key: "berries", grams: 60 }]
            },
            {
                code: "chef_s_whey_shake",
                nameAr: "سموذي الواي بروتين بالموز والحليب خالي الدسم",
                nameEn: "Banana & Whey Protein Milkshake",
                img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/68/Strawberry_milk_shake_%28cropped%29.jpg/960px-Strawberry_milk_shake_%28cropped%29.jpg",
                pFood: "whey", pMin: 20, pMax: 45, pStep: 5,
                cFood: "banana", cMin: 50, cMax: 180, cStep: 10,
                fFood: "peanut_butter", fMin: 0, fMax: 25, fStep: 5,
                extras: [{ key: "skim_milk", grams: 200 }]
            },
            {
                code: "chef_s_dates_nuts",
                nameAr: "تمر محشي باللوز والجوز للطاقة النظيفة",
                nameEn: "Dates Stuffed with Almonds & Walnuts",
                img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Dates005.jpg/960px-Dates005.jpg",
                pFood: "whey", pMin: 0, pMax: 0, pStep: 5,
                cFood: "dates", cMin: 25, cMax: 110, cStep: 5,
                fFood: "almonds", fMin: 5, fMax: 40, fStep: 5,
                extras: []
            },
            {
                code: "chef_s_apple_almond",
                nameAr: "شرائح التفاح الطازج بزبدة اللوز والقرفة",
                nameEn: "Fresh Apple Slices with Natural Almond Butter",
                img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Pink_lady_and_cross_section.jpg/960px-Pink_lady_and_cross_section.jpg",
                pFood: "greek_yogurt", pMin: 0, pMax: 150, pStep: 50,
                cFood: "apple", cMin: 100, cMax: 250, cStep: 25,
                fFood: "almond_butter", fMin: 8, fMax: 36, fStep: 2,
                extras: []
            },
            {
                code: "chef_s_choco_shake",
                nameAr: "شيك بروتين الشوكولاتة الداكنة بالشوفان والحليب",
                nameEn: "Chocolate Whey & Oats Protein Shake",
                img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/Chocolate_milk.JPG/960px-Chocolate_milk.JPG",
                pFood: "whey", pMin: 20, pMax: 45, pStep: 5,
                cFood: "oats", cMin: 15, cMax: 75, cStep: 5,
                fFood: "walnuts", fMin: 0, fMax: 24, fStep: 4,
                extras: [{ key: "skim_milk", grams: 200 }]
            }
        ]
    },

    calcNutritionFromParts(parts) {
        let pSum = 0, cSum = 0, fSum = 0;
        for (const pt of parts) {
            const food = this.CHEF_FOODS[pt.key];
            if (!food || pt.grams <= 0) continue;
            pSum += food.p * pt.grams;
            cSum += food.c * pt.grams;
            fSum += food.f * pt.grams;
        }
        const protein = Math.round(pSum);
        const carbs = Math.round(cSum);
        const fats = Math.round(fSum);
        const calories = 4 * protein + 4 * carbs + 9 * fats;
        return { protein, carbs, fats, calories };
    },

    formatChefIngredients(parts) {
        const arList = [];
        const enList = [];
        for (const pt of parts) {
            const food = this.CHEF_FOODS[pt.key];
            if (!food || pt.grams <= 0) continue;
            const g = Math.round(pt.grams);
            arList.push(`${food.ar} ${g}${food.unitAr}`);
            enList.push(`${food.en} ${g}${food.unitEn}`);
        }
        return {
            ingredients: arList.join(" + "),
            ingredientsEn: enList.join(" + ")
        };
    },

    // تصميم وجبة مخصصة خارج المكتبة مطابقة تماماً للسعرات المطلوبة بأوزان حقيقية بدون (الحصة × 2)
    composeChefMeal(blueprint, slotTargetCal, categoryAr) {
        const target = Math.max(90, Math.round(parseFloat(slotTargetCal) || 400));
        const pf = this.CHEF_FOODS[blueprint.pFood];
        const cf = this.CHEF_FOODS[blueprint.cFood];
        const ff = this.CHEF_FOODS[blueprint.fFood];

        let fixedP = 0, fixedC = 0, fixedF = 0;
        const extras = (blueprint.extras || []).map(x => ({ key: x.key, grams: x.grams }));
        for (const ex of extras) {
            const f = this.CHEF_FOODS[ex.key];
            if (!f) continue;
            fixedP += f.p * ex.grams;
            fixedC += f.c * ex.grams;
            fixedF += f.f * ex.grams;
        }
        const fixedCal = 4 * fixedP + 4 * fixedC + 9 * fixedF;

        // توسيع السقف تلقائياً لأهداف التضخيم العالية (3200-4500 سعرة) لضمان مطابقة تامة بدون مضاعف الحصة
        const scaleUp = (categoryAr === "سناكس" && target > 320)
            ? Math.min(2.4, target / 260)
            : (target > 750 ? Math.min(2.0, target / 700) : 1);
        const effPMax = blueprint.pMax > 0 ? Math.round((blueprint.pMax * Math.min(1.5, scaleUp)) / blueprint.pStep) * blueprint.pStep : 0;
        const effCMax = blueprint.cMax > 0 ? Math.round((blueprint.cMax * scaleUp) / blueprint.cStep) * blueprint.cStep : 0;
        const effFMax = blueprint.fMax > 0 ? Math.round((blueprint.fMax * Math.min(1.75, scaleUp)) / blueprint.fStep) * blueprint.fStep : 0;

        // تقليص أو زيادة المكونات الإضافية بنسبة متوازنة حسب حجم السعرات
        if (fixedCal > target * 0.65 && extras.length > 0) {
            const ratio = Math.max(0.35, (target * 0.45) / fixedCal);
            for (const ex of extras) {
                ex.grams = Math.max(10, Math.round((ex.grams * ratio) / 5) * 5);
            }
        } else if (scaleUp > 1.2 && extras.length > 0) {
            const upRatio = Math.min(1.5, scaleUp);
            for (const ex of extras) {
                ex.grams = Math.round((ex.grams * upRatio) / 5) * 5;
            }
        }

        // اختيار أفضل توليفة أوزان (pGrams, cGrams, fGrams) تضبط السعرات بدقة
        let bestCombo = null;
        let bestDiff = Infinity;

        const pVals = [];
        for (let pg = blueprint.pMin; pg <= effPMax; pg += blueprint.pStep) pVals.push(pg);
        if (pVals.length === 0) pVals.push(0);

        const cVals = [];
        for (let cg = blueprint.cMin; cg <= effCMax; cg += blueprint.cStep) cVals.push(cg);
        if (cVals.length === 0) cVals.push(0);

        const fVals = [];
        for (let fg = blueprint.fMin; fg <= effFMax; fg += blueprint.fStep) fVals.push(fg);
        if (fVals.length === 0) fVals.push(0);

        // الحصة المستهدفة للبروتين ~30-35% والكارب ~40-50% للوجبات الرئيسية
        const desiredP = (target * 0.30) / 4;
        const desiredC = (target * 0.44) / 4;

        for (const pg of pVals) {
            for (const cg of cVals) {
                for (const fg of fVals) {
                    const parts = [];
                    if (pg > 0) parts.push({ key: blueprint.pFood, grams: pg });
                    if (cg > 0) parts.push({ key: blueprint.cFood, grams: cg });
                    if (fg > 0) parts.push({ key: blueprint.fFood, grams: fg });
                    parts.push(...extras);

                    const n = this.calcNutritionFromParts(parts);
                    const calDiff = Math.abs(n.calories - target);
                    const macroBalancePenalty = (Math.abs(n.protein - desiredP) * 0.12) + (Math.abs(n.carbs - desiredC) * 0.05);
                    const score = calDiff + (calDiff <= 12 ? macroBalancePenalty : 0);

                    if (score < bestDiff) {
                        bestDiff = score;
                        bestCombo = { parts, ...n, calDiff };
                    }
                }
            }
        }

        const chosen = bestCombo || {
            parts: extras,
            ...this.calcNutritionFromParts(extras)
        };
        const ing = this.formatChefIngredients(chosen.parts);

        return {
            id: `${blueprint.code}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            blueprintCode: blueprint.code,
            isCustomDesigned: true,
            name: blueprint.nameAr,
            nameEn: blueprint.nameEn,
            category: categoryAr,
            ingredients: ing.ingredients,
            ingredientsEn: ing.ingredientsEn,
            calories: chosen.calories,
            protein: chosen.protein,
            carbs: chosen.carbs,
            fats: chosen.fats,
            img: blueprint.img,
            _parts: chosen.parts
        };
    },

    pickRandom(arr, excludeCode = null) {
        const filtered = excludeCode ? arr.filter(x => x.code !== excludeCode) : arr;
        const pool = filtered.length > 0 ? filtered : arr;
        return pool[Math.floor(Math.random() * pool.length)];
    },

    // خوارزمية "مولد الدايت الذكي" لليوم الكامل — تصمم وجبات مخصصة مطابقة تماماً لسعرات الحاسبة
    generateFullDayPlan(targetCalories) {
        targetCalories = Math.max(1000, Math.round(parseFloat(targetCalories) || 2000));

        const targetB = Math.round(targetCalories * 0.25);
        const targetL = Math.round(targetCalories * 0.37);
        const targetD = Math.round(targetCalories * 0.24);

        const bBp = this.pickRandom(this.CHEF_BLUEPRINTS.breakfast);
        const lBp = this.pickRandom(this.CHEF_BLUEPRINTS.lunch);
        const dBp = this.pickRandom(this.CHEF_BLUEPRINTS.dinner);

        const breakfast = this.composeChefMeal(bBp, targetB, "إفطار");
        const lunch = this.composeChefMeal(lBp, targetL, "غداء");
        const dinner = this.composeChefMeal(dBp, targetD, "عشاء");

        const usedSoFar = breakfast.calories + lunch.calories + dinner.calories;
        const snackTarget = Math.max(95, targetCalories - usedSoFar);

        // تجربة قوالب السناك واختيار الأدق تطابقاً للوصول لأقرب رقم للسعرات المستهدفة
        let bestSnack = null;
        let smallestDayDiff = Infinity;
        const shuffledSnacks = [...this.CHEF_BLUEPRINTS.snack].sort(() => Math.random() - 0.5);
        for (const sBp of shuffledSnacks) {
            const candidate = this.composeChefMeal(sBp, snackTarget, "سناكس");
            const diff = Math.abs((usedSoFar + candidate.calories) - targetCalories);
            if (diff < smallestDayDiff) {
                smallestDayDiff = diff;
                bestSnack = candidate;
            }
        }
        const snack = bestSnack || this.composeChefMeal(this.CHEF_BLUEPRINTS.snack[0], snackTarget, "سناكس");

        // إزالة الحقل المؤقت _parts قبل الحفظ
        const cleanMeal = (m) => {
            const copy = { ...m };
            delete copy._parts;
            return copy;
        };

        const bClean = cleanMeal(breakfast);
        const lClean = cleanMeal(lunch);
        const dClean = cleanMeal(dinner);
        const sClean = cleanMeal(snack);

        const totalCalories = bClean.calories + lClean.calories + dClean.calories + sClean.calories;
        return {
            breakfast: bClean,
            lunch: lClean,
            dinner: dClean,
            snack: sClean,
            totalCalories,
            totalProtein: bClean.protein + lClean.protein + dClean.protein + sClean.protein,
            totalCarbs: bClean.carbs + lClean.carbs + dClean.carbs + sClean.carbs,
            totalFats: bClean.fats + lClean.fats + dClean.fats + sClean.fats,
            difference: Math.round(totalCalories - targetCalories)
        };
    },

    // استبدال وجبة في خطة اليوم بوجبة مصممة مختلفة تطابق نفس السعرات المستهدفة للخانة
    generateAlternativeForSlot(slotKey, targetSlotCalories, currentMeal = null) {
        const slotMap = {
            breakfast: { bpList: this.CHEF_BLUEPRINTS.breakfast, cat: "إفطار" },
            lunch:     { bpList: this.CHEF_BLUEPRINTS.lunch, cat: "غداء" },
            dinner:    { bpList: this.CHEF_BLUEPRINTS.dinner, cat: "عشاء" },
            snack:     { bpList: this.CHEF_BLUEPRINTS.snack, cat: "سناكس" }
        };
        const info = slotMap[slotKey] || slotMap.lunch;
        const excludeCode = currentMeal?.blueprintCode || null;
        const bp = this.pickRandom(info.bpList, excludeCode);
        const meal = this.composeChefMeal(bp, targetSlotCalories || currentMeal?.calories || 400, info.cat);
        delete meal._parts;
        return meal;
    },

    // البحث عن بدائل من المكتبة
    findMealAlternatives(mealId) {
        const allMeals = this.getAllMeals();
        const currentMeal = allMeals.find(m => m.id === mealId);
        if (!currentMeal) return [];

        const sameCategory = allMeals.filter(m => m.category === currentMeal.category && m.id !== currentMeal.id);
        const withinRange = sameCategory
            .filter(m => Math.abs(m.calories - currentMeal.calories) <= 80)
            .sort((a, b) => Math.abs(a.calories - currentMeal.calories) - Math.abs(b.calories - currentMeal.calories));

        if (withinRange.length > 0) return withinRange.slice(0, 5);

        return sameCategory
            .sort((a, b) => Math.abs(a.calories - currentMeal.calories) - Math.abs(b.calories - currentMeal.calories))
            .slice(0, 5);
    }
};
