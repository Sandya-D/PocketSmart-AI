// ========================================
// POCKETSMART AI - TRANSACTIONS
// ========================================

const transactionForm =
    document.querySelector("#transactionForm");

const transactionList =
    document.querySelector("#transactionList");

const typeButtons =
    document.querySelectorAll(".type-btn");

const filterType =
    document.querySelector("#filterType");

const filterCategory =
    document.querySelector("#filterCategory");


// Current transaction type
let selectedType = "expense";


// Load transactions from browser storage
let transactions =
    JSON.parse(
        localStorage.getItem("pocketsmart_transactions")
    ) || [];


// ========================================
// SAMPLE TRANSACTIONS
// ========================================

if (transactions.length === 0) {

    transactions = [

        {
            id: Date.now() + 1,
            title: "Food & Dining",
            amount: 850,
            category: "food",
            date: "2026-09-27",
            type: "expense"
        },

        {
            id: Date.now() + 2,
            title: "Shopping",
            amount: 2400,
            category: "shopping",
            date: "2026-09-26",
            type: "expense"
        },

        {
            id: Date.now() + 3,
            title: "Monthly Salary",
            amount: 65000,
            category: "income",
            date: "2026-09-25",
            type: "income"
        },

        {
            id: Date.now() + 4,
            title: "Transportation",
            amount: 720,
            category: "transport",
            date: "2026-09-24",
            type: "expense"
        }

    ];

    saveTransactions();
}


// ========================================
// SAVE TRANSACTIONS
// ========================================

function saveTransactions() {

    localStorage.setItem(
        "pocketsmart_transactions",
        JSON.stringify(transactions)
    );

}


// ========================================
// CATEGORY INFORMATION
// ========================================

const categoryInfo = {

    food: {
        name: "Food",
        icon: "🍔",
        className: "food"
    },

    shopping: {
        name: "Shopping",
        icon: "🛍",
        className: "shopping"
    },

    transport: {
        name: "Transport",
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
    },

    income: {
        name: "Income",
        icon: "💰",
        className: "salary"
    }

};


// ========================================
// TRANSACTION TYPE BUTTONS
// ========================================

typeButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        typeButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        selectedType =
            button.dataset.type;

    });

});


// ========================================
// DISPLAY TRANSACTIONS
// ========================================

function renderTransactions() {
    // ========================================
// DELETE TRANSACTION
// ========================================

transactionList.addEventListener(
    "click",
    function(event) {

        if (
            !event.target.classList.contains(
                "delete-transaction-btn"
            )
        ) {
            return;
        }


        const transactionId =
            Number(
                event.target.dataset.id
            );


        const confirmDelete =
            confirm(
                "Are you sure you want to delete this transaction?"
            );


        if (!confirmDelete) {
            return;
        }


        transactions =
            transactions.filter(function(transaction) {

                return transaction.id !== transactionId;

            });


        saveTransactions();


        renderTransactions();

    }
);

    transactionList.innerHTML = "";


    const selectedFilterType =
        filterType.value;

    const selectedFilterCategory =
        filterCategory.value;


    const filteredTransactions =
        transactions.filter(function(transaction) {

            const typeMatches =
                selectedFilterType === "all" ||
                transaction.type === selectedFilterType;


            const categoryMatches =
                selectedFilterCategory === "all" ||
                transaction.category === selectedFilterCategory;


            return typeMatches && categoryMatches;

        });


    filteredTransactions.forEach(function(transaction) {

        const category =
            categoryInfo[transaction.category] ||
            categoryInfo.other;


        const row =
            document.createElement("tr");


        const formattedDate =
            new Date(transaction.date)
                .toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );


        const amountPrefix =
            transaction.type === "income"
                ? "+"
                : "-";


        const amountClass =
            transaction.type === "income"
                ? "income"
                : "expense";


        const typeClass =
            transaction.type === "income"
                ? "type-income"
                : "type-expense";


        row.innerHTML = `

            <td>

                <div class="table-transaction">

                    <div class="transaction-icon ${category.className}">
                        ${category.icon}
                    </div>

                    <div>

                        <strong>
                            ${transaction.title}
                        </strong>

                        <small>
                            ${category.name}
                        </small>

                    </div>

                </div>

            </td>


            <td>
                ${category.name}
            </td>


            <td>
                ${formattedDate}
            </td>


            <td>

                <span class="${typeClass}">
                    ${transaction.type === "income"
                        ? "Income"
                        : "Expense"}
                </span>

            </td>


            <td>

                <strong class="${amountClass}">
                    ${amountPrefix}₹${transaction.amount.toLocaleString("en-IN")}
                </strong>

            </td>
            <td>

    <button
        class="delete-transaction-btn"
        data-id="${transaction.id}"
    >
        🗑️ Delete
    </button>

</td>


        `;


        transactionList.appendChild(row);

    });


    updateSummary();

}


// ========================================
// UPDATE SUMMARY
// ========================================

function updateSummary() {

    let totalIncome = 0;

    let totalExpenses = 0;


    transactions.forEach(function(transaction) {

        if (transaction.type === "income") {

            totalIncome +=
                Number(transaction.amount);

        } else {

            totalExpenses +=
                Number(transaction.amount);

        }

    });


    const savings =
        totalIncome - totalExpenses;


    const summaryValues =
        document.querySelectorAll(
            ".summary-card h2"
        );


    if (summaryValues.length >= 4) {

        summaryValues[0].textContent =
            `₹${totalIncome.toLocaleString("en-IN")}`;

        summaryValues[1].textContent =
            `₹${totalExpenses.toLocaleString("en-IN")}`;

        summaryValues[2].textContent =
            transactions.length;

        summaryValues[3].textContent =
            `₹${savings.toLocaleString("en-IN")}`;

    }

}


// ========================================
// ADD TRANSACTION
// ========================================

transactionForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const title =
            document.querySelector(
                "#transactionTitle"
            ).value.trim();


        const amount =
            Number(
                document.querySelector(
                    "#transactionAmount"
                ).value
            );


        const category =
            document.querySelector(
                "#transactionCategory"
            ).value;


        const date =
            document.querySelector(
                "#transactionDate"
            ).value;


        if (!title || !amount || !category || !date) {

            alert(
                "Please fill in all transaction details."
            );

            return;

        }


        const newTransaction = {

            id: Date.now(),

            title: title,

            amount: amount,

            category:
                selectedType === "income"
                    ? "income"
                    : category,

            date: date,

            type: selectedType

        };


        transactions.unshift(
            newTransaction
        );


        saveTransactions();


        renderTransactions();


        transactionForm.reset();


        selectedType = "expense";


        typeButtons.forEach(function(button) {

            button.classList.remove("active");

        });


        typeButtons[0].classList.add("active");


        alert(
            "Transaction added successfully! 🎉"
        );

    }
);


// ========================================
// FILTERS
// ========================================

filterType.addEventListener(
    "change",
    renderTransactions
);


filterCategory.addEventListener(
    "change",
    renderTransactions
);


// ========================================
// DEFAULT DATE
// ========================================

const dateInput =
    document.querySelector(
        "#transactionDate"
    );


if (dateInput) {

    dateInput.valueAsDate =
        new Date();

}


// ========================================
// INITIAL DISPLAY
// ========================================

renderTransactions();