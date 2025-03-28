document.addEventListener("DOMContentLoaded", function () {
    // Load stored API key if available
    let storedApiKey = localStorage.getItem("apiKey");
    if (storedApiKey) {
        document.getElementById("apikey").value = storedApiKey;
    }

    // Open Summaries
    document.getElementById("summariesBtn").addEventListener("click", function () {
        window.open("saved_summaries.html", "_blank", "width=600,height=600");
    });

    // Open Notes
    document.getElementById("notesBtn").addEventListener("click", function () {
        window.open("saved_notes.html", "_blank", "width=600,height=600");
    });

    // Show input field when Edit button is clicked
    document.getElementById("apiBtn").addEventListener("click", function () {
        let apiInput = document.getElementById("apikey");
        apiInput.classList.add("show"); // Apply styles
        apiInput.style.display = "block"; // Show input field
        
        document.getElementById("confirmApi").style.display = "block";
        document.getElementById("cancel").style.display = "block";
        document.getElementById("apiBtn").style.display = "none";
        document.getElementById("apikey").style.display = "block";
        document.getElementById("apikey").focus();
        document.getElementById("apikey").removeAttribute("readonly");
    });

    // Hide input field when Cancel button is clicked
    document.getElementById("cancel").addEventListener("click", function () {
        document.getElementById("confirmApi").style.display = "none";
        document.getElementById("cancel").style.display = "none";
        document.getElementById("apiBtn").style.display = "block";
        document.getElementById("apikey").style.display = "none";
        document.getElementById("apikey").setAttribute("readonly", true);
    });

    // Confirm API Key
    document.getElementById("confirmApi").addEventListener("click", function () {
        let apiKey = document.getElementById("apikey").value.trim();

        // API Key Validation
        if (apiKey === "") {
            alert("API Key cannot be empty!");
            return;
        }
        if (apiKey.length < 20) {
            alert("API Key must be at least 20 characters long!");
            return;
        }
        if (apiKey.includes(" ")) {
            alert("API Key should not contain spaces!");
            return;
        }

        // Save API key to localStorage
        localStorage.setItem("apiKey", apiKey);

        // Hide confirm and cancel buttons, show edit button
        document.getElementById("confirmApi").style.display = "none";
        document.getElementById("cancel").style.display = "none";
        document.getElementById("apiBtn").style.display = "block";
        document.getElementById("apikey").style.display = "none";
        document.getElementById("apikey").setAttribute("readonly", true);
    });
});
