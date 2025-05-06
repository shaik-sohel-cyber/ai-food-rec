const express = require('express');
const router = express.Router();
const { generateMealPlan } = require('./geminiService');

router.post('/meal-plan', async (req, res) => {
    try {
        const userData = req.body;
        const mealPlans = await generateMealPlan(userData);
        res.json({ mealPlans });
    } catch (error) {
        console.error('Error in meal plan route:', error);
        res.status(500).json({ error: 'Failed to generate meal plan' });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    // Get meal plans from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const encodedMealPlans = urlParams.get('meals');
    
    if (!encodedMealPlans) {
        document.getElementById('mealPlans').innerHTML = '<p class="text-center text-red-500">No meal plans found. Please go back and submit your details.</p>';
        return;
    }

    const mealPlans = JSON.parse(decodeURIComponent(encodedMealPlans));
    displayMealPlans(mealPlans);
});

function displayMealPlans(mealPlans) {
    const mealPlansDiv = document.getElementById('mealPlans');
    mealPlansDiv.innerHTML = '';

    // Add placeholder images for meals (replace with real images as needed)
    const mealImages = {
        'Grilled Chicken Salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        'Oatmeal Protein Bowl': 'https://images.unsplash.com/photo-1594216116567-3e514f8d04e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        'Veggie Stir-Fry': 'https://images.unsplash.com/photo-1512058564366-5c5351a999cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    };

    mealPlans.forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.className = 'meal-card bg-white rounded-lg shadow-md overflow-hidden';
        mealCard.innerHTML = `
            <img src="${mealImages[meal.name] || 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'}" alt="${meal.name}" class="meal-image w-full">
            <div class="p-4">
                <h3 class="text-xl font-semibold text-gray-800">${meal.name}</h3>
                <p class="text-gray-600">Calories: ${meal.calories} kcal</p>
                <button onclick='showModal(${JSON.stringify(meal)})' class="mt-4 w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition">View Details</button>
            </div>
        `;
        mealPlansDiv.appendChild(mealCard);
    });
}

function showModal(meal) {
    const modal = document.getElementById('mealModal');
    document.getElementById('modalTitle').textContent = meal.name;
    document.getElementById('modalCalories').innerHTML = `<strong>Calories:</strong> ${meal.calories} kcal`;
    document.getElementById('modalIngredients').innerHTML = `<strong>Ingredients:</strong> ${meal.ingredients.join(', ')}`;
    const stepsList = document.getElementById('modalSteps');
    stepsList.innerHTML = meal.steps.map(step => `<li>${step}</li>`).join('');
    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('mealModal').classList.add('hidden');
}

module.exports = router;