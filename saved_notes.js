document.addEventListener("DOMContentLoaded", function () {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    let container = document.getElementById("notes");

    function renderNotes() {
        container.innerHTML = ""; // Clear existing content

        if (notes.length === 0) {
            container.innerHTML = "<p>No notes saved yet.</p>";
            return;
        }

        notes.forEach((n, index) => {
            let div = document.createElement("div");
            div.classList.add("entry");
            div.innerHTML = `
                <div class="timestamp">
                    ${n.date || "Unknown Time"} 
                    <button class="removeBtn" data-index="${index}">X</button>
                </div>
                <div class="title-container">
                    <strong>Original Text:</strong>  
                    <button class="copyBtn" data-text='${encodeURIComponent(n.originalText)}'>
                        <img src="./copy-icon.png" alt="copy">
                    </button>
                </div>
                <div class="text-container">
                    <p>${n.originalText}</p>
                </div>
                <div class="title-container">
                    <strong>Notes:</strong> 
                    <button class="copyBtn" data-text='${encodeURIComponent(n.notes)}'>
                        <img src="./copy-icon.png" alt="copy">
                    </button>
                </div>
                <div class="text-container">
                    ${n.notes} <!-- Renders as actual HTML -->
                </div>
            `;
            container.appendChild(div);
        });
    }

    renderNotes();
    
    // Export Button for Notes
document.getElementById("exportBtn").addEventListener("click", function () {
    if (notes.length === 0) {
        alert("No notes available to export.");
        return;
    }

    let printWindow = window.open("", "_blank");

    // Linking External CSS
    printWindow.document.write(`
        <html>
        <head>
            <title>Gistify Notes ✨</title>
            <link rel="stylesheet" href="export_style.css">
        </head>
        <body>
            <h1>Saved Notes</h1>
    `);

    notes.forEach(n => {
        printWindow.document.write(`
            <div class="entry">
                <p class="timestamp"><strong>Timestamp:</strong> ${n.date || "Unknown Time"}</p>
                <div class="text-container"><strong>Original Text:</strong> ${n.originalText}</div>
                <div class="text-container"><strong>Notes:</strong> ${n.notes}</div>
            </div>
        `);
    });

    // Adding Watermark
    printWindow.document.write(`
        <div class="logo-container">
            <p>Generated with</p>
            <img src="icon.png" alt="Gistify Icon">
            <h3>Gistify</h3>
        </div>
        </body></html>
    `);

    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
    }, 500);
});


    // Clear All Button
    document.getElementById("clearBtn").addEventListener("click", function () {
        if (confirm("Are you sure you want to delete all notes?")) {
            localStorage.removeItem("notes");
            notes = [];
            renderNotes(); // Re-render the list without refreshing
        }
    });

    // Event delegation for dynamically added elements
    container.addEventListener("click", function (event) {
        if (event.target.classList.contains("removeBtn")) {
            let index = event.target.getAttribute("data-index");
            deleteNote(index);
        } else if (event.target.closest(".copyBtn")) {
            let textToCopy = decodeURIComponent(event.target.closest(".copyBtn").getAttribute("data-text"));
            copyToClipboard(textToCopy);
        }
    });

    function deleteNote(index) {
        notes.splice(index, 1);
        localStorage.setItem("notes", JSON.stringify(notes));
        renderNotes(); // Update the UI without reloading
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert("Copied to clipboard!");
        }).catch(err => {
            console.error("Failed to copy: ", err);
        });
    }
});
