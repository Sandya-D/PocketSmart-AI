// ========================================
// POCKETSMART AI - RECOMMENDATIONS ENGINE
// ========================================

const transactions =
    JSON.parse(
        localStorage.getItem("pocketsmart_transactions")
    ) || [];


// ========================================
// CALCULATE INCOME & EXPENSES
// ========================================

let totalIncome = 0;
let totalExpenses = 0;

const categorySpending = {};

transactions.forEach(function (transaction) {

    const amount =
        Number(transaction.amount);

    if (transaction.type === "income") {

        totalIncome += amount;

    }

    if (transaction.type === "expense") {

        totalExpenses += amount;

        const category =
            transaction.category || "other";

        if (!categorySpending[category]) {
            categorySpending[category] = 0;
        }

        categorySpending[category] += amount;
    }

});


// ========================================
// FIND HIGHEST SPENDING CATEGORY
// ========================================

let highestCategory = "other";
let highestAmount = 0;

Object.keys(categorySpending).forEach(
    function (category) {

        if (
            categorySpending[category] >
            highestAmount
        ) {

            highestAmount =
                categorySpending[category];

            highestCategory =
                category;

        }

    }
);


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


// ========================================
// SAVINGS
// ========================================

const savings =
    totalIncome - totalExpenses;

const savingsRate =
    totalIncome > 0
        ? Math.round(
            (savings / totalIncome) * 100
        )
        : 0;


// ========================================
// RECOMMENDATION CARDS
// ========================================

const recommendationCards =
    document.querySelectorAll(
        ".recommendation-card"
    );


// ----------------------------------------
// CARD 1 - SAVING
// ----------------------------------------

if (recommendationCards[0]) {

    const paragraph =
        recommendationCards[0]
            .querySelector("p");

    const highlight =
        recommendationCards[0]
            .querySelector(
                ".recommendation-highlight span"
            );

    if (savings > 0) {

        const suggestedSaving =
            Math.round(
                savings * 0.10
            );

        paragraph.textContent =
            "You currently have positive savings. Setting aside a small additional amount each month could strengthen your emergency fund.";

        highlight.textContent =
            "₹" +
            suggestedSaving.toLocaleString("en-IN") +
            " / month";

    } else {

        paragraph.textContent =
            "Your expenses are currently equal to or higher than your income. Reviewing your largest expense categories may help improve your savings.";

        highlight.textContent =
            "Review expenses";

    }

}


// ----------------------------------------
// CARD 2 - HIGHEST SPENDING CATEGORY
// ----------------------------------------

if (recommendationCards[1]) {

    const paragraph =
        recommendationCards[1]
            .querySelector("p");

    const title =
        recommendationCards[1]
            .querySelector("h3");

    const highlight =
        recommendationCards[1]
            .querySelector(
                ".recommendation-highlight span"
            );

    const categoryName =
        categoryNames[highestCategory]
        || "Other";

    title.textContent =
        "Review " +
        categoryName;

    paragraph.textContent =
        categoryName +
        " is currently your highest recorded spending category at ₹" +
        highestAmount.toLocaleString("en-IN") +
        ". Consider setting a monthly limit for this category.";

    const suggestedLimit =
        Math.round(
            highestAmount * 0.85
        );

    highlight.textContent =
        "₹" +
        suggestedLimit.toLocaleString("en-IN") +
        " suggested";

}


// ----------------------------------------
// CARD 3 - SHOPPING
// ----------------------------------------

if (recommendationCards[2]) {

    const shoppingAmount =
        categorySpending.shopping || 0;

    const paragraph =
        recommendationCards[2]
            .querySelector("p");

    const highlight =
        recommendationCards[2]
            .querySelector(
                ".recommendation-highlight span"
            );

    if (shoppingAmount > 0) {

        paragraph.textContent =
            "You have recorded ₹" +
            shoppingAmount.toLocaleString("en-IN") +
            " in shopping expenses. Consider comparing prices and delaying non-essential purchases.";

        highlight.textContent =
            "24-hour wait rule";

    } else {

        paragraph.textContent =
            "No shopping expenses have been recorded yet. Continue tracking purchases to identify future spending patterns.";

        highlight.textContent =
            "Keep tracking";

    }

}


// ----------------------------------------
// CARD 4 - TRANSPORT
// ----------------------------------------

if (recommendationCards[3]) {

    const transportAmount =
        categorySpending.transport || 0;

    const paragraph =
        recommendationCards[3]
            .querySelector("p");

    const highlight =
        recommendationCards[3]
            .querySelector(
                ".recommendation-highlight span"
            );

    if (transportAmount > 0) {

        paragraph.textContent =
            "Your recorded transportation spending is ₹" +
            transportAmount.toLocaleString("en-IN") +
            ". Look for opportunities to combine trips or use lower-cost options.";

        highlight.textContent =
            "Monitor monthly";

    } else {

        paragraph.textContent =
            "No transportation expenses have been recorded yet. Add transactions to receive transportation recommendations.";

        highlight.textContent =
            "Start tracking";

    }

}


// ========================================
// FINANCIAL HEALTH
// ========================================

const healthBadge =
    document.querySelector(".health-badge");

if (healthBadge) {

    if (savingsRate >= 20) {

        healthBadge.textContent = "Excellent";

    } else if (savingsRate >= 10) {

        healthBadge.textContent = "Good";

    } else if (savingsRate > 0) {

        healthBadge.textContent = "Needs Attention";

    } else {

        healthBadge.textContent = "Review Needed";

    }

}


// ========================================
// HEALTH PROGRESS
// ========================================

const healthProgress =
    document.querySelectorAll(
        ".health-progress-fill"
    );

if (healthProgress.length >= 3) {

    const savingScore =
        Math.min(
            Math.max(
                savingsRate * 3,
                0
            ),
            100
        );

    const expenseScore =
        totalIncome > 0
            ? Math.min(
                Math.round(
                    (1 -
                        totalExpenses /
                        totalIncome
                    ) * 100
                ),
                100
            )
            : 0;

    const budgetScore =
        totalExpenses > 0
            ? Math.min(
                Math.round(
                    (savings /
                        totalExpenses
                    ) * 100 + 50
                ),
                100
            )
            : 0;

    healthProgress[0].style.width =
        savingScore + "%";

    healthProgress[1].style.width =
        budgetScore + "%";

    healthProgress[2].style.width =
        Math.max(
            expenseScore,
            0
        ) + "%";


    const healthValues =
        document.querySelectorAll(
            ".health-item strong"
        );

    if (healthValues.length >= 3) {

        healthValues[0].textContent =
            savingScore + "%";

        healthValues[1].textContent =
            budgetScore + "%";

        healthValues[2].textContent =
            Math.max(
                expenseScore,
                0
            ) + "%";

    }

}


// ========================================
// TODAY'S AI TIP
// ========================================

const tipTitle =
    document.querySelector(
        ".daily-tip-card h3"
    );

const tipParagraph =
    document.querySelector(
        ".daily-tip-card p"
    );

if (tipTitle && tipParagraph) {

    if (savingsRate >= 20) {

        tipTitle.textContent =
            "Your savings habit is on the right track.";

        tipParagraph.textContent =
            "Your current savings rate is " +
            savingsRate +
            "%. Continue tracking expenses and consider building an emergency fund.";

    } else if (highestAmount > 0) {

        tipTitle.textContent =
            "Focus on your largest spending category.";

        tipParagraph.textContent =
            categoryNames[highestCategory] +
            " currently accounts for a significant part of your expenses. Reviewing this category could create room for additional savings.";

    } else {

        tipTitle.textContent =
            "Start tracking your spending.";

        tipParagraph.textContent =
            "Add income and expense transactions to receive personalized financial recommendations.";

    }

}