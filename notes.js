async function fetchNotes(text) {
    const API_KEY = "AIzaSyDq98O50m-ZZ0rmYI-Enm05yaso4oq9enk"; // Replace with your actual key
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `Generate brief study notes for this: ${text}` }] }]
                })
            }
        );

        const result = await response.json();
        return result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Error generating notes!";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Error generating notes!";
    }
}

async function loadNotes() {
    const params = new URLSearchParams(window.location.search);
    const text = params.get("text");

    if (text) {
        let notes = await fetchNotes(text);
        notes = formatTextToHTML(notes);
        saveNotesToStorage(text, notes); 
        document.getElementById("loading").style.display = "none";
        document.getElementById("notesOutput").innerHTML = notes;
    }
}


function formatTextToHTML(text) {
    // Convert headings (# Heading -> <h1>Heading</h1>)
    text = text.replace(/^#\s*(.*)$/gm, '<h1><b>$1</b></h1>');
    text = text.replace(/^##\s*(.*)$/gm, '<h2><b>$1</b></h2>');
    text = text.replace(/^###\s*(.*)$/gm, '<h3><b>$1</b></h3>');

    // Convert bold (**bold text** -> <b>bold text</b>)
    text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    // Convert bullet points (* Item -> <ul><li>Item</li></ul>)
    text = text.replace(/(?:^|\n)\*\s*(.*)/g, '<li>$1</li>'); // Convert * into <li>
    text = text.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>'); // Wrap <li> inside <ul> properly

    // Prevent multiple <ul> tags from breaking lists by merging them
    text = text.replace(/<\/ul>\n<ul>/g, ''); 

    // Ensure proper paragraph formatting
    text = text.replace(/\n{2,}/g, '</p><p>'); // Separate paragraphs
    text = text.replace(/\n/g, '<br>'); // Preserve single line breaks

    text = `<p>${text}</p>`; // Wrap everything in <p> tags

    return text;
}


function saveNotesToStorage(originalText, notes) {
    let notesList = JSON.parse(localStorage.getItem("notes")) || [];
    notesList.unshift({ originalText, notes, type: "notes", date: new Date().toLocaleString() });
    localStorage.setItem("notes", JSON.stringify(notesList));
}


window.onload = loadNotes;
