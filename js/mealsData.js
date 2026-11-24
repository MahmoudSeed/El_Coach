/**
 * IronCoach Pro - 100 Healthy Meals Database
 * قاعدة بيانات الـ 100 وجبة المتكاملة مع المكونات والأوزان بالجرام والماكروز
 */

const defaultMealsData = [
    // ==========================================
    // وجبات الإفطار (25 وجبة)
    // ==========================================
    {
        id: "m_b_1",
        name: "عجة البيض بالسبانخ والجبن الفتا",
        category: "إفطار",
        ingredients: "بيض كامل 150ج (3 حبات) + بياض بيض 60ج + سبانخ طازجة 50ج + جبن فتا 30ج + زيت زيتون 5ج",
        calories: 340,
        protein: 28,
        carbs: 15,
        fats: 18,
        tags: ["عالي البروتين", "قليل الكارب", "سريع"],
        img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500"
    },
    {
        id: "m_b_2",
        name: "شوفان الطاقة بالفواكه والمكسرات",
        category: "إفطار",
        ingredients: "شوفان حبوب كاملة 50ج + حليب خالي الدسم 200مل + موز 60ج + توت 30ج + زبدة فول سوداني 15ج",
        calories: 390,
        protein: 16,
        carbs: 52,
        fats: 12,
        tags: ["طاقة عالية", "ألياف"],
        img: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=500"
    },
    {
        id: "m_b_3",
        name: "بان كيك البروتين الذهبي الصحي",
        category: "إفطار",
        ingredients: "دقيق الشوفان 45ج + واي بروتين 30ج + بياض بيض 60ج + حليب خالي الدسم 100مل",
        calories: 310,
        protein: 25,
        carbs: 35,
        fats: 8,
        tags: ["عالي البروتين", "بناء عضلات"],
        img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500"
    },
    {
        id: "m_b_4",
        name: "توست الأفوكادو بالخبز البر مع البيض المسلوق",
        category: "إفطار",
        ingredients: "خبز أسمر 60ج (شريحتين) + أفوكادو 50ج + بيض مسلوق 100ج (حبتين)",
        calories: 330,
        protein: 18,
        carbs: 28,
        fats: 16,
        tags: ["دهون صحية", "أوميغا 3"],
        img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500"
    },
    {
        id: "m_b_5",
        name: "لبنة خفيفة مع الشوفان والعسل الطبيعي",
        category: "إفطار",
        ingredients: "لبنة قليل الدسم 100ج + شوفان 30ج + عسل طبيعي 15ج + مكسرات مشكلة 10ج",
        calories: 290,
        protein: 17,
        carbs: 40,
        fats: 7,
        tags: ["سريع", "بروبيوتيك"],
        img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500"
    },
    {
        id: "m_b_6",
        name: "شكشوكة صحية بقطرات زيت الزيتون البكر",
        category: "إفطار",
        ingredients: "بيض 150ج (3 حبات) + طماطم مفرومة 120ج + بصل 40ج + زيت زيتون 7ج",
        calories: 280,
        protein: 20,
        carbs: 12,
        fats: 16,
        tags: ["تقليدي", "قليل الكارب"],
        img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500"
    },
    {
        id: "m_b_7",
        name: "بودنج الشيا بحليب اللوز والتوت المشكل",
        category: "إفطار",
        ingredients: "بذور الشيا 30ج + حليب اللوز 200مل + توت مشكل 40ج + عسل 10ج",
        calories: 250,
        protein: 10,
        carbs: 22,
        fats: 12,
        tags: ["خفيف", "مضادات أكسدة"],
        img: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=500"
    },
    {
        id: "m_b_8",
        name: "مربعات التمر وبروتين الشوفان الصحي",
        category: "إفطار",
        ingredients: "تمر مطحون 50ج + شوفان 40ج + زبدة فول سوداني 15ج + واي بروتين 20ج",
        calories: 320,
        protein: 21,
        carbs: 45,
        fats: 8,
        tags: ["طاقة قبل التمرين"],
        img: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500"
    },
    {
        id: "m_b_9",
        name: "ساندويتش البيض المسلوق بالخبز الأسمر",
        category: "إفطار",
        ingredients: "خبز أسمر 60ج + بيض مسلوق 100ج + خس وطماطم 40ج + مايونيز لايت 10ج",
        calories: 300,
        protein: 22,
        carbs: 30,
        fats: 10,
        tags: ["سريع التحضير", "اقتصادي"],
        img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500"
    },
    {
        id: "m_b_10",
        name: "مهلبية الشوفان بالقرفة والعسل",
        category: "إفطار",
        ingredients: "شوفان 40ج + حليب خالي الدسم 250مل + نشا ذرة 10ج + قرفة وعسل 10ج",
        calories: 270,
        protein: 12,
        carbs: 46,
        fats: 5,
        tags: ["دافئ", "صحي"],
        img: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=500"
    },
    {
        id: "m_b_11",
        name: "عجة بياض البيض بالفطر والخضار",
        category: "إفطار",
        ingredients: "بياض بيض 150ج + فطر مشوي 60ج + بصل وفلفل رومي 50ج + زيت زيتون 5ج",
        calories: 220,
        protein: 26,
        carbs: 10,
        fats: 6,
        tags: ["تنشيف حاد", "قليل السعرات"],
        img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500"
    },
    {
        id: "m_b_12",
        name: "بان كيك الموز والمكسرات السريع",
        category: "إفطار",
        ingredients: "موز ناضج 80ج + بيض 100ج (حبتين) + دقيق الشوفان 30ج + لوز مجروش 10ج",
        calories: 340,
        protein: 15,
        carbs: 48,
        fats: 10,
        tags: ["لذيذ", "طبيعي"],
        img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500"
    },
    {
        id: "m_b_13",
        name: "خبز أسمر مع زبدة الفول السوداني والموز",
        category: "إفطار",
        ingredients: "خبز أسمر 60ج + زبدة فول سوداني 20ج + موز مقطع 60ج",
        calories: 360,
        protein: 14,
        carbs: 42,
        fats: 15,
        tags: ["طاقة سريعة"],
        img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500"
    },
    {
        id: "m_b_14",
        name: "زبادي يوناني مع بذور الكتان والعسل",
        category: "إفطار",
        ingredients: "زبادي يوناني 150ج + بذور كتان مطحونة 10ج + عسل 15ج + لوز 10ج",
        calories: 260,
        protein: 22,
        carbs: 24,
        fats: 8,
        tags: ["عالي البروتين", "سريع"],
        img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500"
    },
    {
        id: "m_b_15",
        name: "سلطة الجبن القريش بالطماطم الشيري وزيت الزيتون",
        category: "إفطار",
        ingredients: "جبن قريش 120ج + طماطم شيري 80ج + خيار 60ج + زيت زيتون 5ج",
        calories: 210,
        protein: 25,
        carbs: 8,
        fats: 9,
        tags: ["تنشيف", "كازين بطيء الامتصاص"],
        img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500"
    },
    {
        id: "m_b_16",
        name: "عجة خضار بالطحينة المخففة",
        category: "إفطار",
        ingredients: "بيض 100ج (حبتين) + كوسة وجزر مبشور 80ج + طحينة 15ج + ليمون",
        calories: 310,
        protein: 19,
        carbs: 14,
        fats: 20,
        tags: ["دهون صحية"],
        img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500"
    },
    {
        id: "m_b_17",
        name: "سموذي التوت الأخضر والبروتين المعزز",
        category: "إفطار",
        ingredients: "واي بروتين 30ج + سبانخ 40ج + توت مجمد 60ج + حليب لوز 200مل",
        calories: 290,
        protein: 30,
        carbs: 32,
        fats: 5,
        tags: ["عالي البروتين", "مضادات أكسدة"],
        img: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=500"
    },
    {
        id: "m_b_18",
        name: "بليلة قمح صحية بالحليب خالي الدسم والقرفة",
        category: "إفطار",
        ingredients: "حبوب قمح مسلوقة 80ج + حليب خالي الدسم 200مل + قرفة وستيفيا",
        calories: 350,
        protein: 16,
        carbs: 60,
        fats: 4,
        tags: ["ألياف", "شبع طويل"],
        img: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=500"
    },
    {
        id: "m_b_19",
        name: "رول التورتيلا بالأومليت والجبن الخفيف",
        category: "إفطار",
        ingredients: "خبز تورتيلا بر 60ج + بيض 100ج + جبن موزاريلا لايت 20ج + خس",
        calories: 340,
        protein: 24,
        carbs: 32,
        fats: 12,
        tags: ["سريع"],
        img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500"
    },
    {
        id: "m_b_20",
        name: "فطائر الشوفان والجبن القريش الصحية",
        category: "إفطار",
        ingredients: "شوفان 40ج + جبن قريش 80ج + بيض 50ج (حبة) + بيكنج بودر وفانيليا",
        calories: 320,
        protein: 23,
        carbs: 36,
        fats: 9,
        tags: ["عالي البروتين"],
        img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500"
    },
    {
        id: "m_b_21",
        name: "فول مدمس بزيت الزيتون والكمون والخبز الأسمر",
        category: "إفطار",
        ingredients: "فول مسلوق 150ج + زيت زيتون 10ج + ليمون وكمون + نصف رغيف أسمر 40ج",
        calories: 310,
        protein: 15,
        carbs: 40,
        fats: 11,
        tags: ["بروتين نباتي", "اقتصادي", "شبع"],
        img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500"
    },
    {
        id: "m_b_22",
        name: "ساندويتش اللبنة والنعناع الطازج وزيت الزيتون",
        category: "إفطار",
        ingredients: "خبز أسمر 60ج + لبنة قليل الدسم 50ج + نعناع طازج وزيت زيتون 5ج",
        calories: 250,
        protein: 12,
        carbs: 30,
        fats: 9,
        tags: ["خفيف"],
        img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500"
    },
    {
        id: "m_b_23",
        name: "حبوب الذرة الكاملة مع حليب اللوز واللوز",
        category: "إفطار",
        ingredients: "حبوب ذرة كاملة 50ج + حليب اللوز 250مل + لوز مبشور 10ج",
        calories: 240,
        protein: 8,
        carbs: 45,
        fats: 4,
        tags: ["سريع"],
        img: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=500"
    },
    {
        id: "m_b_24",
        name: "عصير المانجو والبروتين النباتي وبذور الشيا",
        category: "إفطار",
        ingredients: "مانجو مجمدة 100ج + بروتين نباتي 30ج + حليب لوز 200مل + بذور الشيا 10ج",
        calories: 280,
        protein: 25,
        carbs: 38,
        fats: 3,
        tags: ["نباتي", "انتعاش"],
        img: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=500"
    },
    {
        id: "m_b_25",
        name: "كب كيك بروتين الشوفان الصحي بالفرن",
        category: "إفطار",
        ingredients: "دقيق شوفان 40ج + واي بروتين 30ج + حليب 80مل + بياض بيض 50ج",
        calories: 330,
        protein: 26,
        carbs: 34,
        fats: 9,
        tags: ["وجبة مجهزة مسبقاً"],
        img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500"
    },

    // ==========================================
    // وجبات الغداء (35 وجبة)
    // ==========================================
    {
        id: "m_l_1",
        name: "صدور الدجاج المشوية مع الأرز البسمتي والخضار",
        category: "غداء",
        ingredients: "صدور دجاج 180ج + أرز بسمتي مطبوخ 150ج + بروكلي وجزر مسلوق 100ج + زيت زيتون 8ج",
        calories: 460,
        protein: 45,
        carbs: 48,
        fats: 8,
        tags: ["عالي البروتين", "وجبة رياضية كلاسيكية"],
        img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500"
    },
    {
        id: "m_l_2",
        name: "السلمون المشوي مع البطاطس المهروسة والهليون",
        category: "غداء",
        ingredients: "فيليه سلمون 160ج + بطاطس مسلوقة 150ج + هليون مشوي 80ج + زبدة خفيفة 10ج",
        calories: 510,
        protein: 38,
        carbs: 32,
        fats: 22,
        tags: ["أوميغا 3", "استشفاء عضلي"],
        img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500"
    },
    {
        id: "m_l_3",
        name: "ستيك لحم بقري صافي مع البطاطا الحلوة المشوية",
        category: "غداء",
        ingredients: "ستيك فخذ بقري 160ج + بطاطا حلوة 120ج + فطر وكوسة مشوية 100ج + زيت زيتون 10ج",
        calories: 480,
        protein: 42,
        carbs: 25,
        fats: 20,
        tags: ["حديد وزنك", "بناء عضلات"],
        img: "https://images.unsplash.com/photo-1558030006-450675393462?w=500"
    },
    {
        id: "m_l_4",
        name: "دجاج كاري صحي بحليب جوز الهند مع الكينوا",
        category: "غداء",
        ingredients: "صدور دجاج 160ج + كينوا مطبوخة 140ج + حليب جوز الهند خفيف 50مل + كاري وبصل",
        calories: 440,
        protein: 40,
        carbs: 42,
        fats: 10,
        tags: ["نكهة مميزة", "كينوا بروتينية"],
        img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500"
    },
    {
        id: "m_l_5",
        name: "سمك فيليه بالفرن بالليمون والأعشاب مع الأرز",
        category: "غداء",
        ingredients: "فيليه سمك هامور أو قاص 180ج + أرز أبيض مطبوخ 130ج + سلطة خضراء 80ج + زيت زيتون 10ج",
        calories: 380,
        protein: 44,
        carbs: 18,
        fats: 14,
        tags: ["تنشيف", "خفيف وسريع الهضم"],
        img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500"
    },
    {
        id: "m_l_6",
        name: "كبسة دجاج بني صحية بزيت الزيتون",
        category: "غداء",
        ingredients: "دجاج بدون عظم 160ج + أرز بني 140ج + طماطم وبهارات كبسة + زيت زيتون 8ج",
        calories: 490,
        protein: 43,
        carbs: 52,
        fats: 11,
        tags: ["وجبة شرقية صحية"],
        img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500"
    },
    {
        id: "m_l_7",
        name: "مكرونة القمح الكامل بصدور الدجاج وصوص الطماطم الطبيعي",
        category: "غداء",
        ingredients: "مكرونة قمح كامل جافة 70ج (160ج مطبوخة) + صدور دجاج 150ج + صوص طماطم طبيعي",
        calories: 470,
        protein: 41,
        carbs: 55,
        fats: 9,
        tags: ["طاقة وتغذية قبل التمرين"],
        img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500"
    },
    {
        id: "m_l_8",
        name: "لحم مفروم قليل الدسم مع البرغل وتبولة الكينوا",
        category: "غداء",
        ingredients: "لحم بقري مفروم خالي الدسم 150ج + برغل مطبوخ 130ج + سلطة تبولة خفيفة 80ج",
        calories: 450,
        protein: 39,
        carbs: 38,
        fats: 15,
        tags: ["ألياف عالية"],
        img: "https://images.unsplash.com/photo-1558030006-450675393462?w=500"
    },
    {
        id: "m_l_9",
        name: "روبيان مشوي بالثوم والبقدونس مع الأرز البني",
        category: "غداء",
        ingredients: "روبيان (جمبري) مقشر 200ج + أرز بني مطبوخ 140ج + ثوم وبقدونس وزيت زيتون 7ج",
        calories: 410,
        protein: 42,
        carbs: 45,
        fats: 6,
        tags: ["قليل الدهون جداً", "فسفور وطاقة"],
        img: "https://images.unsplash.com/photo-1565680314444-aef554032d84?w=500"
    },
    {
        id: "m_l_10",
        name: "صينية دجاج بالبطاطس والبصل بالفرن بدون دهن إضافي",
        category: "غداء",
        ingredients: "صدور دجاج منزوعة الجلد 160ج + بطاطس 130ج + بصل وطماطم شرائح + زيت 8ج",
        calories: 460,
        protein: 44,
        carbs: 36,
        fats: 13,
        tags: ["عائلي وسهل التحضير"],
        img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500"
    },
    {
        id: "m_l_11",
        name: "شاورما دجاج صحية بخبز التورتيلا الأسمر والثومية اليونانية",
        category: "غداء",
        ingredients: "صدور دجاج شرائح 160ج + خبز تورتيلا بر 60ج + صوص زبادي يوناني وثوم 20ج + خضار",
        calories: 430,
        protein: 40,
        carbs: 38,
        fats: 12,
        tags: ["بديل صحي للوجبات السريعة"],
        img: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500"
    },
    {
        id: "m_l_12",
        name: "فاهيتا لحم بقري مع الفلفل الملون وخبز التورتيلا",
        category: "غداء",
        ingredients: "ستيك لحم شرائح 150ج + فلفل رومي وبصل 120ج + خبز تورتيلا 50ج + زيت زيتون 10ج",
        calories: 450,
        protein: 42,
        carbs: 30,
        fats: 16,
        tags: ["مكسيكي صحي"],
        img: "https://images.unsplash.com/photo-1558030006-450675393462?w=500"
    },
    {
        id: "m_l_13",
        name: "دجاج مشوي بصوص البرتقال والصويا المخففة مع الأرز",
        category: "غداء",
        ingredients: "صدور دجاج 170ج + عصير برتقال طبيعي 50مل + صوص صويا خفيف + أرز 120ج",
        calories: 420,
        protein: 43,
        carbs: 40,
        fats: 8,
        tags: ["صوديوم منخفض"],
        img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500"
    },
    {
        id: "m_l_14",
        name: "سمك السلمون مع الأرز الأسود والبروكلي المسلوق",
        category: "غداء",
        ingredients: "فيليه سلمون 150ج + أرز أسود مطبوخ 130ج + كوسة وبروكلي 90ج",
        calories: 530,
        protein: 40,
        carbs: 35,
        fats: 24,
        tags: ["أوميغا وفيتامينات"],
        img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500"
    },
    {
        id: "m_l_15",
        name: "برجر دجاج منزلي مشوي مع خبز برجر بر وسلطة",
        category: "غداء",
        ingredients: "برجر دجاج مفروم منزلي 160ج + خبز برجر بر 60ج + خس وطماطم ومخلل + صوص خردل لايت",
        calories: 440,
        protein: 38,
        carbs: 42,
        fats: 11,
        tags: ["وجبة مشبعة"],
        img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"
    },
    {
        id: "m_l_16",
        name: "مسقعة باذنجان مشوي باللحم المفروم قليل الدسم",
        category: "غداء",
        ingredients: "باذنجان مشوي 150ج + لحم مفروم 120ج + صلصة طماطم طبيعية 80ج + زيت زيتون 8ج",
        calories: 390,
        protein: 32,
        carbs: 28,
        fats: 16,
        tags: ["قليل السعرات"],
        img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500"
    },
    {
        id: "m_l_17",
        name: "دجاج تندوري متبل بالزبادي مع البطاطس المشوية",
        category: "غداء",
        ingredients: "صدور دجاج متبلة بالزبادي والبهارات 170ج + بطاطس مكعبات بالفرن 130ج + زيت 7ج",
        calories: 450,
        protein: 46,
        carbs: 34,
        fats: 10,
        tags: ["عالي البروتين"],
        img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500"
    },
    {
        id: "m_l_18",
        name: "مقلوبة دجاج صحية بالأرز البسمتي والخضار المشوية",
        category: "غداء",
        ingredients: "دجاج مسلوق ومحمر بالفرن 160ج + أرز بسمتي 140ج + زهرة وباذنجان مشوي 80ج",
        calories: 500,
        protein: 45,
        carbs: 48,
        fats: 14,
        tags: ["غداء عربي صحي"],
        img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500"
    },
    {
        id: "m_l_19",
        name: "ستيك لحم بقري مع الكينوا والفاصوليا الحمراء",
        category: "غداء",
        ingredients: "ستيك لحم 150ج + كينوا مطبوخة 130ج + فاصوليا حمراء 50ج + صوص طماطم حار",
        calories: 470,
        protein: 41,
        carbs: 38,
        fats: 17,
        tags: ["طاقة متفجرة"],
        img: "https://images.unsplash.com/photo-1558030006-450675393462?w=500"
    },
    {
        id: "m_l_20",
        name: "شوربة عدس غنية بقطع الدجاج المسلوق",
        category: "غداء",
        ingredients: "عدس أصفر مطبوخ 150ج + صدور دجاج مكعبات 120ج + بصل وجزر + زيت زيتون 7ج",
        calories: 380,
        protein: 36,
        carbs: 40,
        fats: 8,
        tags: ["دافئ", "اقتصادي"],
        img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500"
    },
    {
        id: "m_l_21",
        name: "فيليه سمك الهامور مع البروكلي والبطاطس المسلوقة",
        category: "غداء",
        ingredients: "فيليه هامور 180ج + بطاطس مسلوقة 120ج + بروكلي على البخار 100ج + ليمون وزيت 6ج",
        calories: 390,
        protein: 45,
        carbs: 26,
        fats: 9,
        tags: ["تنشيف عالي"],
        img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500"
    },
    {
        id: "m_l_22",
        name: "دجاج مشوي بالفطر والبصل المعسل مع الأرز الأبيض",
        category: "غداء",
        ingredients: "صدور دجاج 170ج + فطر طازج 80ج + بصل 60ج + زيت زيتون 8ج + أرز 100ج",
        calories: 430,
        protein: 44,
        carbs: 22,
        fats: 12,
        tags: ["قليل الكارب"],
        img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500"
    },
    {
        id: "m_l_23",
        name: "مكرونة بشاميل صحية بدقيق الشوفان والدجاج المفروم",
        category: "غداء",
        ingredients: "مكرونة قمح كامل 60ج + دجاج مفروم 120ج + حليب خالي الدسم 150مل + دقيق شوفان 15ج",
        calories: 490,
        protein: 38,
        carbs: 54,
        fats: 13,
        tags: ["وجبة مفضلة بنسخة فتنس"],
        img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500"
    },
    {
        id: "m_l_24",
        name: "لحم ضأن قليل الدسم مشوي مع البطاطس والكوسة",
        category: "غداء",
        ingredients: "لحم غنم خالي من الشحم 150ج + بطاطس وكوسة مشوية 140ج + زيت زيتون 12ج",
        calories: 520,
        protein: 40,
        carbs: 20,
        fats: 30,
        tags: ["كيتو / لو كارب"],
        img: "https://images.unsplash.com/photo-1558030006-450675393462?w=500"
    },
    {
        id: "m_l_25",
        name: "دجاج بالصلصة المكسيكية والأرز البني والذرة",
        category: "غداء",
        ingredients: "صدور دجاج 160ج + فاصوليا حمراء وذرة حلوة 60ج + أرز بني 130ج + صوص طماطم",
        calories: 460,
        protein: 42,
        carbs: 48,
        fats: 9,
        tags: ["طاقة عالية"],
        img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500"
    },
    {
        id: "m_l_26",
        name: "سلطة دجاج دافئة مع الكينوا وشرائح الأفوكادو",
        category: "غداء",
        ingredients: "صدور دجاج مشوية 150ج + كينوا 100ج + أفوكادو 40ج + خس وجرجير 60ج + ليمون وزيت",
        calories: 440,
        protein: 39,
        carbs: 30,
        fats: 18,
        tags: ["مغذيات متكاملة"],
        img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500"
    },
    {
        id: "m_l_27",
        name: "صدور دجاج محشية بالسبانخ والجبن اللايت والبطاطس",
        category: "غداء",
        ingredients: "صدور دجاج 180ج + سبانخ 40ج + جبن ريكوتا لايت 30ج + بطاطس مسلوقة 100ج",
        calories: 410,
        protein: 48,
        carbs: 12,
        fats: 18,
        tags: ["بروتين هائل"],
        img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500"
    },
    {
        id: "m_l_28",
        name: "صينية كفتة لحم بالفرن مع الطماطم والبطاطس الشرائح",
        category: "غداء",
        ingredients: "لحم بقري مفروم خالي الدهن 150ج + بطاطس 120ج + عصير طماطم وبصل 100ج + زيت 10ج",
        calories: 470,
        protein: 37,
        carbs: 32,
        fats: 20,
        tags: ["لذيذ ومشبع"],
        img: "https://images.unsplash.com/photo-1558030006-450675393462?w=500"
    },
    {
        id: "m_l_29",
        name: "أرز برياني دجاج صحي خفيف بالزبادي اليوناني",
        category: "غداء",
        ingredients: "صدور دجاج 160ج + أرز بسمتي 140ج + زبادي خفيف 40ج + بصل مكرمل بزيت 8ج",
        calories: 480,
        protein: 43,
        carbs: 50,
        fats: 10,
        tags: ["بهارات مميزة"],
        img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500"
    },
    {
        id: "m_l_30",
        name: "سلمون مشوي بصوص الأعشاب والزبدة الخفيفة مع البروكلي",
        category: "غداء",
        ingredients: "فيليه سلمون 160ج + هليون وبروكلي 120ج + زبدة خفيفة 15ج + أعشاب وزيت زيتون",
        calories: 520,
        protein: 39,
        carbs: 15,
        fats: 34,
        tags: ["كيتو / دهون ممتازة"],
        img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500"
    },
    {
        id: "m_l_31",
        name: "دجاج بالباربيكيو الصحي المشوي مع البطاطس المكعبات",
        category: "غداء",
        ingredients: "صدور دجاج 170ج + صوص باربيكيو بدون سكر 25ج + بطاطس بالفرن 130ج + زيت 7ج",
        calories: 450,
        protein: 42,
        carbs: 44,
        fats: 9,
        tags: ["نكهة باربيكيو"],
        img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500"
    },
    {
        id: "m_l_32",
        name: "كبسة لحم بقري صافي بدون دهون زائدة مع الأرز البسمتي",
        category: "غداء",
        ingredients: "لحم بقري بدون دهن 150ج + أرز بسمتي 140ج + بهارات كبسة وبصل 50ج + زيت 8ج",
        calories: 510,
        protein: 40,
        carbs: 48,
        fats: 16,
        tags: ["طاقة وضخامة"],
        img: "https://images.unsplash.com/photo-1558030006-450675393462?w=500"
    },
    {
        id: "m_l_33",
        name: "دجاج مشوي مع الفاصوليا الخضراء والبطاطس المسلوقة",
        category: "غداء",
        ingredients: "صدور دجاج 170ج + فاصوليا خضراء مسلوقة 120ج + بطاطس مسلوقة 100ج + زيت زيتون 6ج",
        calories: 420,
        protein: 45,
        carbs: 32,
        fats: 8,
        tags: ["تنشيف نقي"],
        img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500"
    },
    {
        id: "m_l_34",
        name: "متبل كوسة مشوية مع الدجاج المحمر بالفرن",
        category: "غداء",
        ingredients: "صدور دجاج 160ج + كوسة مشوية ومهروسة 130ج + طحينة خفيفة 15ج + ثوم وليمون",
        calories: 380,
        protein: 38,
        carbs: 20,
        fats: 16,
        tags: ["قليل الكارب"],
        img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500"
    },
    {
        id: "m_l_35",
        name: "ستيك لحم بقري مع المشروم والبطاطس المهروسة",
        category: "غداء",
        ingredients: "ستيك لحم 160ج + فطر طازج 90ج + بطاطس مهروسة 120ج + حليب خالي الدسم وزبدة 8ج",
        calories: 490,
        protein: 44,
        carbs: 28,
        fats: 21,
        tags: ["قوة وبناء"],
        img: "https://images.unsplash.com/photo-1558030006-450675393462?w=500"
    },

    // ==========================================
    // وجبات العشاء (25 وجبة)
    // ==========================================
    {
        id: "m_d_1",
        name: "سلطة التونة البروتينية المنعشة بالأفوكادو والذرة",
        category: "عشاء",
        ingredients: "تونا مصفاة بالماء 120ج + أفوكادو 40ج + ذرة حلوة 40ج + خس وخيار 100ج + ليمون",
        calories: 310,
        protein: 34,
        carbs: 14,
        fats: 13,
        tags: ["سريع", "عالي البروتين"],
        img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500"
    },
    {
        id: "m_d_2",
        name: "ساندويتش ديك رومي مدخن بالخبز الأسمر والجبن اللايت",
        category: "عشاء",
        ingredients: "خبز أسمر 60ج + شرائح ديك رومي مدخن 90ج + خس وطماطم + جبن شيدر لايت 15ج",
        calories: 320,
        protein: 25,
        carbs: 35,
        fats: 8,
        tags: ["سريع التحضير"],
        img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500"
    },
    {
        id: "m_d_3",
        name: "شوربة عدس دافئة بالليمون والخبز الأسمر المحمص",
        category: "عشاء",
        ingredients: "عدس أصفر 100ج + بصل وجزر وثوم 60ج + زيت زيتون 5ج + توست أسمر محمص 20ج",
        calories: 260,
        protein: 16,
        carbs: 38,
        fats: 5,
        tags: ["مريح للمعدة"],
        img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500"
    },
    {
        id: "m_d_4",
        name: "جبن قريش بالطماطم وزيت الزيتون والزعتر والخبز البر",
        category: "عشاء",
        ingredients: "جبن قريش 150ج + طماطم مكعبات 100ج + زيت زيتون 10ج + زعتر + خبز بر 30ج",
        calories: 240,
        protein: 26,
        carbs: 8,
        fats: 11,
        tags: ["كازين بطيء الامتصاص للنوم"],
        img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500"
    },
    {
        id: "m_d_5",
        name: "سلطة الدجاج المشوي بالخضار الورقية والبلسمك",
        category: "عشاء",
        ingredients: "صدور دجاج مسحب 120ج + جرجير وخس وطماطم شيري 120ج + زيت زيتون وخل بلسمي 8ج",
        calories: 340,
        protein: 38,
        carbs: 12,
        fats: 15,
        tags: ["تنشيف"],
        img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500"
    },
    {
        id: "m_d_6",
        name: "خضار مشوية مع دجاج مفروم معصج خالي الدسم",
        category: "عشاء",
        ingredients: "دجاج مفروم خالي الدسم 100ج + كوسة وباذنجان وفلفل مشوي 150ج + زيت 6ج",
        calories: 330,
        protein: 32,
        carbs: 18,
        fats: 12,
        tags: ["شبع عالي"],
        img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500"
    },
    {
        id: "m_d_7",
        name: "ساندويتش التونة بالمايونيز اللايت والخس المقرمش",
        category: "عشاء",
        ingredients: "تونا 120ج + مايونيز لايت 15ج + خس مقرمش + خبز أسمر 60ج",
        calories: 350,
        protein: 30,
        carbs: 32,
        fats: 10,
        tags: ["سهل وسريع"],
        img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500"
    },
    {
        id: "m_d_8",
        name: "بيض مقلي بمسحة زيت مع خبز أسمر وخضار طازجة",
        category: "عشاء",
        ingredients: "بيض 120ج (حبتين ونصف) + زيت زيتون 8ج + خبز أسمر 50ج + خيار وطماطم",
        calories: 290,
        protein: 18,
        carbs: 24,
        fats: 14,
        tags: ["عشاء كلاسيكي"],
        img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500"
    },
    {
        id: "m_d_9",
        name: "شوربة خضار مشكلة بقطع الدجاج الصغير",
        category: "عشاء",
        ingredients: "صدور دجاج مكعبات 100ج + جزر وكوسة وبازلاء 120ج + مرقة دجاج خفيفة وزيت 5ج",
        calories: 220,
        protein: 24,
        carbs: 18,
        fats: 5,
        tags: ["خفيف جداً"],
        img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500"
    },
    {
        id: "m_d_10",
        name: "سلطة الحمص المسلوق بالخضار وعصير الليمون",
        category: "عشاء",
        ingredients: "حمص حب مسلوق 120ج + طماطم وخيار وبقدونس 100ج + زيت زيتون 7ج وعصير ليمون",
        calories: 280,
        protein: 14,
        carbs: 42,
        fats: 7,
        tags: ["نباتي"],
        img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500"
    },
    {
        id: "m_d_11",
        name: "رول الدجاج المسلوق المنسل مع الجزر والخس بالتورتيلا",
        category: "عشاء",
        ingredients: "صدور دجاج مسلوقة 110ج + خس وجزر مبشور 60ج + خبز تورتيلا بر 50ج",
        calories: 310,
        protein: 32,
        carbs: 26,
        fats: 8,
        tags: ["خفيف"],
        img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500"
    },
    {
        id: "m_d_12",
        name: "سلطة السلمون المدخن مع الجرجير والجبن الكريمي اللايت",
        category: "عشاء",
        ingredients: "سلمون مدخن 80ج + جرجير طازج 80ج + شرائح خيار 60ج + جبن كريمي لايت 15ج",
        calories: 290,
        protein: 28,
        carbs: 10,
        fats: 15,
        tags: ["فخم وخفيف"],
        img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500"
    },
    {
        id: "m_d_13",
        name: "فول بالحمص والكمون وزيت الزيتون والخبز الأسمر",
        category: "عشاء",
        ingredients: "فول مسلوق 100ج + حمص مسلوق 50ج + زيت زيتون 7ج + خبز أسمر 40ج",
        calories: 310,
        protein: 16,
        carbs: 42,
        fats: 9,
        tags: ["شبع طويل"],
        img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500"
    },
    {
        id: "m_d_14",
        name: "شوربة الشوفان بالدجاج والطماطم الطبيعية",
        category: "عشاء",
        ingredients: "شوفان 30ج + صدور دجاج مسلوقة 90ج + طماطم مطحونة 60ج + زيت 5ج",
        calories: 270,
        protein: 22,
        carbs: 30,
        fats: 6,
        tags: ["دافئ"],
        img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500"
    },
    {
        id: "m_d_15",
        name: "ساندويتش اللبنة والزعتر مع شرائح الخيار بالخبز البر",
        category: "عشاء",
        ingredients: "خبز بر 60ج + لبنة قليل الدسم 50ج + زعتر وزيت زيتون 5ج + شرائح خيار",
        calories: 250,
        protein: 13,
        carbs: 30,
        fats: 9,
        tags: ["سريع"],
        img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500"
    },
    {
        id: "m_d_16",
        name: "جبن حلوم مشوي قليل الملح مع الطماطم المشوية والنعناع",
        category: "عشاء",
        ingredients: "جبن حلوم قليل الملح 60ج + طماطم مشوية 100ج + زيت زيتون 5ج + خبز أسمر 30ج",
        calories: 320,
        protein: 20,
        carbs: 8,
        fats: 23,
        tags: ["لذيذ ومميز"],
        img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500"
    },
    {
        id: "m_d_17",
        name: "سلطة الكينوا بالخضار المفرومة وزيت الزيتون والليمون",
        category: "عشاء",
        ingredients: "كينوا مطبوخة 100ج + طماطم وبقدونس وخيار 100ج + زيت زيتون 8ج وعصير ليمون",
        calories: 280,
        protein: 10,
        carbs: 44,
        fats: 8,
        tags: ["نباتي متكامل"],
        img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500"
    },
    {
        id: "m_d_18",
        name: "صدور دجاج مسلوقة ومتبلة مع سلطة خضراء خفيفة",
        category: "عشاء",
        ingredients: "صدور دجاج مسلوقة 140ج + خس وطماطم وخيار 100ج + مسحة زيت زيتون وليمون 5ج",
        calories: 290,
        protein: 40,
        carbs: 8,
        fats: 10,
        tags: ["تنشيف صارم"],
        img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500"
    },
    {
        id: "m_d_19",
        name: "بيض مسلوق مع سلطة خضراء متكاملة وزيت الزيتون",
        category: "عشاء",
        ingredients: "بيض مسلوق 120ج (حبتين ونصف) + خس جرجير خيار 120ج + زيت زيتون 8ج",
        calories: 230,
        protein: 16,
        carbs: 10,
        fats: 14,
        tags: ["اقتصادي"],
        img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500"
    },
    {
        id: "m_d_20",
        name: "شوربة البروكلي الخفيفة بالدجاج وحليب خالي الدسم",
        category: "عشاء",
        ingredients: "بروكلي مطحون 120ج + صدور دجاج مكعبات 90ج + حليب خالي الدسم 100مل + نشا 8ج",
        calories: 280,
        protein: 25,
        carbs: 18,
        fats: 11,
        tags: ["كريمي وصحي"],
        img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500"
    },
    {
        id: "m_d_21",
        name: "سلطة الفاصوليا البيضاء بالبصل والبقدونس وزيت الزيتون",
        category: "عشاء",
        ingredients: "فاصوليا بيضاء مسلوقة 100ج + بصل طماطم بقدونس 80ج + زيت زيتون 6ج وخل",
        calories: 290,
        protein: 15,
        carbs: 45,
        fats: 6,
        tags: ["ألياف عالية"],
        img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500"
    },
    {
        id: "m_d_22",
        name: "ساندويتش جبنة الفيتا والزعتر بالخبز الأسمر والطماطم",
        category: "عشاء",
        ingredients: "خبز بر 60ج + جبن فتا 40ج + طماطم شرائح وزيت زيتون 6ج + زعتر",
        calories: 300,
        protein: 16,
        carbs: 32,
        fats: 12,
        tags: ["سريع"],
        img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500"
    },
    {
        id: "m_d_23",
        name: "عشاء خفيف من الزبادي الطبيعي والخيار المفروم والنعناع",
        category: "عشاء",
        ingredients: "زبادي طبيعي 200ج + خيار مبشور 100ج + فص ثوم مهروس ونعناع مجفف",
        calories: 180,
        protein: 14,
        carbs: 18,
        fats: 5,
        tags: ["خفيف جداً قبل النوم"],
        img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500"
    },
    {
        id: "m_d_24",
        name: "متبل الباذنجان المشوي بالزبادي والطحينة والخبز الأسمر",
        category: "عشاء",
        ingredients: "باذنجان مشوي 150ج + زبادي خفيف 40ج + طحينة 10ج + خبز أسمر 40ج",
        calories: 270,
        protein: 8,
        carbs: 38,
        fats: 10,
        tags: ["شامي أصيل"],
        img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500"
    },
    {
        id: "m_d_25",
        name: "شوربة الطماطم الطبيعية مع قطع التوست الأسمر المحمص",
        category: "عشاء",
        ingredients: "عصير طماطم طبيعي 250مل + ثوم وبصل 30ج + زيت زيتون 5ج + مكعبات توست 20ج",
        calories: 240,
        protein: 8,
        carbs: 40,
        fats: 6,
        tags: ["مريح وخفيف"],
        img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500"
    },

    // ==========================================
    // وجبات السناكس والخفيفة (15 وجبة)
    // ==========================================
    {
        id: "m_s_1",
        name: "زبادي يوناني بالتوت واللوز المحمص",
        category: "سناكس",
        ingredients: "زبادي يوناني 150ج + توت مشكل 40ج + لوز محمص مجروش 15ج",
        calories: 220,
        protein: 20,
        carbs: 16,
        fats: 9,
        tags: ["سناك بروتيني"],
        img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500"
    },
    {
        id: "m_s_2",
        name: "سموذي الموز والواي بروتين بالحليب",
        category: "سناكس",
        ingredients: "موزة متوسطة 80ج + واي بروتين 25ج + حليب خالي الدسم 200مل",
        calories: 280,
        protein: 24,
        carbs: 40,
        fats: 5,
        tags: ["بعد التمرين"],
        img: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=500"
    },
    {
        id: "m_s_3",
        name: "كرات الطاقة بالشوفان والتمر وزبدة الفول السوداني",
        category: "سناكس",
        ingredients: "تمر منزوع النوى 40ج + شوفان مطحون 30ج + زبدة فول سوداني 10ج",
        calories: 210,
        protein: 6,
        carbs: 32,
        fats: 7,
        tags: ["طاقة قبل التمرين"],
        img: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500"
    },
    {
        id: "m_s_4",
        name: "شرائح التفاح بزبدة اللوز ورشة قرفة",
        category: "سناكس",
        ingredients: "تفاحة متوسطة 120ج + زبدة اللوز 15ج + رشة قرفة",
        calories: 200,
        protein: 5,
        carbs: 26,
        fats: 10,
        tags: ["سريع"],
        img: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500"
    },
    {
        id: "m_s_5",
        name: "مزيج المكسرات النيئة والفواكه المجففة",
        category: "سناكس",
        ingredients: "مكسرات مشكلة نيئة 25ج + زبيب أو تين مجفف 20ج",
        calories: 250,
        protein: 8,
        carbs: 22,
        fats: 15,
        tags: ["دهون صحية"],
        img: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500"
    },
    {
        id: "m_s_6",
        name: "بار بروتين الشوكولاتة الداكنة الصحي",
        category: "سناكس",
        ingredients: "بار بروتين غني بالألياف والشوكولاتة الداكنة 50ج",
        calories: 210,
        protein: 20,
        carbs: 18,
        fats: 6,
        tags: ["محمول ومريح"],
        img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500"
    },
    {
        id: "m_s_7",
        name: "بودنج الشيا بالفانيليا والموز وحليب اللوز",
        category: "سناكس",
        ingredients: "بذور الشيا 25ج + حليب لوز 180مل + فانيليا + شرائح موز 40ج",
        calories: 230,
        protein: 7,
        carbs: 28,
        fats: 11,
        tags: ["أوميغا 3"],
        img: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=500"
    },
    {
        id: "m_s_8",
        name: "فشار منزلي بدون زيت بالكمون الخفيف",
        category: "سناكس",
        ingredients: "حبوب ذرة الفشار 40ج (تنفش بالهواء الساخن بدون دهن)",
        calories: 150,
        protein: 4,
        carbs: 30,
        fats: 2,
        tags: ["شبع عالي وسعرات قليلة"],
        img: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=500"
    },
    {
        id: "m_s_9",
        name: "شرائح الجزر والخيار المقرمشة مع صوص الحمص",
        category: "سناكس",
        ingredients: "جزر وخيار شرائح 150ج + صوص حمص بالطحينة 40ج",
        calories: 180,
        protein: 7,
        carbs: 25,
        fats: 6,
        tags: ["مقرمش وخفيف"],
        img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500"
    },
    {
        id: "m_s_10",
        name: "مشروب كاكاو خام ساخن بحليب اللوز وبروتين الشوكولاتة",
        category: "سناكس",
        ingredients: "حليب اللوز 250مل + كاكاو خام 10ج + واي بروتين شوكولاتة 20ج",
        calories: 190,
        protein: 22,
        carbs: 16,
        fats: 4,
        tags: ["دافئ ولذيذ"],
        img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500"
    },
    {
        id: "m_s_11",
        name: "براونيز البروتين الصحي بدقيق الشوفان والعسل",
        category: "سناكس",
        ingredients: "دقيق شوفان 30ج + كاكاو 15ج + واي بروتين 20ج + بياض بيض 40ج + عسل 10ج",
        calories: 240,
        protein: 18,
        carbs: 24,
        fats: 8,
        tags: ["حلى صحي"],
        img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500"
    },
    {
        id: "m_s_12",
        name: "موز مشوي بالقرفة ومكسرات عين الجمل",
        category: "سناكس",
        ingredients: "موزة مقطعة طولياً 90ج + جوز (عين جمل) 12ج + قرفة",
        calories: 220,
        protein: 4,
        carbs: 36,
        fats: 8,
        tags: ["حلى شتوي"],
        img: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500"
    },
    {
        id: "m_s_13",
        name: "زبادي طبيعي مع بذور الشيا والعسل الطبيعي",
        category: "سناكس",
        ingredients: "زبادي طبيعي 150ج + بذور الشيا 12ج + عسل 10ج",
        calories: 190,
        protein: 12,
        carbs: 26,
        fats: 5,
        tags: ["سريع"],
        img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500"
    },
    {
        id: "m_s_14",
        name: "مكسرات الكاجو المحمصة بدون ملح إضافي",
        category: "سناكس",
        ingredients: "كاجو محمص بدون ملح 35ج",
        calories: 260,
        protein: 8,
        carbs: 20,
        fats: 18,
        tags: ["طاقة ودهون مفيدة"],
        img: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500"
    },
    {
        id: "m_s_15",
        name: "عصير التوت البري والواي بروتين الصافي بالماء البارد",
        category: "سناكس",
        ingredients: "توت بري مجمد 80ج + واي بروتين فانيليا 25ج + ماء بارد 200مل",
        calories: 170,
        protein: 25,
        carbs: 14,
        fats: 2,
        tags: ["قليل السعرات", "انتعاش"],
        img: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=500"
    }
];

// وظائف الوجبات المخصصة المتزامنة مع Supabase مع عزل بيانات كل مشترك
function getMealsDatabase() {
    const parsed = (typeof IronSupabase !== "undefined" && Array.isArray(IronSupabase.cache.customMeals))
        ? IronSupabase.cache.customMeals
        : [];
    const currentUser = (typeof IronAuth !== "undefined" && IronAuth.getCurrentUser) ? IronAuth.getCurrentUser() : null;
    const visibleCustom = parsed.filter(m => {
        if (!m.ownerId || m.ownerId === "coach") return true;
        if (currentUser && currentUser.role === "coach") return true;
        return currentUser && currentUser.id && m.ownerId === currentUser.id;
    });
    return [...defaultMealsData, ...visibleCustom];
}

async function saveCustomMeal(meal) {
    const currentUser = (typeof IronAuth !== "undefined" && IronAuth.getCurrentUser) ? IronAuth.getCurrentUser() : null;
    if (typeof IronSupabase !== "undefined" && IronSupabase.isAvailable()) {
        const inserted = await IronSupabase.insertCustomMeal(meal, currentUser);
        if (inserted) return inserted;
    }
    meal.id = "custom_" + Date.now();
    meal.ownerId = currentUser && currentUser.role === "trainee" && currentUser.id ? currentUser.id : "coach";
    if (typeof IronSupabase !== "undefined") {
        IronSupabase.cache.customMeals.push(meal);
    }
    return meal;
}
