/**
 * IronCoach Pro - Complete English Dataset & Dynamic Translator
 * قاعدة الترجمة الكاملة للـ 100 وجبة، الـ 58 تمريناً، وأسماء وبيانات العملاء باللغة الإنجليزية
 */

const IronI18nEn = {
    meals: {
        m_b_1: { name: "Spinach & Feta Omelette", ingredients: "Whole eggs 150g (3) + Egg whites 80g + Fresh spinach 60g + Light feta cheese 30g + Olive oil 5g" },
        m_b_2: { name: "Power Oatmeal with Fruit & Peanut Butter", ingredients: "Rolled oats 50g + Skim milk 200ml + Banana 60g + Fresh berries 40g + Peanut butter 15g" },
        m_b_3: { name: "Golden Oat Protein Pancakes", ingredients: "Oat flour 45g + Whey protein 30g + Egg whites 90g + Skim milk 100ml" },
        m_b_4: { name: "Whole-Wheat Avocado Toast & Boiled Eggs", ingredients: "Toasted whole-wheat bread 60g (2 slices) + Mashed avocado 50g + Boiled eggs 100g (2)" },
        m_b_5: { name: "Yogurt, Oats & Honey Breakfast Bowl", ingredients: "Light Greek yogurt 150g + Toasted oats 35g + Natural honey 12g + Mixed berries 40g + Sliced almonds 10g" },
        m_b_6: { name: "Healthy Olive-Oil Shakshuka", ingredients: "Eggs 150g (3) + Chopped fresh tomatoes 150g + Onion & bell pepper 40g + Extra-virgin olive oil 7g + Whole-wheat pita half 30g" },
        m_b_7: { name: "Almond-Milk Blackberry Chia Pudding", ingredients: "Chia seeds 30g + Almond milk 200ml + Mixed berries 60g + Natural honey 10g" },
        m_b_8: { name: "Healthy Date, Oat & Protein Squares", ingredients: "Mashed pitted dates 45g + Rolled oats 35g + Peanut butter 12g + Whey protein 25g" },
        m_b_9: { name: "Whole-Wheat Bread Omelette Sandwich", ingredients: "Whole-wheat toast 60g + Eggs 100g (2) + Lettuce & tomato 50g + Olive oil drizzle 5g" },
        m_b_10: { name: "Cinnamon Whole-Grain Muesli & Milk", ingredients: "Whole-grain muesli & oats 45g + Skim milk 250ml + Raisins 15g + Sliced almonds 10g & cinnamon" },
        m_b_11: { name: "Baked Mushroom & Egg-White Frittata", ingredients: "Egg whites 180g + Whole egg 50g + Sliced mushrooms 70g + Bell pepper & onion 60g + Olive oil 5g" },
        m_b_12: { name: "Quick Banana & Oat Pancakes", ingredients: "Ripe banana 80g + Eggs 100g (2) + Oat flour 35g + Crushed almonds 10g" },
        m_b_13: { name: "Protein Whole-Wheat French Toast", ingredients: "Whole-wheat bread 60g (2 slices) + Egg whites 100g with cinnamon + Vanilla whey protein 20g + Skim milk 60ml + Natural honey 10g" },
        m_b_14: { name: "Greek Yogurt with Flaxseed, Honey & Almonds", ingredients: "Greek yogurt 180g + Ground flaxseed 10g + Honey 12g + Roasted almonds 10g" },
        m_b_15: { name: "Cottage Cheese, Tomato & Olive Oil Plate", ingredients: "Low-fat cottage cheese 150g + Cherry tomatoes 80g + Sliced cucumber 60g + Olive oil 6g + Whole-wheat bread 30g" },
        m_b_16: { name: "Scrambled Eggs with Veggies & Tahini", ingredients: "Eggs 100g (2) + Egg whites 60g + Grated zucchini & carrot 80g + Sesame tahini 12g + Brown bread 30g" },
        m_b_17: { name: "Green Kiwi & Spinach Protein Smoothie", ingredients: "Vanilla whey protein 30g + Fresh spinach 40g + Kiwi & banana 70g + Almond milk 220ml" },
        m_b_18: { name: "Warm Whole-Wheat Porridge with Cinnamon", ingredients: "Boiled whole wheat berries 140g + Skim milk 200ml + Honey 10g & cinnamon" },
        m_b_19: { name: "Spanish Egg & Light-Cheese Tortilla", ingredients: "Eggs 100g (2) + Diced boiled potato 80g + Light mozzarella 25g + Olive oil 5g" },
        m_b_20: { name: "Healthy Oat & Cottage Cheese Crepes", ingredients: "Oat flour 40g + Cottage cheese 90g + Whole egg 50g + Fresh berries 40g" },
        m_b_21: { name: "Egyptian Ful Medames with Olive Oil & Bread", ingredients: "Cooked fava beans 180g + Olive oil 8g, lemon & cumin + Diced tomato & parsley 60g + Whole-wheat bread 45g" },
        m_b_22: { name: "Strained Labneh with Thyme, Olive Oil & Pita", ingredients: "Low-fat labneh 80g + Olive oil & zaatar 6g + Whole-wheat bread 60g + Cucumber & tomato 60g" },
        m_b_23: { name: "Whole-Grain Flakes with Almond Milk & Almonds", ingredients: "Whole-grain cereal flakes 50g + Almond milk 250ml + Toasted sliced almonds 12g" },
        m_b_24: { name: "Tropical Mango & Chia Protein Smoothie", ingredients: "Frozen mango 110g + Vanilla whey protein 28g + Almond milk 200ml + Chia seeds 10g" },
        m_b_25: { name: "Baked Oat & Whey Protein Muffins", ingredients: "Oat flour 40g + Whey protein 28g + Skim milk 80ml + Egg whites 60g + Berries 30g" },
        m_l_1: { name: "Grilled Chicken Breast with Basmati Rice & Broccoli", ingredients: "Grilled chicken breast 150g + Cooked basmati rice 150g + Steamed broccoli & carrots 100g + Olive oil 6g" },
        m_l_2: { name: "Baked Herb Salmon with Potatoes & Vegetables", ingredients: "Grilled salmon fillet 150g + Boiled potatoes 150g + Roasted fennel & tomatoes 100g + Light herb butter 8g" },
        m_l_3: { name: "Mushroom Beef Steak with Sweet Potato", ingredients: "Grilled lean beef steak 150g + Roasted sweet potato 130g + Fresh mushrooms 80g + Olive oil 8g" },
        m_l_4: { name: "Healthy Coconut Curry Chicken with Quinoa", ingredients: "Chicken breast 140g + Cooked quinoa 140g + Light coconut milk 60ml + Curry spices & onion 60g" },
        m_l_5: { name: "Baked Lemon-Herb Fish Fillet with Rice", ingredients: "Grilled white fish fillet 180g + Cooked white rice 130g + Peppers & greens 100g + Olive oil 8g" },
        m_l_6: { name: "Healthy Basmati Chicken Kabsa", ingredients: "Skinless grilled chicken 150g + Cooked basmati rice 160g + Tomatoes & kabsa spices 80g + Olive oil 7g" },
        m_l_7: { name: "Whole-Wheat Penne Arrabiata with Chicken", ingredients: "Dry whole-wheat pasta 65g + Grilled chicken breast 140g + Natural arrabiata tomato sauce 110g + Olive oil 5g" },
        m_l_8: { name: "Lean Spiced Beef & Bulgur Bowl", ingredients: "Cooked extra-lean beef 140g + Cooked bulgur 140g + Light garlic yogurt 60g + Olive oil 6g" },
        m_l_9: { name: "Garlic-Parsley Shrimp & Rice Skillet", ingredients: "Cooked peeled shrimp 170g + Cooked rice 150g + Pepper, tomato & parsley 80g + Olive oil 6g" },
        m_l_10: { name: "French-Onion Chicken with Mashed Potatoes & Carrots", ingredients: "Oven-baked chicken breast 150g + Mashed potatoes 140g + Roasted carrots & onion 90g + Olive oil 7g" },
        m_l_11: { name: "Healthy Chicken Shawarma with Garlic Yogurt Sauce", ingredients: "Grilled chicken shawarma slices 150g + Whole-wheat tortilla 60g + Greek yogurt garlic sauce 40g + Fresh veggies 80g" },
        m_l_12: { name: "Lean Beef Steak Fajita Platter", ingredients: "Sliced lean beef steak 140g + Grilled bell peppers & onion 120g + Whole-wheat tortilla 55g + Olive oil 6g" },
        m_l_13: { name: "Orange-Glazed Chicken with Steamed Rice", ingredients: "Grilled chicken breast 150g + Fresh orange juice & light soy 70ml + Cooked basmati rice 140g + Olive oil 5g" },
        m_l_14: { name: "Honey Teriyaki Salmon with Brown Rice", ingredients: "Grilled salmon fillet 150g + Cooked brown rice 140g + Broccoli & zucchini 100g + Honey teriyaki glaze 10g" },
        m_l_15: { name: "Grilled Chicken & Halloumi Burger", ingredients: "Grilled chicken breast patty 140g + Grilled light halloumi 30g + Whole-wheat burger bun 60g + Lettuce, tomato & pickles 70g" },
        m_l_16: { name: "Baked Eggplant Moussaka with Lean Beef", ingredients: "Oven-roasted eggplant 160g + Cooked extra-lean ground beef 120g + Natural tomato sauce 90g + Olive oil 7g + Whole-wheat bread 30g" },
        m_l_17: { name: "Spiced Tandoori Chicken with Basmati Rice", ingredients: "Grilled tandoori chicken 160g + Yogurt spice marinade 40g + Basmati rice 140g + Oil 6g" },
        m_l_18: { name: "Healthy Chicken Maqluba with Roasted Veggies", ingredients: "Roasted chicken breast 150g + Basmati rice 150g + Roasted eggplant & cauliflower 100g + Olive oil 6g" },
        m_l_19: { name: "Beef & Broccoli Stir-Fry with Brown Rice", ingredients: "Lean beef strips 150g + Fresh steamed broccoli 120g + Cooked brown rice 130g + Olive/sesame oil 6g" },
        m_l_20: { name: "Spanish White Beans with Chicken Stew", ingredients: "Diced chicken breast 130g + Cooked white beans 140g + Tomato, onion & garlic 80g + Olive oil 6g" },
        m_l_21: { name: "Steamed Herb White Fish with Boiled Potatoes", ingredients: "Steamed white fish fillet 180g + Boiled potatoes 150g + Greens & ginger 100g + Olive oil 6g" },
        m_l_22: { name: "Creamy Light-Mustard Chicken with Rice", ingredients: "Grilled chicken breast 150g + Light mustard herb sauce 25g + Greek yogurt 35g + Cooked rice 140g + Olive oil 5g" },
        m_l_23: { name: "Light Chicken Alfredo Primavera Pasta", ingredients: "Whole-wheat pasta 60g + Chicken breast 140g + Skim milk 120ml + Light cheese 25g + Broccoli, peas & carrot 80g" },
        m_l_24: { name: "Chilli-Ginger Grilled Lean Lamb Chops", ingredients: "Grilled lean lamb 150g + Roasted potatoes 130g + Grilled zucchini & peppers 100g + Olive oil 6g" },
        m_l_25: { name: "Spiced Chicken with Rice & Red Beans", ingredients: "Grilled spiced chicken 150g + Cooked rice 130g + Cooked red beans 60g + Olive oil 5g" },
        m_l_26: { name: "Chicken Quinoa Greek Salad Bowl", ingredients: "Grilled chicken breast 150g + Cooked quinoa 120g + Feta cheese 25g + Cucumber & tomato 120g + Olive oil 6g" },
        m_l_27: { name: "Honey Balsamic Chicken with Broccoli & Potatoes", ingredients: "Grilled chicken breast 155g + Oven-roasted potatoes 130g + Crispy roasted broccoli 110g + Honey balsamic glaze 10g + Olive oil 5g" },
        m_l_28: { name: "Baked Lean Beef Kofta Tray", ingredients: "Lean beef kofta 150g + Sliced potatoes 120g + Tomato puree & onion 100g + Olive oil 6g" },
        m_l_29: { name: "Healthy Smoked Chicken Mandi", ingredients: "Mandi-spiced roast chicken 160g + Cooked basmati rice 150g + Fresh tomato dakkous salsa 70g + Olive oil 6g" },
        m_l_30: { name: "Salmon & Avocado Salad Bowl", ingredients: "Grilled salmon fillet 150g + Sliced avocado 55g + Greens & cucumber 130g + Whole-wheat toast 30g" },
        m_l_31: { name: "Smoky Chicken Skewers with Roasted Potatoes", ingredients: "Grilled marinated chicken skewers 165g + Roasted potatoes 130g + Grilled peppers & onion 90g + Olive oil 6g" },
        m_l_32: { name: "Lean Beef Mandi with Basmati Rice", ingredients: "Tender roast lean beef 150g + Basmati rice 150g + Spices & roasted onion 50g + Olive oil 6g" },
        m_l_33: { name: "Healthy Chicken Fried Rice", ingredients: "Diced chicken breast 150g + Cooked rice 160g + Peas, carrot & scallions 100g + Oil 6g" },
        m_l_34: { name: "Lemon-Herb Lamb Souvlaki Skewers", ingredients: "Grilled lemon-herb lamb skewers 150g + Basmati rice 120g + Fresh green salad 100g + Olive oil 5g" },
        m_l_35: { name: "Beef Steak & Baked Potato Wedges", ingredients: "Grilled lean beef steak 160g + Oven-baked potato wedges 160g + Olive oil & herbs 7g" },
        m_d_1: { name: "Tuna Nicoise Protein Salad", ingredients: "Water-drained tuna 130g + Boiled egg 50g + Avocado 40g + Greens, tomato & green beans 140g" },
        m_d_2: { name: "Healthy Smoked Turkey Club Sandwich", ingredients: "Whole-wheat toast 65g + Smoked turkey slices 100g + Light cheddar cheese 20g + Lettuce & tomato 70g" },
        m_d_3: { name: "Warm Egyptian Lentil Soup & Whole-Wheat Croutons", ingredients: "Cooked yellow lentils 180g + Carrot, onion & garlic 80g + Olive oil 5g + Whole-wheat croutons 25g" },
        m_d_4: { name: "Authentic Greek Feta & Tomato Salad", ingredients: "Feta cheese 50g + Fresh tomatoes 120g + Cucumber & onion 80g + Extra-virgin olive oil 8g + Brown bread 30g" },
        m_d_5: { name: "Grilled Chicken Caesar Salad", ingredients: "Sliced grilled chicken breast 130g + Crisp romaine lettuce 130g + Light grated cheese 15g + Olive oil & lemon 7g + Toasted croutons 25g" },
        m_d_6: { name: "Grilled Eggplant & Hummus Plate", ingredients: "Grilled eggplant 160g + Chickpea hummus 90g + Olive oil 5g + Whole-wheat pita 40g" },
        m_d_7: { name: "Light Mayo Tuna Whole-Wheat Sandwich", ingredients: "Water-packed tuna 120g + Light mayonnaise 15g + Lettuce & pickles 60g + Whole-wheat bread 60g" },
        m_d_8: { name: "Light Olive-Oil Fried Eggs with Whole-Wheat Toast", ingredients: "Eggs 100g (2) + Egg whites 60g + Olive oil 6g + Whole-wheat bread 50g + Tomato & cucumber 80g" },
        m_d_9: { name: "Light Chicken & Vegetable Broth Soup", ingredients: "Diced boiled chicken breast 110g + Carrot, celery & zucchini 140g + Olive oil 5g + Toast 20g" },
        m_d_10: { name: "Colorful Chickpea & Bean Protein Salad", ingredients: "Boiled chickpeas 100g + Red kidney beans 70g + Peppers, parsley & tomato 100g + Olive oil & lemon 7g" },
        m_d_11: { name: "Smoked Chicken & Avocado Wrap", ingredients: "Grilled chicken slices 120g + Avocado 40g + Whole-wheat tortilla 55g + Lettuce & tomato 70g" },
        m_d_12: { name: "Fresh Shredded Chicken Crunch Salad", ingredients: "Shredded boiled chicken 130g + Cabbage, carrot, cucumber & mint 160g + Sesame oil & lime 6g + Crushed nuts 8g" },
        m_d_13: { name: "Baked Falafel Pita with Tahini", ingredients: "Oven-baked falafel 90g (3 pcs) + Light tahini sauce 15g + Whole-wheat pita 50g + Tomato, parsley & cucumber 90g" },
        m_d_14: { name: "Turkish Spiced Red Lentil Soup", ingredients: "Cooked red lentils 160g + Tomato & dried mint 60g + Olive oil 6g + Toasted bread 30g" },
        m_d_15: { name: "Greek-Yogurt Chicken Salad Sandwich", ingredients: "Diced chicken breast 120g + Greek yogurt & mustard 45g + Whole-wheat bread 60g + Celery & lettuce 60g" },
        m_d_16: { name: "Grilled Low-Salt Halloumi & Roasted Tomatoes", ingredients: "Low-salt light halloumi 75g + Grilled tomatoes 100g + Olive oil 5g + Whole-wheat bread 35g" },
        m_d_17: { name: "Authentic Lebanese Tabbouleh Salad", ingredients: "Parsley, tomato & mint 160g + Cooked bulgur 110g + Olive oil & lemon 10g + Grilled chicken strips 80g" },
        m_d_18: { name: "Healthy Lebanese Fattoush with Grilled Chicken", ingredients: "Lettuce, cucumber & tomato 150g + Toasted brown pita chips 35g + Olive oil & pomegranate 8g + Grilled chicken breast 90g" },
        m_d_19: { name: "Light Greek-Yogurt Egg Salad Bowl", ingredients: "Boiled eggs 150g (3) + Greek yogurt & mustard 40g + Lettuce & celery 100g + Whole-wheat toast 30g" },
        m_d_20: { name: "Light Cream of Broccoli & Chicken Soup", ingredients: "Blended broccoli 140g + Boiled chicken cubes 100g + Skim milk 120ml + Cornstarch 8g & herbs" },
        m_d_21: { name: "Greek Baked Giant White Beans (Gigantes)", ingredients: "Cooked giant white beans 180g + Natural tomato sauce 100g + Olive oil 8g + Whole-wheat bread 30g" },
        m_d_22: { name: "Soft-Boiled Eggs with Toast & Cucumber", ingredients: "Soft-boiled eggs 150g (3) + Toasted brown bread strips 45g + Cucumber & tomato 100g" },
        m_d_23: { name: "Light Cucumber & Mint Yogurt Tzatziki", ingredients: "Greek yogurt 180g + Grated cucumber 120g + Olive oil, mint & garlic 5g + Whole-wheat pita 35g" },
        m_d_24: { name: "Smoky Baba Ghanoush with Whole-Wheat Pita", ingredients: "Mashed roasted eggplant 180g + Sesame tahini 18g + Light yogurt 40g + Whole-wheat pita 45g" },
        m_d_25: { name: "Roasted Fresh Tomato Soup & Toast", ingredients: "Fresh basil tomato soup 220g + Olive oil 6g + Toasted whole-wheat bread 40g + Cottage cheese topping 50g" },
        m_s_1: { name: "Greek Yogurt & Fresh Berry Parfait", ingredients: "Greek yogurt 150g + Fresh strawberries & berries 80g + Honey 10g" },
        m_s_2: { name: "Strawberry & Whey Milkshake", ingredients: "Fresh strawberries 100g + Vanilla whey protein 28g + Skim milk 220ml" },
        m_s_3: { name: "Dates Stuffed with Raw Almonds", ingredients: "Dates 55g (4 pcs) + Raw almonds 15g" },
        m_s_4: { name: "Fresh Apple Slices with Almond Butter", ingredients: "Medium apple 150g + Natural almond butter 18g" },
        m_s_5: { name: "Unsalted Raw Mixed Nuts Bowl", ingredients: "Unsalted mixed nuts 35g + Raisins 15g" },
        m_s_6: { name: "High-Fiber Chocolate Protein Bar", ingredients: "Protein bar 55g" },
        m_s_7: { name: "Fresh Fruit Salad with Chia Seeds", ingredients: "Banana, apple & berries 70g + Mango & kiwi 90g + Chia seeds 12g" },
        m_s_8: { name: "Air-Popped Oil-Free Spiced Popcorn", ingredients: "Popcorn kernels 45g air-popped" },
        m_s_9: { name: "Lebanese Hummus Dip with Fresh Veggies", ingredients: "Chickpea hummus 80g + Carrot & cucumber sticks 120g + Olive oil drizzle 4g" },
        m_s_10: { name: "Chocolate Milk Whey Protein Shake", ingredients: "Skim milk 250ml + Raw cacao powder 10g + Chocolate whey protein 28g" },
        m_s_11: { name: "Healthy Oat & Cocoa Protein Brownies", ingredients: "Oat flour 30g + Raw cacao 12g + Whey protein 22g + Egg whites 45g + Honey 10g" },
        m_s_12: { name: "Baked Cinnamon Banana with Walnuts", ingredients: "Ripe banana 110g + Walnuts 12g + Honey 5g & cinnamon" },
        m_s_13: { name: "Walnuts, Honey & Natural Yogurt Cup", ingredients: "Natural yogurt 140g + Walnuts 15g + Honey 10g" },
        m_s_14: { name: "Unsalted Roasted Almonds & Pistachios", ingredients: "Roasted almonds 20g + Roasted pistachios 18g" },
        m_s_15: { name: "Blueberry & Whey Protein Isolate Shake", ingredients: "Blueberries 90g + Whey isolate 30g + Almond milk 150ml" }
    },

    exercises: {
        ex_ch_1: {
            equipment: "Barbell & Flat Bench",
            setup: "Lie flat on the bench with feet planted firmly on the floor, retract and depress your shoulder blades, and grip the bar slightly wider than shoulder width.",
            execution: "Lower the bar with controlled eccentric tempo toward the lower sternum keeping elbows tucked 45–75°, then press forcefully upward while keeping shoulder blades locked.",
            mistakes: ["Flaring elbows out to 90° placing heavy stress on shoulder joints", "Bouncing the bar off your chest", "Lifting your hips off the bench to shorten range of motion"],
            breathing: "Inhale deeply and brace your core during descent; exhale forcefully past the sticking point on the press."
        },
        ex_ch_2: {
            equipment: "Dumbbells & Flat Bench",
            setup: "Sit at the edge of the bench with dumbbells on your thighs, kick them up as you lie back, and lock your shoulder blades down and back.",
            execution: "Lower the dumbbells smoothly for a full chest stretch at chest level, then press up in a slight arc without banging the weights together at the top.",
            mistakes: ["Uneven descent between left and right arms", "Dropping weights too fast without muscular tension", "Hard-locking the elbows at the top"],
            breathing: "Inhale as you lower the dumbbells, exhale as you press up."
        },
        ex_ch_3: {
            equipment: "Dumbbells & Incline Bench (30–45°)",
            setup: "Set bench incline to 30–45° (higher angles shift load to shoulders), plant feet firmly, and brace your upper back.",
            execution: "Lower dumbbells deeply toward your upper chest, then press up and inward squeezing the clavicular chest fibers.",
            mistakes: ["Setting bench angle to 60° turning it into a shoulder press", "Letting wrists bend backward under heavy load"],
            breathing: "Inhale on controlled descent, exhale on upward press."
        },
        ex_ch_4: {
            equipment: "Cable Crossover Machine",
            setup: "Set pulleys at chest height or slightly above, take one step forward for stability, and keep a slight fixed bend in your elbows.",
            execution: "Open arms wide for a full pec stretch, then sweep hands together in a hugging arc squeezing the chest hard at peak contraction.",
            mistakes: ["Bending and extending elbows (turning the fly into a press)", "Using torso momentum to swing the cables"],
            breathing: "Inhale while opening arms wide, exhale while bringing cables together."
        },
        ex_ch_5: {
            equipment: "Machine Chest Press",
            setup: "Adjust seat height so handles align with mid-chest, and keep your back and hips pressed tightly against the pad.",
            execution: "Press handles forward smoothly just short of elbow lockout, then return slowly over 3 seconds maintaining constant tension.",
            mistakes: ["Seat set too low or high straining the shoulder tendons", "Letting the weight stack slam between reps"],
            breathing: "Inhale as handles return, exhale as you press forward."
        },
        ex_ch_6: {
            equipment: "Parallel Dip Station",
            setup: "Grip the parallel bars, lift up and lean your torso ~30° forward with knees bent to shift tension onto lower chest rather than just triceps.",
            execution: "Lower slowly until elbows reach 90° feeling a chest stretch, then press smoothly back to the start position.",
            mistakes: ["Dropping excessively deep stressing the front shoulder capsule", "Staying completely upright (shifts load onto triceps)"],
            breathing: "Inhale on descent, exhale forcefully on ascent."
        },
        ex_ch_7: {
            equipment: "Incline Chest Press Machine",
            setup: "Adjust seat so handles align with upper chest while keeping shoulders down and feet flat.",
            execution: "Press forward and upward with control just shy of lockout, then lower smoothly without banging the stack.",
            breathing: "Exhale on press, inhale on controlled return."
        },
        ex_ch_8: {
            equipment: "Pec Deck / Fly Machine",
            setup: "Adjust seat so arms are parallel to mid-chest with a slight fixed elbow bend.",
            execution: "Bring arms together squeezing the chest for 1 second, then open slowly to a comfortable stretch.",
            breathing: "Exhale when squeezing inward, inhale when opening."
        },
        ex_bk_1: {
            equipment: "Lat Pulldown Machine",
            setup: "Lock thighs firmly under the pad, grip the bar slightly wider than shoulder width, lift chest slightly with a mild lower-back arch.",
            execution: "Pull the bar down toward your upper chest driving elbows down and inward, squeeze lats for 1 second, then reach up slowly for full stretch.",
            mistakes: ["Leaning far back and using body momentum to swing the bar", "Pulling the bar behind the neck (strains cervical spine)"],
            breathing: "Exhale as you pull down, inhale as you extend upward."
        },
        ex_bk_2: {
            equipment: "Pull-up Bar",
            setup: "Hang from the bar with an overhand wide grip, depressing and retracting shoulder blades before pulling.",
            execution: "Pull up until chin clears the bar by driving elbows down, then lower with full control.",
            mistakes: ["Kipping legs and swinging body instead of strict lat strength", "Half-reps without full bottom stretch"],
            breathing: "Exhale strongly pulling up, inhale lowering down."
        },
        ex_bk_3: {
            equipment: "Barbell & Plates",
            setup: "Stand shoulder-width apart, bend knees slightly, hinge hips back to ~45° keeping spine strictly neutral.",
            execution: "Row the bar toward your lower abdomen/navel pulling elbows up and pinching shoulder blades together, then lower smoothly.",
            mistakes: ["Rounding the lower back (disc injury risk)", "Standing upright on every rep to cheat the load"],
            breathing: "Inhale to brace before pull, exhale as you row up."
        },
        ex_bk_4: {
            equipment: "Seated Cable Row Machine",
            setup: "Plant feet on platforms with soft knees, grip handle with straight back and relaxed shoulders.",
            execution: "Pull handle toward lower stomach driving chest up and squeezing shoulder blades, then extend arms smoothly without rounding.",
            mistakes: ["Rocking torso violently back and forth", "Pulling high to upper chest instead of lower abs"],
            breathing: "Exhale on pull, inhale on forward stretch."
        },
        ex_bk_5: {
            equipment: "Dumbbell & Flat Bench",
            setup: "Support one knee and hand on the bench with the other foot planted, hold dumbbell with spine parallel to the floor.",
            execution: "Sweep the dumbbell back toward your hip (not armpit), squeeze your lat at the top, and lower for a full stretch.",
            mistakes: ["Twisting torso excessively to heave heavy weight", "Pulling straight up toward shoulder instead of hip"],
            breathing: "Exhale as you pull up, inhale as you lower."
        },
        ex_bk_6: {
            equipment: "Olympic Barbell & Plates",
            setup: "Stand with bar centered over mid-foot, hinge down grabbing outside your knees, lift chest, pack lats, and engage core.",
            execution: "Push the floor away with your legs, drag the bar up close along your shins until locking hips upright, then reverse the path under control.",
            mistakes: ["Rounding the lower back under load", "Letting the bar drift away from your shins", "Hyperextending lower back at lockout"],
            breathing: "Take a deep abdominal breath (Valsalva brace) before lifting, exhale after passing lockout."
        },
        ex_bk_7: {
            equipment: "Lat Pulldown Machine (V-Bar / Close Grip)",
            setup: "Secure thighs under pads and grip the narrow handle with chest lifted.",
            execution: "Pull handle down to upper chest driving elbows close to torso, then return slowly for full lat stretch.",
            breathing: "Exhale on pulldown, inhale on return."
        },
        ex_bk_8: {
            equipment: "Low Row Machine / Cable",
            setup: "Sit upright against chest pad or with feet planted, gripping the lower handles.",
            execution: "Pull handles back toward your waist pinching shoulder blades together, then return under control.",
            breathing: "Exhale on pull, inhale on extension."
        },
        ex_bk_9: {
            equipment: "T-Bar Row Machine",
            setup: "Brace chest firmly against support pad (or hinge 45° with neutral spine) and grip handles.",
            execution: "Row weight toward chest/midsection squeezing shoulder blades hard, then lower smoothly.",
            breathing: "Exhale on row, inhale on descent."
        },
        ex_bk_10: {
            equipment: "Hyperextension Bench",
            setup: "Adjust pad just below hip crease so torso hinges freely with a neutral spine.",
            execution: "Lower torso under control, then extend back until your body forms a straight line without over-arching.",
            breathing: "Inhale on descent, exhale on ascent."
        },
        ex_sh_1: {
            equipment: "Dumbbells & Upright Bench (75–80°)",
            setup: "Sit against a steep backrest, bring dumbbells to ear height with elbows angled slightly forward in the scapular plane.",
            execution: "Press weights upward overhead in a gentle arc without clanking, then lower slowly back to ear level.",
            mistakes: ["Flaring elbows directly out to 180°", "Excessively arching lower back off the pad"],
            breathing: "Inhale lowering down, exhale pressing up."
        },
        ex_sh_2: {
            equipment: "Olympic Barbell",
            setup: "Stand tall bracing abs and glutes tightly, grip barbell slightly outside shoulders resting on upper chest.",
            execution: "Press barbell straight vertically shifting head slightly back out of the bar path, then push head through once bar clears forehead.",
            mistakes: ["Leaning far back turning it into an incline chest press", "Bending knees to turn it into a push press"],
            breathing: "Brace core with inhale before press, exhale at top lockout."
        },
        ex_sh_3: {
            equipment: "Light–Moderate Dumbbells",
            setup: "Stand with slight forward torso lean, dumbbells beside thighs with soft fixed elbows.",
            execution: "Raise arms out to the sides leading with elbows up to shoulder height (like pouring pitchers), pause briefly, then lower over 2 seconds.",
            mistakes: ["Using heavy weight and swinging the torso", "Raising hands higher than elbows", "Lifting well above shoulder height activating upper traps"],
            breathing: "Exhale raising arms, inhale lowering smoothly."
        },
        ex_sh_4: {
            equipment: "Cable Machine (Single Handle)",
            setup: "Set pulley to lowest notch, stand sideways and grab handle with the far hand behind or in front of torso.",
            execution: "Sweep arm out and up to shoulder height maintaining constant cable tension throughout.",
            mistakes: ["Shrugging shoulder upward instead of abducting arm"],
            breathing: "Exhale on raise, inhale on descent."
        },
        ex_sh_5: {
            equipment: "Cable Machine with Double Rope",
            setup: "Set pulley to eye level or slightly higher, grab rope with thumbs pointing back, and step back two paces.",
            execution: "Pull rope toward face/ears while externally rotating shoulders and spreading the rope apart; hold rear-delt squeeze for 1 second.",
            mistakes: ["Pulling rope downward to chest instead of face level", "Going too heavy to allow proper external rotation"],
            breathing: "Exhale pulling toward face, inhale returning forward."
        },
        ex_sh_6: {
            equipment: "Reverse Pec Deck Machine",
            setup: "Sit facing the pad with chest pressed firmly against it, handles aligned at shoulder level with slight elbow bend.",
            execution: "Sweep arms backward using rear delts until aligned with your torso, then return slowly without letting weights touch.",
            mistakes: ["Bending elbows excessively to pull with lats", "Lifting chest off the pad"],
            breathing: "Exhale sweeping backward, inhale returning."
        },
        ex_sh_7: {
            equipment: "Shoulder Press Machine",
            setup: "Adjust seat so handles line up at ear/upper-shoulder height with back flat on pad.",
            execution: "Press overhead just shy of elbow lockout, then lower with slow control.",
            breathing: "Exhale pressing up, inhale lowering."
        },
        ex_sh_8: {
            equipment: "Dumbbells",
            setup: "Stand tall holding dumbbells in front of thighs with a slight elbow bend.",
            execution: "Raise weights forward to shoulder height without swinging torso, then lower smoothly.",
            breathing: "Exhale on raise, inhale on lower."
        },
        ex_sh_9: {
            equipment: "Cable Machine",
            setup: "Stand facing away from pulley holding handle or rope between legs or with one hand.",
            execution: "Raise arm forward up to shoulder height keeping torso stationary, then lower slowly.",
            breathing: "Exhale on lift, inhale on return."
        },
        ex_sh_10: {
            equipment: "Cable / Machine / Dumbbells",
            setup: "Set up sitting or hinged forward ready to pull elbows wide (45–70°) away from torso.",
            execution: "Pull back toward shoulder height squeezing rear delts hard, then return under control.",
            breathing: "Exhale pulling back, inhale returning."
        },
        ex_lg_1: {
            equipment: "Power Rack & Olympic Barbell",
            setup: "Rest barbell across upper traps (high bar) or rear delts (low bar), stand shoulder-width with toes angled 15–30° outward.",
            execution: "Inhale deeply to brace core, push hips back and bend knees tracking over toes until thighs are parallel or below, then drive forcefully upward.",
            mistakes: ["Knees caving inward (knee valgus)", "Heels lifting off the floor", "Excessive forward chest collapse"],
            breathing: "Deep brace before descent; exhale smoothly past mid-ascent."
        },
        ex_lg_2: {
            equipment: "Dumbbells or Barbell",
            setup: "Stand tall holding weight in front of thighs with a slight, fixed knee bend (soft knees).",
            execution: "Push hips straight back as if closing a door behind you while weights glide along thighs until strong hamstring stretch, then drive hips forward to stand.",
            mistakes: ["Bending knees too deeply turning it into a squat", "Rounding lower back to reach closer to the floor"],
            breathing: "Inhale hinging hips back, exhale driving hips forward."
        },
        ex_lg_3: {
            equipment: "45° Leg Press Machine",
            setup: "Sit with lower back and glutes glued to the pad, feet centered shoulder-width on the sled, release safety locks.",
            execution: "Lower sled slowly until knees hit ~90° without hips curling up, then press through heels just shy of full knee lockout.",
            mistakes: ["Locking knees aggressively at the top", "Glutes lifting off seat compressing lumbar spine"],
            breathing: "Inhale lowering sled, exhale pressing up."
        },
        ex_lg_4: {
            equipment: "Leg Extension Machine",
            setup: "Align knees directly with the machine's pivot axis, with roller pad resting right above the ankles.",
            execution: "Extend legs fully to lock out quads for a 1-second peak squeeze, then lower slowly over 3 seconds.",
            mistakes: ["Kicking weight up explosively without control", "Pad resting too high on shins"],
            breathing: "Exhale extending legs, inhale lowering slowly."
        },
        ex_lg_5: {
            equipment: "Lying Leg Curl Machine",
            setup: "Lie face down with pad behind ankles just above heels; grip handles and keep hips glued to pad.",
            execution: "Curl legs forcefully toward glutes, squeeze hamstrings for 1 second, then lower under control.",
            mistakes: ["Lifting hips off the pad to cheat the curl", "Dropping weight quickly without eccentric resistance"],
            breathing: "Exhale curling up, inhale lowering down."
        },
        ex_lg_6: {
            equipment: "Dumbbells & Flat Bench",
            setup: "Stand two steps ahead of a bench, place rear foot laces on the bench holding dumbbells at your sides.",
            execution: "Descend vertically until back knee nears the floor keeping front knee tracked over mid-foot, then drive through front heel.",
            mistakes: ["Standing too close to bench stressing front knee", "Leaning excessively and losing balance"],
            breathing: "Inhale descending, exhale driving up."
        },
        ex_lg_7: {
            equipment: "Seated Leg Curl Machine",
            setup: "Lock thigh pad firmly above knees and position ankle roller right behind ankles.",
            execution: "Pull legs downward and back as far as possible squeezing hamstrings, then extend slowly.",
            breathing: "Exhale pulling down, inhale returning."
        },
        ex_lg_8: {
            equipment: "Bodyweight / Dumbbells",
            setup: "Stand tall and step forward into a wide stride keeping torso upright and core tight.",
            execution: "Lower back knee toward floor until both knees form 90° angles, then drive through front heel to recover.",
            breathing: "Inhale stepping down, exhale pushing back up."
        },
        ex_lg_9: {
            equipment: "Hip Thrust Machine / Barbell",
            setup: "Anchor upper back across bench pad, feet shoulder-width, belt/pad secured over hip crease.",
            execution: "Drive hips upward forcefully into full tabletop lockout squeezing glutes hard for 1 second, then lower under control.",
            breathing: "Exhale thrusting up, inhale lowering."
        },
        ex_lg_10: {
            equipment: "Cable / Glute Kickback Machine",
            setup: "Secure ankle strap or position leg on kickback machine pad keeping torso braced.",
            execution: "Kick leg backward and slightly upward squeezing glute at peak contraction without arching lower back.",
            breathing: "Exhale kicking back, inhale returning."
        },
        ex_lg_11: {
            equipment: "Standing Calf Raise Machine",
            setup: "Stand on platform edge on balls of feet with shoulders under pads and knees straight.",
            execution: "Drop heels fully for a deep stretch, then rise onto tiptoes holding a 1-second peak squeeze.",
            breathing: "Exhale lifting up, inhale lowering."
        },
        ex_lg_12: {
            equipment: "Seated Calf Raise Machine",
            setup: "Sit placing balls of feet on edge with knee pads locked snugly across lower thighs.",
            execution: "Lower heels deeply for a slow stretch, then press up strongly pausing 1 second at top.",
            breathing: "Exhale rising up, inhale lowering."
        },
        ex_arm_1: {
            equipment: "Dumbbells & 60° Incline Bench",
            setup: "Sit back on a 60° incline bench letting arms hang straight down to maximize long-head biceps stretch.",
            execution: "Curl dumbbells upward supinating wrists midway, squeeze biceps hard at the top, then lower slowly.",
            mistakes: ["Swinging elbows forward to assist lift", "Lifting head and shoulders off bench"],
            breathing: "Exhale curling up, inhale lowering."
        },
        ex_arm_2: {
            equipment: "EZ-Bar & Plates",
            setup: "Stand tall gripping inner curves at shoulder width keeping elbows tucked at your sides.",
            execution: "Curl bar upward smoothly toward upper chest without elbows drifting forward, squeeze, then lower over 3 seconds.",
            mistakes: ["Swinging lower back to heave weight up", "Cutting the bottom stretch short"],
            breathing: "Exhale lifting bar, inhale lowering."
        },
        ex_arm_3: {
            equipment: "Dumbbells",
            setup: "Stand tall holding dumbbells with palms facing each other (neutral hammer grip).",
            execution: "Curl weights up keeping wrists neutral, squeeze brachialis & forearms at top, then lower under control.",
            mistakes: ["Swinging elbows back and forth", "Dropping weights quickly without tension"],
            breathing: "Exhale on lift, inhale on lower."
        },
        ex_arm_4: {
            equipment: "Cable Machine with Double Rope",
            setup: "Set pulley high, hinge slightly forward, lock elbows firmly beside your ribcage.",
            execution: "Push rope down extending arms fully and flaring ends outward at the bottom, then return slowly only up to 90°.",
            mistakes: ["Moving elbows forward and back using lats/chest", "Letting hands drift too high losing tension"],
            breathing: "Exhale pushing down, inhale returning up."
        },
        ex_arm_5: {
            equipment: "EZ-Bar & Flat Bench",
            setup: "Lie on bench gripping bar narrowly; press arms up then angle ~75° slightly behind head for constant tension.",
            execution: "Bend only at elbows lowering bar slowly toward crown/forehead, then extend elbows squeezing triceps.",
            mistakes: ["Flaring elbows wide outward", "Moving shoulders instead of isolating elbows"],
            breathing: "Inhale lowering bar, exhale extending arms."
        },
        ex_arm_6: {
            equipment: "Heavy Dumbbell & Upright Bench",
            setup: "Sit tall holding top inner plate of one dumbbell with both hands behind your head, elbows tucked close.",
            execution: "Lower dumbbell behind neck for a full long-head stretch, then extend arms cleanly overhead.",
            mistakes: ["Flaring elbows excessively wide", "Over-arching lower back"],
            breathing: "Inhale lowering behind head, exhale pressing up."
        },
        ex_arm_7: {
            equipment: "Dumbbells",
            setup: "Stand tall holding dumbbells at sides with elbows tucked beside torso.",
            execution: "Curl weights upward rotating palms upward to peak squeeze, then lower slowly.",
            breathing: "Exhale curling up, inhale lowering."
        },
        ex_arm_8: {
            equipment: "Cable Machine (Straight Bar)",
            setup: "Grip low-pulley straight bar at shoulder width with elbows fixed at your sides.",
            execution: "Curl bar smoothly keeping constant cable tension to peak biceps contraction, then lower under control.",
            breathing: "Exhale curling up, inhale lowering."
        },
        ex_arm_9: {
            equipment: "Barbell",
            setup: "Stand firmly gripping bar at shoulder width with core braced tightly.",
            execution: "Curl bar toward upper chest without torso sway, then lower smoothly to full arm extension.",
            breathing: "Exhale on curl, inhale on lower."
        },
        ex_arm_10: {
            equipment: "Biceps Curl Machine",
            setup: "Adjust seat so backs of arms sit comfortably on pad with elbows aligned to machine pivot.",
            execution: "Curl handles up for full contraction, then lower slowly without slamming stack.",
            breathing: "Exhale curling, inhale extending."
        },
        ex_arm_11: {
            equipment: "Preacher Curl Machine",
            setup: "Brace upper arms flat on angled preacher pad and grip handles securely.",
            execution: "Curl smoothly to full contraction, then lower slowly stopping just shy of full lockout.",
            breathing: "Exhale on lift, inhale on descent."
        },
        ex_arm_12: {
            equipment: "Cable Machine (Rope)",
            setup: "Hold rope ends at low pulley with neutral grip and lock elbows beside torso.",
            execution: "Pull rope upward keeping wrists neutral, squeeze at top, and lower with control.",
            breathing: "Exhale lifting, inhale lowering."
        },
        ex_arm_13: {
            equipment: "Cable Machine (Straight Bar)",
            setup: "Set pulley high, grip straight bar shoulder-width keeping elbows pinned beside ribs.",
            execution: "Press bar down to full lockout squeezing triceps hard, then return slowly to 90°.",
            breathing: "Exhale pushing down, inhale returning."
        },
        ex_arm_14: {
            equipment: "Cable Machine (Rope)",
            setup: "Face away from pulley holding rope behind head, lean torso forward slightly keeping elbows pointed ahead.",
            execution: "Extend arms forward and upward to full lockout, then bend back slowly for deep triceps stretch.",
            breathing: "Exhale extending, inhale stretching back."
        },
        ex_arm_15: {
            equipment: "Triceps Extension Machine",
            setup: "Sit pinning elbows on support pads and grip handles comfortably.",
            execution: "Press/extend arms completely squeezing triceps hard, then return under control.",
            breathing: "Exhale extending, inhale returning."
        },
        ex_ab_1: {
            equipment: "Pull-up Bar",
            setup: "Hang stably from bar engaging shoulders slightly to prevent swinging.",
            execution: "Raise straight legs (or bent knees) curling pelvis upward toward chest to contract lower abs, then lower very slowly.",
            mistakes: ["Swinging body with momentum instead of strict abs", "Lifting legs without tilting pelvis (uses hip flexors only)"],
            breathing: "Exhale strongly lifting legs, inhale lowering."
        },
        ex_ab_2: {
            equipment: "Cable Machine with Rope",
            setup: "Kneel facing pulley holding rope beside your forehead, locking hips stationary.",
            execution: "Flex spine crunching ribs down toward pelvis as if curling inward, hold 1 second, then return slowly.",
            mistakes: ["Sitting back onto heels moving hips instead of flexing spine", "Pulling with arms instead of abs"],
            breathing: "Exhale hard crunching down, inhale returning up."
        },
        ex_ab_3: {
            equipment: "Exercise Mat",
            setup: "Balance on forearms and toes forming a strict straight line from head to heels.",
            execution: "Brace abs and glutes tightly inward (hollow-body posture) and hold 30–60 seconds breathing evenly.",
            mistakes: ["Letting hips sag and lower back arch", "Piking glutes high reducing core tension"],
            breathing: "Steady, rhythmic deep breaths without holding breath."
        },
        ex_cardio_treadmill: {
            equipment: "Motorized Treadmill",
            setup: "Stand on side rails first, clip safety key, set comfortable walk speed (3.0 km/h) and target incline (6–12% for incline fat burn, 1–2% for jogging).",
            execution: "Walk or jog tall looking straight ahead, swinging arms naturally at 90° without holding side rails constantly for maximum calorie burn.",
            mistakes: ["Holding rails continuously (cuts calorie burn ~30%)", "Slouching forward staring down at screen", "Stepping off while belt is moving"],
            breathing: "Rhythmic 2-step inhale, 2-step exhale cadence."
        },
        ex_cardio_cycle: {
            equipment: "Stationary Spin / Upright Bike",
            setup: "Adjust seat height to hip-bone level so the knee keeps a slight 15–20° bend at the bottom of each pedal stroke.",
            execution: "Keep torso upright, shoulders relaxed, and pedal smoothly in full circles (70–90 RPM) adjusting resistance progressively.",
            mistakes: ["Seat too low causing knee strain", "Seat too high causing hip rocking", "Zero resistance spinning with rounded lower back"],
            breathing: "Deep controlled inhales and exhales matched to cadence."
        },
        ex_cardio_elliptical: {
            equipment: "Elliptical Cross-Trainer",
            setup: "Step on stationary pedals with whole foot flat, grip moving handles lightly, and stand tall.",
            execution: "Move pedals fluidly pushing and pulling handles synchronously while driving gently through heels with light core brace.",
            mistakes: ["Rising onto tiptoes causing foot numbness", "Leaning weight heavily onto fixed handles", "Rounding shoulders forward under fatigue"],
            breathing: "Smooth rhythmic nose inhale, mouth exhale."
        },
        ex_hm_pushup: {
            equipment: "Bodyweight (Home)",
            setup: "Place hands slightly wider than shoulders forming a straight plank from head to heels with core & glutes braced.",
            execution: "Lower chest smoothly with elbows at 45° until just above floor, then press back up explosively.",
            mistakes: ["Hips sagging or piking upward", "Flaring elbows out 90° straining shoulders"],
            breathing: "Inhale lowering, exhale strongly pressing up."
        },
        ex_hm_incline_pushup: {
            equipment: "Sturdy Wall / Table / Chair",
            setup: "Place hands on a sturdy elevated surface or wall at chest height stepping feet back into a straight diagonal line.",
            execution: "Lower chest gently toward surface keeping elbows tucked ~45°, then push back cleanly.",
            mistakes: ["Using an unstable sliding surface", "Arching lower back"],
            breathing: "Inhale down, exhale pushing back."
        },
        ex_hm_squat: {
            equipment: "Bodyweight / Loaded Backpack",
            setup: "Stand shoulder-width apart with toes slightly turned out, chest tall, arms extended forward.",
            execution: "Sit hips back and down until thighs reach parallel, then drive through heels to stand squeezing glutes.",
            mistakes: ["Knees caving inward", "Heels lifting off floor"],
            breathing: "Deep inhale descending, strong exhale standing up."
        },
        ex_hm_lunge: {
            equipment: "Bodyweight / Water Bottles",
            setup: "Stand tall and step smoothly forward or backward keeping torso upright.",
            execution: "Lower back knee toward floor until both knees form 90° angles, push through front heel to stand and alternate.",
            mistakes: ["Front knee collapsing inward or shooting past toes", "Forward torso lean"],
            breathing: "Inhale descending, exhale driving back up."
        },
        ex_hm_row: {
            equipment: "Dumbbell / Loaded Backpack + Chair",
            setup: "Rest one knee and hand flat on a sturdy chair/bench with a flat back and grip weight in free hand.",
            execution: "Pull weight smoothly toward hip leading with elbow squeezing shoulder blade, then lower slowly to stretch.",
            mistakes: ["Twisting torso to heave weight", "Shrugging shoulder toward ear"],
            breathing: "Exhale pulling up, inhale stretching down."
        },
        ex_hm_dips: {
            equipment: "Sturdy Chair or Couch",
            setup: "Sit on edge with palms beside hips fingers forward, slide hips slightly off edge.",
            execution: "Bend elbows straight back to ~90° keeping torso close to edge, then press palms down to lockout triceps.",
            mistakes: ["Shifting hips too far forward straining shoulders", "Shrugging shoulders up toward ears"],
            breathing: "Inhale lowering, exhale pressing up."
        },
        ex_hm_bridge: {
            equipment: "Exercise Mat",
            setup: "Lie on back knees bent feet hip-width flat, arms resting beside torso.",
            execution: "Drive through heels lifting hips to a straight shoulder-to-knee line squeezing glutes for 2 seconds, then lower slowly.",
            mistakes: ["Hyperextending lower back at top", "Pushing through toes instead of heels"],
            breathing: "Exhale lifting and squeezing, inhale lowering."
        },
        ex_hm_superman: {
            equipment: "Exercise Mat",
            setup: "Lie face down extending arms forward and legs straight back looking gently at mat.",
            execution: "Lift chest, arms and thighs slightly off floor by engaging back and glutes, pause 1s, lower calmly.",
            mistakes: ["Hyperextending neck looking upward", "Jerky ballistic bouncing"],
            breathing: "Exhale lifting and holding, inhale lowering."
        },
        ex_hm_plank: {
            equipment: "Exercise Mat",
            setup: "Support body on forearms directly under shoulders and toes with core and glutes braced.",
            execution: "Hold a rigid straight body line for 30–60 seconds without sagging hips.",
            mistakes: ["Lower back sagging downward", "Holding breath"],
            breathing: "Continuous calm deep breaths throughout the hold."
        },
        ex_hm_calf: {
            equipment: "Step / Stair Edge",
            setup: "Stand on balls of feet at a step edge holding railing or wall for balance.",
            execution: "Lower heels slowly into deep stretch, then press high onto toes pausing 1s at peak contraction.",
            mistakes: ["Fast bouncing without bottom pause", "Bending knees during raise"],
            breathing: "Exhale pressing up, inhale lowering."
        },
        ex_hm_wallsit: {
            equipment: "Flat Wall",
            setup: "Press back and head against flat wall and slide down until thighs are parallel to floor at 90°.",
            execution: "Keep weight in heels, hands off thighs, and hold 30–60 seconds breathing evenly.",
            mistakes: ["Pushing hands against thighs", "Knees sliding far past toes"],
            breathing: "Steady calm breathing without breath-holding."
        },
        ex_hm_jacks: {
            equipment: "Bodyweight (Home Cardio)",
            setup: "Stand tall feet together, arms at sides with gentle core brace.",
            execution: "Hop briskly jumping feet out while raising arms overhead (or step side-to-side low impact) at a steady tempo.",
            mistakes: ["Heavy flat-footed landing", "Tensing shoulders toward ears"],
            breathing: "Continuous rhythmic breaths every two hops."
        },
        ex_cs_breathing: {
            equipment: "Mat or Bed (OB/GYN Cleared)",
            setup: "Lie on back knees bent or sit upright with one hand on chest and one on lower ribs/belly.",
            execution: "Inhale 4s through nose expanding ribs 360° gently; exhale slowly 6s through mouth drawing lower belly gently inward/upward like zipping up from pelvic floor.",
            mistakes: ["Chest-only shallow breathing shrugging shoulders", "Forcing abs harshly outward or holding breath"],
            breathing: "4s slow 360° nasal inhale, 6s gentle exhale with TVA zip-up."
        },
        ex_cs_pelvic_floor: {
            equipment: "No Equipment (Seated or Supine)",
            setup: "Sit or lie in neutral pelvic posture keeping thighs and glutes completely relaxed.",
            execution: "On a gentle exhale, lift and squeeze pelvic floor softly inward for 3–5s, then release and fully relax on inhale.",
            mistakes: ["Clenching glutes or squeezing inner thighs", "Skipping full relaxation between reps"],
            breathing: "Soft exhale on gentle lift, full belly inhale on complete release."
        },
        ex_cs_pelvic_tilt: {
            equipment: "Exercise Mat (6+ Weeks / Doctor Cleared)",
            setup: "Lie flat knees bent feet flat, spine in a comfortable neutral curve.",
            execution: "On exhale, gently tilt pelvis upward flattening lower back softly onto mat with mild TVA draw-in for 3s; relax on inhale. Stop if incision pulls.",
            mistakes: ["Pushing strongly with feet lifting hips early", "Abdominal coning/doming along midline"],
            breathing: "Exhale flattening lower back gently, inhale returning."
        },
        ex_cs_dead_bug: {
            equipment: "Exercise Mat",
            setup: "Lie on back knees bent feet resting on floor (start with heel slides before lifting legs).",
            execution: "Exhale engaging deep core and slowly slide one heel along mat extending leg, inhale drawing back cleanly; progress to modified Dead Bug only after 12+ weeks with zero doming.",
            mistakes: ["Lifting both legs before core stabilizes spine", "Allowing midline doming or lower back arching"],
            breathing: "Long steady exhale extending heel, inhale returning."
        },
        ex_cs_bridge: {
            equipment: "Exercise Mat (6–8+ Weeks / Doctor Cleared)",
            setup: "Lie on back knees hip-width bent, arms flat beside sides.",
            execution: "Exhale gently activating pelvic floor & deep core, press heels softly to lift hips without arching low back, pause 2s and lower calmly.",
            mistakes: ["Overarching lumbar spine at top", "Jerking hips upward straining lower belly"],
            breathing: "Exhale lifting and squeezing glutes, inhale lowering."
        },
        ex_cs_cat_cow: {
            equipment: "Padded Exercise Mat",
            setup: "Come onto hands and knees (wrists under shoulders, knees under hips) with neutral spine.",
            execution: "Inhale lowering chest gently without pulling incision; exhale softly rounding upper/mid back drawing navel lightly inward.",
            mistakes: ["Dropping belly aggressively feeling scar stretch", "Rushing movement out of sync with breath"],
            breathing: "Calm inhale relaxing spine, long exhale gently rounding and engaging core."
        },
        ex_cs_bird_dog: {
            equipment: "Exercise Mat",
            setup: "Start on hands and knees keeping neck long and pelvis level with gentle core engagement.",
            execution: "Exhale extending one arm and opposite leg slowly in line with torso (or slide foot on mat first), hold 2s keeping hips square, switch sides.",
            mistakes: ["Tilting/twisting pelvis upward", "Sagging lower back and belly"],
            breathing: "Exhale reaching out calmly, inhale returning."
        },
        ex_cs_wall_pushup: {
            equipment: "Flat Wall (Zero Floor Belly Pressure)",
            setup: "Stand an arm's length from wall placing palms shoulder-width at chest height with light core brace.",
            execution: "Bend elbows slowly at 45° bringing chest near wall, then exhale pressing gently back without breath-holding.",
            mistakes: ["Dropping to floor pushups too early post-op", "Holding breath increasing abdominal pressure"],
            breathing: "Inhale approaching wall, gentle exhale pressing away."
        },
        ex_cs_band_row: {
            equipment: "Light Resistance Band",
            setup: "Sit tall on chair or mat wrapping light band around a sturdy post or flat feet.",
            execution: "Pull handles back toward waist squeezing shoulder blades together to open nursing/postpartum rounded chest, return slowly.",
            mistakes: ["Hunching shoulders toward ears", "Using heavy resistance causing belly strain"],
            breathing: "Exhale pulling back and opening chest, inhale returning."
        },
        ex_cs_walking: {
            equipment: "Supportive Walking Shoes (Flat Surface)",
            setup: "Start only after doctor clearance with 10–15 min gentle flat walks, tall posture, empty hands (no heavy lifting).",
            execution: "Walk smoothly breathing naturally, increasing duration +5 min weekly if pain-free; stop immediately if pain, bleeding increase, or heaviness occurs.",
            mistakes: ["Power-walking too fast/far in first 6 weeks", "Walking uphill or pushing heavy strollers too early"],
            breathing: "Comfortable conversational pace (Talk Test)."
        }
    },

    // Exact common Arabic client names & tokens -> English
    names: {
        "أحمد علي": "Ahmed Ali",
        "سارة محمد": "Sara Mohamed",
        "خالد عبد الله": "Khaled Abdallah",
        "خالد عبدالله": "Khaled Abdallah",
        "الكوتش محمود": "Coach Mahmoud",
        "محمود": "Mahmoud",
        "أحمد": "Ahmed",
        "احمد": "Ahmed",
        "علي": "Ali",
        "محمد": "Mohamed",
        "سارة": "Sara",
        "ساره": "Sara",
        "خالد": "Khaled",
        "عبدالله": "Abdallah",
        "عبد": "Abd",
        "الله": "Allah",
        "يوسف": "Youssef",
        "عمر": "Omar",
        "إبراهيم": "Ibrahim",
        "ابراهيم": "Ibrahim",
        "مصطفى": "Mostafa",
        "مصطفي": "Mostafa",
        "حسن": "Hassan",
        "حسين": "Hussein",
        "كريم": "Karim",
        "طارق": "Tarek",
        "نور": "Nour",
        "مريم": "Mariam",
        "فاطمة": "Fatma",
        "ياسمين": "Yasmin",
        "هند": "Hend",
        "آية": "Aya",
        "ريم": "Reem",
        "عمرو": "Amr",
        "رامي": "Ramy",
        "زياد": "Ziad",
        "إسلام": "Islam",
        "اسلام": "Islam",
        "حسام": "Hossam",
        "السيد": "El-Sayed",
        "سعيد": "Saeed",
        "سمير": "Samir",
        "منى": "Mona",
        "ليلى": "Laila",
        "هدى": "Hoda",
        "أشرف": "Ashraf",
        "شريف": "Sherif",
        "وليد": "Walid",
        "ماجد": "Maged",
        "رامز": "Ramez",
        "تامر": "Tamer",
        "ياسر": "Yasser",
        "هاني": "Hany",
        "أيمن": "Ayman",
        "مازن": "Mazen",
        "فارس": "Fares",
        "آدم": "Adam",
        "أنس": "Anas",
        "باسم": "Bassem",
        "بلال": "Belal",
        "حمزة": "Hamza",
        "عادل": "Adel",
        "فادي": "Fady",
        "جمال": "Gamal",
        "كوتش": "Coach"
    },

    goals: {
        "تنشيف وخسارة دهون": "Fat Loss & Cutting",
        "تنشيف وخسارة دهون حادة": "Aggressive Fat Loss",
        "خسارة دهون معتدلة": "Moderate Fat Loss",
        "نحت الجسم وتثبيت الوزن": "Body Recomp & Maintenance",
        "تثبيت وزن وإعادة تكوين الجسم": "Maintenance & Recomp",
        "تضخيم وبناء عضلات": "Muscle Building & Bulking",
        "بناء عضلات نظيف Lean Bulk": "Clean Lean Bulk",
        "تضخيم مكثف": "Heavy Bulk",
        "تنشيف وبناء عضلات": "Fat Loss & Lean Muscle",
        "تنشيف": "Cutting / Fat Loss",
        "تضخيم": "Bulking / Muscle Gain",
        "تثبيت": "Maintenance"
    },

    titles: {
        "مدرب معتمد NASM & خبير تغذية رياضية": "Certified NASM Trainer & Sports Nutrition Specialist"
    },

    // Fallback phonetic transliteration for any custom Arabic name/text not in dictionary
    transliterateArabic(str = "") {
        const charMap = {
            "ا": "a", "أ": "a", "إ": "e", "آ": "a", "ب": "b", "ت": "t", "ث": "th",
            "ج": "g", "ح": "h", "خ": "kh", "د": "d", "ذ": "z", "ر": "r", "ز": "z",
            "س": "s", "ش": "sh", "ص": "s", "ض": "d", "ط": "t", "ظ": "z", "ع": "a",
            "غ": "gh", "ف": "f", "ق": "q", "ك": "k", "ل": "l", "م": "m", "ن": "n",
            "ه": "h", "ة": "a", "و": "o", "ي": "y", "ى": "a", "ئ": "e", "ء": "",
            "ؤ": "o", "َ": "", "ُ": "", "ِ": "", "ْ": "", "ّ": "", "ً": "", "ٌ": "", "ٍ": ""
        };
        return String(str).split(/\s+/).map(word => {
            if (!word) return "";
            if (IronI18nEn.names[word]) return IronI18nEn.names[word];
            if (!/[\u0600-\u06FF]/.test(word)) return word;
            const out = word.split("").map(ch => charMap[ch] !== undefined ? charMap[ch] : ch).join("");
            return out ? out.charAt(0).toUpperCase() + out.slice(1) : word;
        }).join(" ").trim();
    }
};
