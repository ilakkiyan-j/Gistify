document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        let summary = document.getElementById("summaryOutput");
        summary.classList.add("show"); // Apply fade-in animation
        document.getElementById("loading").style.display = "none"; // Hide loading text
    }, 1000); // Simulating initial page load delay
});

async function fetchSummary(text) {
    let API_KEY = localStorage.getItem("apiKey");

    if (!API_KEY) {
        alert("API key is missing! Please update it in the Home section.");
        return "⚠️ Error: API key is missing!";
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `Summarize this: ${text}` }] }]
                })
            }
        );

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        let summaryText =
            result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "⚠️ Error: Could not generate summary.";

        saveSummaryToStorage(text, summaryText);
        return summaryText;
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "⚠️ Error: Failed to fetch summary!";
    }
}

async function loadSummary() {
    const params = new URLSearchParams(window.location.search);
    const text = params.get("text");

    if (text) {
        document.getElementById("loading").style.display = "block";
        let summary = await fetchSummary(text);

        document.getElementById("loading").style.display = "none";
        let summaryOutput = document.getElementById("summaryOutput");
        summaryOutput.innerText = summary;
        summaryOutput.classList.add("show"); // Apply fade-in effect
    } else {
        document.getElementById("loading").innerText = "⚠️ No text provided for summarization.";
    }
}

function saveSummaryToStorage(originalText, summary) {
    let summaries = JSON.parse(localStorage.getItem("summaries")) || [];
    summaries.unshift({ 
        originalText, 
        summary, 
        type: "summary", 
        date: new Date().toLocaleString() 
    });
    localStorage.setItem("summaries", JSON.stringify(summaries));
}

window.onload = loadSummary;
