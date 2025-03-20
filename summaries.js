 async function fetchSummary(text) {
    const API_KEY =  ""; /* Replace with Gemini API key from GoogleStudio*/  
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
  
        const result = await response.json();
        saveSummaryToStorage(text, result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Error generating summary!");
        return result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Error generating summary!";

    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Error generating summary!";
    }
  }
  
async function loadSummary() {
    const params = new URLSearchParams(window.location.search);
    const text = params.get("text");

    if (text) {
        let summary = await fetchSummary(text);
        document.getElementById("loading").style.display = "none";
        document.getElementById("summaryOutput").innerText = summary;
    }
}

function saveSummaryToStorage(originalText, summary) {
    let summaries = JSON.parse(localStorage.getItem("summaries")) || [];
    summaries.unshift({ originalText, summary, type: "summary", date: new Date().toLocaleString() });
    localStorage.setItem("summaries", JSON.stringify(summaries));
}

window.onload = loadSummary;
