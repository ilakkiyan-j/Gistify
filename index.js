document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("summariesBtn").addEventListener("click", function () {
        window.open("saved_summaries.html", "_blank", "width=600,height=600");
    });

    document.getElementById("notesBtn").addEventListener("click", function () {
        window.open("saved_notes.html", "_blank", "width=600,height=600");
    });
});
