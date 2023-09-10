// script.js
let editingNoteIndex = null; // Track the index of the note being edited

function saveNote() {
    const noteText = document.getElementById("noteText").value;

    if (noteText.trim() === "") {
        alert("Please enter a note.");
        return;
    }

    const date = new Date();
    const noteDate = date.toISOString().slice(0, 10);
    const noteTime = date.toLocaleTimeString();

    const note = {
        text: noteText,
        date: noteDate,
        time: noteTime,
    };

    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    // Check if we are editing a note
    if (editingNoteIndex !== null) {
        notes[editingNoteIndex] = note;
        editingNoteIndex = null; // Reset editing state
    } else {
        notes.push(note);
    }

    localStorage.setItem("notes", JSON.stringify(notes));

    displayNotes();
    document.getElementById("noteText").value = "";
}

function editNote(index) {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const note = notes[index];

    // Set the input field to the note's text for editing
    document.getElementById("noteText").value = note.text;

    // Set the editing state
    editingNoteIndex = index;
}

function deleteNote(index) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    displayNotes();
    editingNoteIndex = null; // Reset editing state if deleting a note
}

function displayNotes() {
    const notesList = document.getElementById("notesList");
    notesList.innerHTML = "";

    const notes = JSON.parse(localStorage.getItem("notes")) || [];

    notes.forEach((note, index) => {
        const noteCard = document.createElement("div");
        noteCard.className = "note-card";
        noteCard.innerHTML = `
            <center><div>${note.text}</div>
            <br>
            <div class="note-date-time">${note.date} ${note.time}</div></center>
            <br>
            <center><button onclick="editNote(${index})">Edit</button>
            <button onclick="deleteNote(${index})">Delete</button></center>
            
        `;

        notesList.appendChild(noteCard);
    });
}

// Display notes when the page loads
displayNotes();
