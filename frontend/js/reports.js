// ========================================
// POCKETSMART AI - FINANCIAL REPORTS
// ========================================

const transactions =
    JSON.parse(
        localStorage.getItem("pocketsmart_transactions")
    ) || [];


// ========================================
// REPORT MONTH
// ========================================

const reportMonth =
    document.querySelector("#reportMonth");

const today =
    new Date();

const currentMonth =
    today.getFullYear() +
    "-" +
    String(
        today.getMonth() + 1
    ).padStart(2, "0");

if (reportMonth) {
    reportMonth.value = currentMonth;
}


// ========================================
// CATEGORY NAMES
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


// ========================================
// GENERATE REPORT
// ========================================

function generateReport(month) {

    const monthlyTransactions =
        transactions.filter(
            function (transaction) {

                return transaction.date &&
                    transaction.date.startsWith(month);

            }
        );


    let income = 0;
    let expenses = 0;

    const expenseTransactions = [];

    const categories = new Set();


    monthlyTransactions.forEach(
        function (transaction) {

            const amount =
                Number(transaction.amount);

            if (
                transaction.type === "income"
            ) {

                income += amount;

            }


            if (
                transaction.type === "expense"
            ) {

                expenses += amount;

                expenseTransactions.push(
                    transaction
                );

                categories.add(
                    transaction.category ||
                    "other"
                );

            }

        }
    );


    const savings =
        income - expenses;


    // ========================================
    // BASIC STATISTICS
    // ========================================

    const transactionCount =
        monthlyTransactions.length;


    const averageExpense =
        expenseTransactions.length > 0
            ? Math.round(
                expenses /
                expenseTransactions.length
            )
            : 0;


    let largestExpense = 0;

    expenseTransactions.forEach(
        function (transaction) {

            const amount =
                Number(transaction.amount);

            if (amount > largestExpense) {

                largestExpense =
                    amount;

            }

        }
    );


    const savingsRate =
        income > 0
            ? Math.round(
                (savings / income) * 100
            )
            : 0;


    // ========================================
    // UPDATE SUMMARY
    // ========================================

    const incomeElement =
        document.querySelector(
            "#reportIncome"
        );

    const expensesElement =
        document.querySelector(
            "#reportExpenses"
        );

    const savingsElement =
        document.querySelector(
            "#reportSavings"
        );

    const countElement =
        document.querySelector(
            "#reportTransactionCount"
        );


    if (incomeElement) {

        incomeElement.textContent =
            "₹" +
            income.toLocaleString("en-IN");

    }


    if (expensesElement) {

        expensesElement.textContent =
            "₹" +
            expenses.toLocaleString("en-IN");

    }


    if (savingsElement) {

        savingsElement.textContent =
            "₹" +
            savings.toLocaleString("en-IN");

    }


    if (countElement) {

        countElement.textContent =
            transactionCount;

    }


    // ========================================
    // BREAKDOWN
    // ========================================

    const total =
        income > 0
            ? income
            : expenses;


    let incomePercentage = 0;
    let expensePercentage = 0;
    let savingsPercentage = 0;


    if (total > 0) {

        incomePercentage =
            Math.round(
                (income / total) * 100
            );

        expensePercentage =
            Math.round(
                (expenses / total) * 100
            );

        if (savings > 0) {

            savingsPercentage =
                Math.round(
                    (savings / total) * 100
                );

        }

    }


    const incomeBar =
        document.querySelector(
            "#incomeBar"
        );

    const expenseBar =
        document.querySelector(
            "#expenseBar"
        );

    const savingsBar =
        document.querySelector(
            "#savingsBar"
        );


    if (incomeBar) {

        incomeBar.style.width =
            Math.min(
                incomePercentage,
                100
            ) + "%";

    }


    if (expenseBar) {

        expenseBar.style.width =
            Math.min(
                expensePercentage,
                100
            ) + "%";

    }


    if (savingsBar) {

        savingsBar.style.width =
            Math.min(
                savingsPercentage,
                100
            ) + "%";

    }


    const incomePercent =
        document.querySelector(
            "#incomePercent"
        );

    const expensePercent =
        document.querySelector(
            "#expensePercent"
        );

    const savingsPercent =
        document.querySelector(
            "#savingsPercent"
        );


    if (incomePercent) {

        incomePercent.textContent =
            incomePercentage + "%";

    }


    if (expensePercent) {

        expensePercent.textContent =
            expensePercentage + "%";

    }


    if (savingsPercent) {

        savingsPercent.textContent =
            savingsPercentage + "%";

    }


    // ========================================
    // KEY METRICS
    // ========================================

    const savingsRateElement =
        document.querySelector(
            "#savingsRate"
        );

    const averageExpenseElement =
        document.querySelector(
            "#averageExpense"
        );

    const largestExpenseElement =
        document.querySelector(
            "#largestExpense"
        );

    const expenseCategoriesElement =
        document.querySelector(
            "#expenseCategories"
        );


    if (savingsRateElement) {

        savingsRateElement.textContent =
            savingsRate + "%";

    }


    if (averageExpenseElement) {

        averageExpenseElement.textContent =
            "₹" +
            averageExpense.toLocaleString(
                "en-IN"
            );

    }


    if (largestExpenseElement) {

        largestExpenseElement.textContent =
            "₹" +
            largestExpense.toLocaleString(
                "en-IN"
            );

    }


    if (expenseCategoriesElement) {

        expenseCategoriesElement.textContent =
            categories.size;

    }


    // ========================================
    // AI REPORT INSIGHT
    // ========================================

    const reportInsight =
        document.querySelector(
            "#reportInsight"
        );


    if (reportInsight) {

        if (
            monthlyTransactions.length === 0
        ) {

            reportInsight.textContent =
                "No transactions were recorded for this month. Add income and expense transactions to generate a personalized financial report.";

        }

        else if (savings > 0) {

            reportInsight.textContent =
                "You recorded ₹" +
                income.toLocaleString("en-IN") +
                " in income and ₹" +
                expenses.toLocaleString("en-IN") +
                " in expenses. Your current savings are ₹" +
                savings.toLocaleString("en-IN") +
                ", giving you a savings rate of " +
                savingsRate +
                "%. Continue monitoring your largest expense categories to maintain healthy savings.";

        }

        else {

            reportInsight.textContent =
                "Your recorded expenses of ₹" +
                expenses.toLocaleString("en-IN") +
                " are currently equal to or higher than your income of ₹" +
                income.toLocaleString("en-IN") +
                ". Review your largest expenses and consider adjusting your budget.";

        }

    }

}


// ========================================
// INITIAL REPORT
// ========================================

generateReport(currentMonth);


// ========================================
// MONTH CHANGE
// ========================================

if (reportMonth) {

    reportMonth.addEventListener(
        "change",
        function () {

            generateReport(
                reportMonth.value
            );

        }
    );

}


// ========================================
// PRINT REPORT
// ========================================

const printButton =
    document.querySelector(
        "#printReportBtn"
    );

if (printButton) {

    printButton.addEventListener(
        "click",
        function () {

            window.print();

        }
    );

}