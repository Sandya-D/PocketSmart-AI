// ========================================
// PocketSmart AI - Main JavaScript
// ========================================

console.log("PocketSmart AI JavaScript loaded successfully!");


// ----------------------------------------
// Get Started Button
// ----------------------------------------

const getStartedButtons = document.querySelectorAll(
    ".signup-btn, .primary-btn"
);

getStartedButtons.forEach(function(button) {

    button.addEventListener("click", function(event) {

        event.preventDefault();

        alert(
            "Welcome to PocketSmart AI! 🚀\n\n" +
            "Your smart financial journey starts here."
        );

    });

});


// ----------------------------------------
// Login Button
// ----------------------------------------

const loginButton = document.querySelector(".login-btn");

if (loginButton) {
    loginButton.addEventListener("click", function(event) {
        event.preventDefault();
        window.location.href = "login.html";
    });
}


// ----------------------------------------
// Explore Features Button
// ----------------------------------------

const exploreButton = document.querySelector(".secondary-btn");

if (exploreButton) {

    exploreButton.addEventListener("click", function(event) {

        event.preventDefault();

        const featuresSection =
            document.querySelector("#features");

        if (featuresSection) {

            featuresSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

}
// ========================================
// Registration Form
// ========================================

const registerForm = document.querySelector("#registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name =
            document.querySelector("#name").value.trim();

        const email =
            document.querySelector("#registerEmail").value.trim();

        const password =
            document.querySelector("#registerPassword").value;

        const confirmPassword =
            document.querySelector("#confirmPassword").value;

        const terms =
            document.querySelector("#terms").checked;


        // Check passwords

        if (password !== confirmPassword) {

            alert(
                "Passwords do not match. Please try again."
            );

            return;
        }


        // Check terms

        if (!terms) {

            alert(
                "Please accept the Terms & Privacy Policy."
            );

            return;
        }


        // Temporary registration message

        alert(
            "Account details received! 🎉\n\n" +
            "Welcome, " + name + "!\n\n" +
            "Your account will be connected to the database in a later step."
        );

    });

}