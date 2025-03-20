document.addEventListener("DOMContentLoaded", function () {
    let summaries = JSON.parse(localStorage.getItem("summaries")) || [];
    let container = document.getElementById("summaries");

    function renderSummaries() {
        container.innerHTML = "";
        if (summaries.length === 0) {
            container.innerHTML = "<p>No summaries saved yet.</p>";
            return;
        }
        summaries.forEach((s, index) => {
            let div = document.createElement("div");
            div.classList.add("entry");
            div.innerHTML = `
                <div class="timestamp">${s.date || "Unknown Time"} <button class="removeBtn" data-index="${index}">X</button> </div>
                <div class="title-container"><strong>Original Text:</strong>  <button class="copyBtn" data-text="${s.originalText}"> <img src="./copy-icon.png" alt="copy" srcset=""></button> </div>
                
                <div class="text-container">
                  <p>${s.originalText}</p>
                </div>
                 <div class="title-container"> <strong>Summary:</strong> <button class="copyBtn" data-text="${s.summary}"> <img src="./copy-icon.png" alt="copy" srcset=""></button></div>
                <div class="text-container">
                    <p> ${s.summary}</p>
                </div>
            `;
            container.appendChild(div);
        });

        // Attach event listeners to "Remove" buttons
        document.querySelectorAll(".removeBtn").forEach(button => {
            button.addEventListener("click", function () {
                let index = this.getAttribute("data-index");
                summaries.splice(index, 1);
                localStorage.setItem("summaries", JSON.stringify(summaries));
                renderSummaries();
            });
        });

        // Attach event listeners to "Copy" buttons
        document.querySelectorAll(".copyBtn").forEach(button => {
            button.addEventListener("click", function () {
                let textToCopy = this.getAttribute("data-text");
                navigator.clipboard.writeText(textToCopy).then(() => {
                    alert("Copied to clipboard!");
                }).catch(err => {
                    console.error("Failed to copy text", err);
                });
            });
        });
    }

    // Initial render
    renderSummaries();

    // Clear All Button
    document.getElementById("clearBtn").addEventListener("click", function () {
        if (confirm("Are you sure you want to clear all summaries?")) {
            localStorage.removeItem("summaries");
            summaries = [];
            renderSummaries();
        }
    });

   // Export Button
document.getElementById("exportBtn").addEventListener("click", function () {
    if (summaries.length === 0) {
        alert("No summaries available to export.");
        return;
    }

    let printWindow = window.open("", "_blank");

    // Linking External CSS
    printWindow.document.write(`
        <html>
        <head>
            <title>Gistify Summaries ✨</title>
            <link rel="stylesheet" href="export_style.css">
        </head>
        <body>
            <h1>Saved Summaries</h1>
    `);

    summaries.forEach(s => {
        printWindow.document.write(`
            <div class="entry">
                <p class="timestamp"><strong>Timestamp:</strong> ${s.date || "Unknown Time"}</p>
                <div class="text-container"><strong>Original Text:</strong> ${s.originalText}</div>
                <div class="text-container"><strong>Summary:</strong> ${s.summary}</div>
            </div>
        `);
    });

    // Adding Watermark
    printWindow.document.write(`
         <div class="logo-container">
             <p>Generated with </p>
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

});
