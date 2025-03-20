// Create context menu items when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "summarize",
        title: "Summarize with Gistify",
        contexts: ["selection"]
    });

    chrome.contextMenus.create({
        id: "generateNotes",
        title: "Generate Notes with Gistify",
        contexts: ["selection"]
    });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "summarize" && info.selectionText) {
        openPopup("summaries.html", info.selectionText);
    }

    if (info.menuItemId === "generateNotes" && info.selectionText) {
        openPopup("notes.html", info.selectionText, "notes");
    }
});

// Handle keyboard shortcut commands
chrome.commands.onCommand.addListener((command) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs.length) return;

        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: getSelectedText,
            args: [command]
        }).catch((error) => console.error("Script execution error:", error));
    });
});

// Function to get selected text and send it as a message
function getSelectedText(command) {
    let selectedText = window.getSelection().toString();
    if (!selectedText) {
        alert("No text selected!");
        return;
    }

    chrome.runtime.sendMessage({ action: command, text: selectedText });
}

// Listen for messages from content.js or commands
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "summarize_text") {
        openPopup("summaries.html", request.text);
    } else if (request.action === "generate_notes") {
        openPopup("notes.html", request.text, "notes");
    }
    sendResponse({ status: "ok" });
});

// Function to open popups
function openPopup(page, text, mode = "") {
    let url = `${page}?text=${encodeURIComponent(text)}`;
    if (mode) url += `&mode=${mode}`;

    chrome.windows.create({
        url: url,
        type: "popup",
        width: 500,
        height: 500
    });
}
