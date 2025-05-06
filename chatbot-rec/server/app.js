const express = require('express');
const cors = require('cors');
const mealPlanRouter = require('./mealPlan');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', mealPlanRouter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});