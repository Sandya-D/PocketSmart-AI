const express = require("express");
const path = require("path");

const app = express();

const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Home / test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "PocketSmart AI Backend is running 🚀"
    });
});

app.get("/api/test", (req, res) => {
    res.json({
        message: "PocketSmart AI backend is working!"
    });
});
app.listen(PORT, () => {
    console.log(`PocketSmart AI server running at http://localhost:${PORT}`);
});
app.get("/api/test", (req, res) => {
    res.json({
        message: "PocketSmart AI backend is working!"
    });
});
// ========================================
// BUDGET API
// ========================================

let backendBudgets = [];

// Get all budgets
app.get("/api/budgets", (req, res) => {
    res.json(backendBudgets);
});

// Add a budget
app.post("/api/budgets", (req, res) => {

    const budget = {
        id: Date.now(),
        category: req.body.category,
        amount: Number(req.body.amount),
        month: req.body.month
    };

    backendBudgets.push(budget);

    res.status(201).json({
        message: "Budget saved successfully",
        budget: budget
    });

});

// Delete a budget
app.delete("/api/budgets/:id", (req, res) => {

    const id = Number(req.params.id);

    backendBudgets =
        backendBudgets.filter(
            budget => budget.id !== id
        );

    res.json({
        message: "Budget deleted successfully"
    });

});