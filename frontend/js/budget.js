// ========================================
// POCKETSMART AI - BUDGET PLANNER
// ========================================

const budgetForm =
    document.querySelector("#budgetForm");


// Load saved budgets
let budgets =
    JSON.parse(
        localStorage.getItem("pocketsmart_budgets")
    ) || [];
    // Load transactions
let transactions =
    JSON.parse(
        localStorage.getItem("pocketsmart_transactions")
    ) || [];
    // ========================================
// CALCULATE CATEGORY SPENDING
// ========================================

function getCategorySpending(category, month) {

    let spending = 0;


    transactions.forEach(function(transaction) {

        if (
            transaction.type === "expense" &&
            transaction.category === category &&
            transaction.date.startsWith(month)
        ) {

            spending += Number(transaction.amount);

        }

    });


    return spending;
}


// ========================================
// SAVE BUDGETS
// ========================================

function saveBudgets() {

    localStorage.setItem(
        "pocketsmart_budgets",
        JSON.stringify(budgets)
    );

}
async function loadBudgetsFromBackend() {

    try {

        const response =
            await fetch("http://localhost:5001/api/budgets");

        if (!response.ok) {
            throw new Error("Failed to load budgets");
        }

        budgets = await response.json();

        renderBudgets();

    } catch (error) {

        console.error(
            "Backend budget error:",
            error
        );

    }

}


// ========================================
// CATEGORY INFORMATION
// ========================================

const budgetCategoryInfo = {

    food: {
        name: "Food & Dining",
        icon: "🍔",
        className: "food"
    },

    shopping: {
        name: "Shopping",
        icon: "🛍",
        className: "shopping"
    },

    transport: {
        name: "Transportation",
        icon: "🚕",
        className: "transport"
    },

    entertainment: {
        name: "Entertainment",
        icon: "🎬",
        className: "entertainment"
    },

    bills: {
        name: "Bills & Utilities",
        icon: "🧾",
        className: "bills"
    },

    health: {
        name: "Health",
        icon: "❤️",
        className: "health"
    },

    education: {
        name: "Education",
        icon: "📚",
        className: "education"
    },

    other: {
        name: "Other",
        icon: "📦",
        className: "other"
    }

};


// ========================================
// ADD BUDGET
// ========================================

budgetForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const category =
            document.querySelector(
                "#budgetCategory"
            ).value;


        const amount =
            Number(
                document.querySelector(
                    "#budgetAmount"
                ).value
            );


        const month =
            document.querySelector(
                "#budgetMonth"
            ).value;


        if (!category || !amount || !month) {

            alert(
                "Please fill in all budget details."
            );

            return;

        }


        // Check whether this category
        // already has a budget for this month

        const existingBudget =
            budgets.find(function(budget) {

                return (
                    budget.category === category &&
                    budget.month === month
                );

            });


        if (existingBudget) {

            existingBudget.amount =
                amount;

        } else {

            budgets.push({

                id: Date.now(),

                category: category,

                amount: amount,

                month: month

            });

        }


        try {

    const response = await fetch(
        "http://localhost:5001/api/budgets",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                category: category,
                amount: amount,
                month: month
            })
        }
    );

    if (!response.ok) {
        throw new Error("Failed to save budget");
    }

    const data = await response.json();

    console.log(
        "Budget saved to backend:",
        data
    );

} catch (error) {

    console.error(
        "Backend budget error:",
        error
    );

    alert(
        "Could not save budget to backend."
    );

    return;
}

    }
);

// ========================================
// RENDER BUDGETS
// ========================================

function renderBudgets() {

    const budgetGrid =
        document.querySelector(".budget-grid");

    if (!budgetGrid) {
        return;
    }

    budgetGrid.innerHTML = "";

    if (budgets.length === 0) {

        budgetGrid.innerHTML = `

            <div class="budget-empty">

                <strong>
                    No budgets created yet
                </strong>

                <p>
                    Create your first category budget above.
                </p>

            </div>

        `;

        return;
    }

    budgets.forEach(function(budget) {

        const category =
            budgetCategoryInfo[budget.category]
            || budgetCategoryInfo.other;

        const spent =
            getCategorySpending(
                budget.category,
                budget.month
            );

        const percentage =
            budget.amount > 0
                ? Math.round(
                    (spent / budget.amount) * 100
                )
                : 0;

        const progress =
            Math.min(
                percentage,
                100
            );

        const remaining =
            Math.max(
                budget.amount - spent,
                0
            );

        const card =
            document.createElement("div");

        card.className =
            "budget-card";

        card.innerHTML = `

            <div class="budget-card-top">

                <div class="budget-category">

                    <div class="budget-icon ${category.className}">
                        ${category.icon}
                    </div>

                    <div>

                        <strong>
                            ${category.name}
                        </strong>

                        <small>
                            ${budget.month}
                        </small>

                    </div>

                </div>

                <div>

                    <span class="budget-percent">
                        ${percentage}%
                    </span>

                    <button
                        class="delete-budget-btn"
                        data-id="${budget.id}"
                    >
                        🗑
                    </button>

                </div>

            </div>

            <div class="budget-amounts">

                <strong>
                    ₹${spent.toLocaleString("en-IN")}
                </strong>

                <span>
                    of ₹${budget.amount.toLocaleString("en-IN")}
                </span>

            </div>

            <div class="budget-progress">

                <div
                    class="budget-progress-fill"
                    style="width: ${progress}%"
                ></div>

            </div>

            <p class="budget-status">

                ₹${remaining.toLocaleString("en-IN")}
                remaining

            </p>

        `;

        // Add card to the budget grid
        budgetGrid.appendChild(card);

    });

}



// ========================================
// DELETE BUDGET
// ========================================

document.addEventListener("click", function(event) {

    const deleteButton =
        event.target.closest(".delete-budget-btn");

    if (!deleteButton) {
        return;
    }

    const budgetId =
        Number(deleteButton.dataset.id);

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this budget?"
        );

    if (!confirmDelete) {
        return;
    }

    budgets = budgets.filter(function(budget) {

        return budget.id !== budgetId;

    });

    saveBudgets();

    renderBudgets();

});



// ========================================
// DEFAULT MONTH
// ========================================

const budgetMonth =
    document.querySelector(
        "#budgetMonth"
    );


if (budgetMonth) {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    budgetMonth.value =
        `${year}-${month}`;

}


// ========================================
// INITIAL DISPLAY
// ========================================

loadBudgetsFromBackend();
