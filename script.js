document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('diet-form');
    const inputSection = document.getElementById('input-section');
    const resultSection = document.getElementById('result-section');
    const statsContainer = document.getElementById('stats');
    const dietPlanContainer = document.getElementById('diet-plan');
    const groceryListContainer = document.getElementById('grocery-list');
    const regenerateBtn = document.getElementById('regenerate-btn');

    let userData = {};

    // Kerala Cuisine Data with Ingredients
    // Ingredients format: simple strings for aggregation. 
    // We will count occurrences or just list unique items for simplicity, 
    // but for "eggs" we can sum them up.
    const keralaMeals = {
        breakfast: [
            {
                name: "Puttu & Kadala",
                desc: "2 pieces Puttu with 1 cup black chickpea curry.",
                cal: 350, type: "veg",
                ingredients: ["Rice Flour", "Black Chickpeas", "Coconut", "Spices"]
            },
            {
                name: "Appam & Stew",
                desc: "2 Appams with vegetable stew.",
                cal: 320, type: "veg",
                ingredients: ["Rice Flour", "Coconut Milk", "Carrots", "Beans", "Green Peas", "Potato"]
            },
            {
                name: "Idli & Sambar",
                desc: "3 Idlis with Sambar and coconut chutney.",
                cal: 300, type: "veg",
                ingredients: ["Idli Batter", "Drumstick", "Pumpkin", "Dal", "Coconut"]
            },
            {
                name: "Oats Upma",
                desc: "Oats Upma with veggies.",
                cal: 280, type: "veg",
                ingredients: ["Oats", "Carrots", "Beans", "Onion", "Green Chili"]
            },
            {
                name: "Dosa & Chutney",
                desc: "2 Dosas with tomato or mint chutney.",
                cal: 320, type: "veg",
                ingredients: ["Dosa Batter", "Tomato", "Mint", "Coconut"]
            },
            {
                name: "Egg Roast & Bread",
                desc: "2 slices whole wheat bread with Egg Roast.",
                cal: 380, type: "non-veg",
                ingredients: ["Whole Wheat Bread", "Eggs", "Onion", "Tomato", "Spices"]
            }
        ],
        lunch: [
            {
                name: "Kerala Rice Meal",
                desc: "Matta rice, Thoran, Moru curry.",
                cal: 450, type: "veg",
                ingredients: ["Matta Rice", "Cabbage", "Coconut", "Curd", "Cucumber"]
            },
            {
                name: "Fish Curry Meal",
                desc: "Rice, Fish Curry, Thoran.",
                cal: 480, type: "non-veg",
                ingredients: ["Matta Rice", "Fish (Sardine/Mackerel)", "Kudampuli", "Coconut", "Red Chili Powder"]
            },
            {
                name: "Chicken Curry Lite",
                desc: "Rice, Chicken Curry (no coconut milk), Thoran.",
                cal: 500, type: "non-veg",
                ingredients: ["Matta Rice", "Chicken Breast", "Onion", "Ginger Garlic", "Beetroot"]
            },
            {
                name: "Sambar Rice",
                desc: "Rice with Sambar and Aviyal.",
                cal: 420, type: "veg",
                ingredients: ["Matta Rice", "Dal", "Mixed Vegetables (drumstick, carrot, yam)", "Coconut"]
            },
            {
                name: "Kappa & Fish",
                desc: "Boiled Tapioca with Fish Curry.",
                cal: 550, type: "non-veg",
                ingredients: ["Tapioca", "Fish", "Spices", "Coconut Oil"]
            }
        ],
        dinner: [
            {
                name: "Wheat Chapati & Dal",
                desc: "2 Chapatis with Dal Tadka and Salad.",
                cal: 350, type: "veg",
                ingredients: ["Wheat Flour", "Dal", "Cucumber", "Tomato"]
            },
            {
                name: "Grilled Fish/Chicken",
                desc: "Grilled fish or chicken with veggies.",
                cal: 300, type: "non-veg",
                ingredients: ["Fish Fillet/Chicken Breast", "Pepper", "Lemon", "Mixed Veggies"]
            },
            {
                name: "Kanji & Payar",
                desc: "Rice Porridge with Green Gram Thoran.",
                cal: 320, type: "veg",
                ingredients: ["Broken Rice", "Green Gram", "Coconut", "Pappadum"]
            },
            {
                name: "Vegetable Soup & Salad",
                desc: "Mixed vegetable soup with chickpea salad.",
                cal: 250, type: "veg",
                ingredients: ["Carrots", "Beans", "Cabbage", "Chickpeas", "Lettuce"]
            },
            {
                name: "Egg Curry & Appam",
                desc: "1 Appam with Egg Roast.",
                cal: 280, type: "non-veg",
                ingredients: ["Rice Flour", "Eggs", "Onion", "Tomato"]
            }
        ],
        snacks: [
            { name: "Fruits", desc: "Apple or Papaya.", cal: 80, type: "veg", ingredients: ["Apple/Papaya"] },
            { name: "Nuts", desc: "Almonds and walnuts.", cal: 150, type: "veg", ingredients: ["Almonds", "Walnuts"] },
            { name: "Buttermilk", desc: "Spiced Sambharam.", cal: 50, type: "veg", ingredients: ["Curd", "Ginger", "Green Chili"] },
            { name: "Boiled Egg", desc: "1 Boiled Egg.", cal: 70, type: "non-veg", ingredients: ["Eggs"] }
        ]
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        userData = {
            age: parseInt(document.getElementById('age').value),
            weight: parseFloat(document.getElementById('weight').value),
            height: parseFloat(document.getElementById('height').value),
            gender: document.getElementById('gender').value,
            activity: parseFloat(document.getElementById('activity').value),
            preference: document.getElementById('preference').value,
            goalSpeed: parseFloat(document.getElementById('goal').value)
        };

        generateAndShowPlan();
    });

    regenerateBtn.addEventListener('click', () => {
        generateAndShowPlan();
    });

    function generateAndShowPlan() {
        const calories = calculateCalories(userData);
        const plan = createWeeklyPlan(userData.preference, calories);

        renderResults(calories, plan);
        generateGroceryList(plan);

        inputSection.classList.add('hidden');
        resultSection.classList.remove('hidden');
        window.scrollTo(0, 0);
    }

    function calculateCalories(data) {
        let bmr;
        if (data.gender === 'male') {
            bmr = (10 * data.weight) + (6.25 * data.height) - (5 * data.age) + 5;
        } else {
            bmr = (10 * data.weight) + (6.25 * data.height) - (5 * data.age) - 161;
        }

        const tdee = bmr * data.activity;
        const deficit = (data.goalSpeed * 7700) / 7;
        let targetCalories = Math.round(tdee - deficit);

        if (data.gender === 'male' && targetCalories < 1500) targetCalories = 1500;
        if (data.gender === 'female' && targetCalories < 1200) targetCalories = 1200;

        return targetCalories;
    }

    function createWeeklyPlan(preference, targetCalories) {
        const weekPlan = [];
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        for (let i = 0; i < 7; i++) {
            weekPlan.push({
                day: days[i],
                meals: generateDailyMeals(preference, targetCalories)
            });
        }
        return weekPlan;
    }

    function generateDailyMeals(preference, target) {
        const filter = (items) => items.filter(i => preference === 'non-veg' || i.type === 'veg');

        const bOptions = filter(keralaMeals.breakfast);
        const lOptions = filter(keralaMeals.lunch);
        const dOptions = filter(keralaMeals.dinner);
        const sOptions = filter(keralaMeals.snacks);

        const breakfast = getRandom(bOptions);
        const lunch = getRandom(lOptions);
        const dinner = getRandom(dOptions);
        const snack1 = getRandom(sOptions);
        const snack2 = getRandom(sOptions);

        return {
            breakfast,
            lunch,
            dinner,
            snacks: [snack1, snack2]
        };
    }

    function getRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function generateGroceryList(plan) {
        const ingredientsMap = new Map();

        plan.forEach(day => {
            // Collect ingredients from all meals
            const meals = [day.meals.breakfast, day.meals.lunch, day.meals.dinner, ...day.meals.snacks];
            meals.forEach(meal => {
                if (meal.ingredients) {
                    meal.ingredients.forEach(item => {
                        // specialized logic for countable items like eggs
                        if (item === "Eggs") {
                            const current = ingredientsMap.get("Eggs") || 0;
                            ingredientsMap.set("Eggs", current + 1);
                        } else {
                            // For others, just ensure it's in the list.
                            // To make it better, we could track frequency "7x Servings", but "Buy" list usually just needs name
                            // unless it's a staple.
                            if (!ingredientsMap.has(item)) {
                                ingredientsMap.set(item, 1);
                            } else {
                                if (item !== "Eggs") { // Don't increment broad categories endlessly, but maybe good to know scale
                                    ingredientsMap.set(item, ingredientsMap.get(item) + 1);
                                }
                            }
                        }
                    });
                }
            });
        });

        // Convert map to list items
        let htmlInfo = '';

        // Sort keys
        const sortedIngredients = Array.from(ingredientsMap.keys()).sort();

        sortedIngredients.forEach(item => {
            let displayText = item;
            const count = ingredientsMap.get(item);

            // formatting
            if (item === "Eggs") {
                displayText = `${count} Eggs`;
            } else if (item === "Chicken Breast" && count > 1) {
                displayText = `${count * 150}g Chicken Breast (approx)`;
            } else if (item === "Fish" && count > 1) {
                displayText = `${count * 150}g Fish (approx)`;
            }

            htmlInfo += `<li>${displayText}</li>`;
        });

        groceryListContainer.innerHTML = htmlInfo;
    }

    function renderResults(calories, plan) {
        statsContainer.innerHTML = `
            <div class="stat-box">
                <strong>Daily Calorie Target</strong>
                <span>${calories} kcal</span>
            </div>
            <div class="stat-box">
                <strong>Water Intake</strong>
                <span>3 - 4 Liters</span>
            </div>
             <div class="stat-box">
                <strong>Sleep Goal</strong>
                <span>7 - 8 Hours</span>
            </div>
        `;

        dietPlanContainer.innerHTML = plan.map(day => `
            <div class="diet-day">
                <h3>${day.day}</h3>
                <div class="meal">
                    <div class="meal-name">Breakfast</div>
                    <div class="meal-desc">${day.meals.breakfast.name}</div>
                </div>
                <div class="meal">
                    <div class="meal-name">Lunch</div>
                    <div class="meal-desc">${day.meals.lunch.name}</div>
                </div>
                 <div class="meal">
                    <div class="meal-name">Snack</div>
                    <div class="meal-desc">${day.meals.snacks[0].name}, ${day.meals.snacks[1].name}</div>
                </div>
                <div class="meal">
                    <div class="meal-name">Dinner</div>
                    <div class="meal-desc">${day.meals.dinner.name}</div>
                </div>
            </div>
        `).join('');
    }
});
