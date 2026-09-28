// ========================================
// POCKETSMART AI - ANALYTICS
// ========================================

const transactions =
    JSON.parse(
        localStorage.getItem("pocketsmart_transactions")
    ) || [];


// ========================================
// CALCULATE TOTALS
// ========================================

let totalIncome = 0;
let totalExpenses = 0;

transactions.forEach(function (transaction) {

    if (transaction.type === "income") {
        totalIncome += Number(transaction.amount);
    }

    if (transaction.type === "expense") {
        totalExpenses += Number(transaction.amount);
    }

});

const totalSavings =
    totalIncome - totalExpenses;


// ========================================
// UPDATE SUMMARY CARDS
// ========================================

const summaryValues =
    document.querySelectorAll(".summary-card strong");

if (summaryValues.length >= 4) {

    summaryValues[0].textContent =
        "₹" + totalIncome.toLocaleString("en-IN");

    summaryValues[1].textContent =
        "₹" + totalExpenses.toLocaleString("en-IN");

    summaryValues[2].textContent =
        "₹" + totalSavings.toLocaleString("en-IN");

    const expenseDays =
        new Set(
            transactions
                .filter(function (transaction) {
                    return transaction.type === "expense";
                })
                .map(function (transaction) {
                    return transaction.date;
                })
        ).size;

    const dailyAverage =
        expenseDays > 0
            ? Math.round(totalExpenses / expenseDays)
            : 0;

    summaryValues[3].textContent =
        "₹" + dailyAverage.toLocaleString("en-IN");
}


// ========================================
// CATEGORY SPENDING
// ========================================

const categoryNames = {

    food: "Food & Dining",

    shopping: "Shopping",

    transport: "Transportation",

    bills: "Bills & Utilities",

    entertainment: "Entertainment",

    health: "Health",

    education: "Education",

    other: "Other"

};


const categorySpending = {};

transactions.forEach(function (transaction) {

    if (transaction.type !== "expense") {
        return;
    }

    const category =
        transaction.category || "other";

    if (!categorySpending[category]) {
        categorySpending[category] = 0;
    }

    categorySpending[category] +=
        Number(transaction.amount);

});


// ========================================
// UPDATE CATEGORY BARS
// ========================================

const categoryRows =
    document.querySelectorAll(".category-row");

categoryRows.forEach(function (row) {

    const label =
        row.querySelector(".category-label");

    if (!label) {
        return;
    }

    const labelText =
        label.textContent.trim();

    let categoryKey = null;

    Object.keys(categoryNames).forEach(
        function (key) {

            if (
                categoryNames[key] ===
                labelText
            ) {
                categoryKey = key;
            }

        }
    );

    if (!categoryKey) {
        return;
    }

    const amount =
        categorySpending[categoryKey] || 0;

    const amountElement =
        row.querySelector("strong");

    if (amountElement) {

        amountElement.textContent =
            "₹" +
            amount.toLocaleString("en-IN");

    }

    const bar =
        row.nextElementSibling;

    if (bar) {

        const fill =
            bar.querySelector(
                ".analytics-bar-fill"
            );

        if (fill) {

            const percentage =
                totalExpenses > 0
                    ? Math.round(
                        (amount / totalExpenses) *
                        100
                    )
                    : 0;

            fill.style.width =
                percentage + "%";

        }

    }

});


// ========================================
// ANALYTICS INSIGHTS
// ========================================

const insightParagraphs =
    document.querySelectorAll(
        ".analytics-insight p"
    );

if (insightParagraphs.length > 0) {

    const categoryEntries =
        Object.entries(
            categorySpending
        );

    categoryEntries.sort(
        function (a, b) {
            return b[1] - a[1];
        }
    );

    if (categoryEntries.length > 0) {

        const highestCategory =
            categoryEntries[0];

        const categoryName =
            categoryNames[
                highestCategory[0]
            ] || "Other";

        insightParagraphs[0].textContent =
            categoryName +
            " is currently your highest spending category at ₹" +
            highestCategory[1].toLocaleString("en-IN") +
            ".";

    }

    if (totalIncome > 0) {

        const savingRate =
            Math.round(
                (totalSavings / totalIncome) *
                100
            );

        if (insightParagraphs[1]) {

            insightParagraphs[1].textContent =
                "Your current savings rate is " +
                savingRate +
                "% based on your recorded income and expenses.";

        }

    }

    if (insightParagraphs[2]) {

        if (totalSavings > 0) {

            insightParagraphs[2].textContent =
                "You are currently spending less than your recorded income. Keep monitoring your expenses to maintain this balance.";

        } else {

            insightParagraphs[2].textContent =
                "Your recorded expenses are currently equal to or higher than your income. Consider reviewing your largest spending categories.";

        }

    }

}


// ========================================
// AI ANALYTICS MESSAGE
// ========================================

const aiInsight =
    document.querySelector(
        ".ai-insight-content p"
    );

if (aiInsight) {

    if (totalSavings > 0) {

        aiInsight.textContent =
            "Great progress! Your current transactions show positive savings of ₹" +
            totalSavings.toLocaleString("en-IN") +
            ". Continue monitoring your spending categories to improve your financial health.";

    } else {

        aiInsight.textContent =
            "Your current spending needs attention. Review your largest expense categories and consider setting or adjusting your monthly budgets.";

    }

}
// ========================================
// CHART.JS - SPENDING DOUGHNUT CHART
// ========================================

const spendingChartCanvas =
    document.querySelector("#spendingChart");

if (spendingChartCanvas && typeof Chart !== "undefined") {

    const chartLabels = [];
    const chartValues = [];

    Object.keys(categorySpending).forEach(function (category) {

        const amount = categorySpending[category];

        if (amount > 0) {

            chartLabels.push(
                categoryNames[category] || "Other"
            );

            chartValues.push(amount);

        }

    });

    new Chart(spendingChartCanvas, {
        type: "doughnut",

        data: {
            labels: chartLabels,

            datasets: [{
                data: chartValues,
                backgroundColor: [
                    "#6c4df6",
                    "#8c72f7",
                    "#a58df9",
                    "#b9a6fa",
                    "#cabdfc",
                    "#f2a93b",
                    "#27a866",
                    "#e05252"
                ],
                borderWidth: 2,
                borderColor: "#ffffff"
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: "bottom"
                },

                tooltip: {
                    callbacks: {
                        label: function (context) {

                            return context.label + ": ₹" +
                                Number(context.raw)
                                    .toLocaleString("en-IN");

                        }
                    }
                }
            },

            cutout: "65%"
        }
    });

}