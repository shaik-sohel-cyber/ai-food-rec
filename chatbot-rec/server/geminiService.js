const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function generateMealPlan({ gender, age, weight, goal }) {
    try {
        // Calculate base calorie needs (simplified Harris-Benedict formula)
        const bmr = gender === 'male'
            ? 88.362 + (13.397 * weight) + (4.799 * 170) - (5.677 * age)
            : 447.593 + (9.247 * weight) + (3.098 * 170) - (4.330 * age);
        const calorieGoal = goal === 'gain' ? bmr * 1.2 + 300 : bmr * 1.2 - 500;

        // Construct prompt for Gemini API
        const prompt = `
            Generate a personalized meal plan for a ${gender}, ${age}-year-old, weighing ${weight} kg, with a goal to ${goal} weight.
            Target daily calorie intake: ${Math.round(calorieGoal)} kcal.
            Provide 3 meals with the following details for each:
            - Name of the meal
            - Total calories (in kcal)
            - List of ingredients
            - Step-by-step preparation instructions
            Return the response in JSON format with the structure:
            [
                {
                    "name": "Meal Name",
                    "calories": number,
                    "ingredients": ["ingredient1", "ingredient2", ...],
                    "steps": ["step1", "step2", ...]
                },
                ...
            ]
            Ensure the response contains only valid JSON, without any Markdown code fences (e.g., \`\`\`json) or additional text.
        `;

        // Call Gemini API
        const result = await model.generateContent(prompt, {
            responseMimeType: 'application/json'
        });
        
        // Clean the response to remove Markdown code fences and extra text
        let responseText = result.response.text();
        // Remove ```json and ```, and any surrounding whitespace
        responseText = responseText.replace(/```json\n?|\n?```/g, '').trim();
        
        // Parse the cleaned response
        let mealPlans;
        try {
            mealPlans = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Failed to parse cleaned response:', responseText, parseError);
            throw parseError; // Let the catch block handle fallback
        }

        // Validate the response structure
        if (!Array.isArray(mealPlans) || !mealPlans.every(meal => 
            meal.name && typeof meal.calories === 'number' && 
            Array.isArray(meal.ingredients) && Array.isArray(meal.steps))) {
            throw new Error('Invalid meal plan structure');
        }

        return mealPlans;
    } catch (error) {
        console.error('Error generating meal plan with Gemini API:', error);
        console.error('Raw response (if available):', error.response?.text?.());
        // Fallback to static meal plans
        return [
            {
                name: 'Grilled Chicken Salad',
                calories: 400,
                ingredients: ['Chicken breast', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Olive oil'],
                steps: [
                    'Season chicken breast with salt and pepper.',
                    'Grill chicken for 6-8 minutes per side until cooked.',
                    'Chop mixed greens, tomatoes, and cucumber.',
                    'Toss vegetables with olive oil and lemon juice.',
                    'Slice chicken and place on top of salad.'
                ]
            },
            {
                name: 'Oatmeal Protein Bowl',
                calories: 500,
                ingredients: ['Oats', 'Protein powder', 'Almond milk', 'Banana', 'Chia seeds'],
                steps: [
                    'Cook oats with almond milk according to package instructions.',
                    'Mix in protein powder until smooth.',
                    'Slice banana and add to the bowl.',
                    'Sprinkle chia seeds on top.',
                    'Serve warm.'
                ]
            },
            {
                name: 'Veggie Stir-Fry',
                calories: 350,
                ingredients: ['Broccoli', 'Bell peppers', 'Tofu', 'Soy sauce', 'Brown rice'],
                steps: [
                    'Cook brown rice according to package instructions.',
                    'Chop broccoli, bell peppers, and tofu.',
                    'Heat oil in a pan and add tofu, cooking until golden.',
                    'Add vegetables and stir-fry for 5-7 minutes.',
                    'Add soy sauce and serve over rice.'
                ]
            }
        ];
    }
}

module.exports = { generateMealPlan };