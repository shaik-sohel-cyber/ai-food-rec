async function getMealPlan() {
    const gender = document.getElementById('gender').value;
    const age = document.getElementById('age').value;
    const weight = document.getElementById('weight').value;
    const goal = document.getElementById('goal').value;

    if (!gender || !age || !weight || !goal) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/meal-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gender, age: parseInt(age), weight: parseFloat(weight), goal })
        });
        const data = await response.json();
        displayMealPlans(data.mealPlans);
    } catch (error) {
        console.error('Error fetching meal plan:', error);
        alert('Failed to fetch meal plan. Please try again.');
    }
}

function displayMealPlans(mealPlans) {
    const mealPlansDiv = document.getElementById('mealPlans');
    mealPlansDiv.innerHTML = '<h2>Recommended Meal Plans</h2>';
    mealPlans.forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.className = 'meal-card';
        mealCard.innerHTML = `<h3>${meal.name}</h3><p>Calories: ${meal.calories} kcal</p>`;
        mealCard.onclick = () => displayMealDetails(meal);
        mealPlansDiv.appendChild(mealCard);
    });
    document.getElementById('mealDetails').style.display = 'none';
}

function displayMealDetails(meal) {
    const mealDetailsDiv = document.getElementById('mealDetails');
    mealDetailsDiv.innerHTML = `
        <h3>${meal.name}</h3>
        <p><strong>Calories:</strong> ${meal.calories} kcal</p>
        <p><strong>Ingredients:</strong> ${meal.ingredients.join(', ')}</p>
        <h4>Preparation Steps:</h4>
        <ol>
            ${meal.steps.map(step => `<li>${step}</li>`).join('')}
        </ol>
    `;
    mealDetailsDiv.style.display = 'block';
}