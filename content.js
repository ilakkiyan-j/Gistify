chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "summarize") {
        showPopup(request.text);
    }
    if (request.action === "generate_notes") {
        showPopup(request.text);
    }
});

function showPopup(summary) {
    let existingPopup = document.getElementById("summaryPopup");
    if (existingPopup) existingPopup.remove();

    let popup = document.createElement("div");
    popup.id = "summaryPopup";
    popup.innerHTML = `<p>${summary}</p><button id="closePopup">Close</button>`;
    document.body.appendChild(popup);

    document.getElementById("closePopup").onclick = () => popup.remove();
}

// Handle shortcut actions in content script
function triggerShortcutAction(command) {
    let selectedText = window.getSelection().toString();
    console.log("Shortcut triggered:", command, "Selected Text:", selectedText);

    if (!selectedText) {
        alert("No text selected!");
        return;
    }

    if (command === "summarize_text") {
        chrome.runtime.sendMessage({ action: "summarize", text: selectedText });
    } else if (command === "generate_notes") {
        chrome.runtime.sendMessage({ action: "generate_notes", text: selectedText });
    }
}
