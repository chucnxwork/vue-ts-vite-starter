document.addEventListener("DOMContentLoaded", () => {
    const noteTitleInput = document.getElementById("note-title-input");
    const noteContentInput = document.getElementById("note-content-input");
    const addNoteBtn = document.getElementById("add-note-btn");
    const notesContainer = document.getElementById("notes-container");
    const searchInput = document.getElementById("search-input");
  
    // Check if service workers are supported
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("sw.js")
          .then((registration) => {
            console.log(
              "ServiceWorker registration successful with scope: ",
              registration.scope
            );
          })
          .catch((error) => {
            console.log("ServiceWorker registration failed: ", error);
          });
      });
    }
  
    // Load existing notes from local storage
    loadNotes();
  
    // Add note event listener
    addNoteBtn.addEventListener("click", addNote);
  
    // Event listener for deleting notes (using event delegation)
    notesContainer.addEventListener("click", (event) => {
      if (event.target.classList.contains("delete-btn")) {
        const noteElement = event.target.closest(".note");
        const noteId = noteElement.dataset.id;
        deleteNote(noteId, noteElement);
      }
    });
  
    // Search functionality
    searchInput.addEventListener("input", filterNotes);
  
    function getNotes() {
      return JSON.parse(localStorage.getItem("simplenotes") || "[]");
    }
  
    function saveNotes(notes) {
      localStorage.setItem("simplenotes", JSON.stringify(notes));
    }
  
    function createNoteElement(note) {
      const div = document.createElement("div");
      div.classList.add("note");
      div.dataset.id = note.id; // Store ID for deletion
  
      if (note.title) {
        const h3 = document.createElement("h3");
        h3.textContent = note.title;
        div.appendChild(h3);
      }
  
      const p = document.createElement("p");
      p.textContent = note.content;
      div.appendChild(p);
  
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.innerHTML = "&times;"; // Simple 'x' symbol
      deleteBtn.title = "Delete Note";
      div.appendChild(deleteBtn);
  
      return div;
    }
  
    function displayNote(note) {
      const noteElement = createNoteElement(note);
      notesContainer.insertBefore(noteElement, notesContainer.firstChild); // Add new notes at the top
    }
  
    function loadNotes() {
      const notes = getNotes();
      // Clear existing notes in the container before loading
      notesContainer.innerHTML = "";
      notes.forEach((note) => {
        const noteElement = createNoteElement(note);
        notesContainer.appendChild(noteElement); // Load in saved order
      });
    }
  
    function addNote() {
      const title = noteTitleInput.value.trim();
      const content = noteContentInput.value.trim();
  
      if (!content) {
        // Require at least content
        alert("Note content cannot be empty!");
        return;
      }
  
      const newNote = {
        id: Date.now().toString(), // Simple unique ID
        title: title,
        content: content,
      };
  
      const notes = getNotes();
      notes.push(newNote);
      saveNotes(notes);
      displayNote(newNote); // Display the newly added note
  
      // Clear input fields
      noteTitleInput.value = "";
      noteContentInput.value = "";
    }
  
    function deleteNote(id, noteElement) {
      let notes = getNotes();
      notes = notes.filter((note) => note.id !== id);
      saveNotes(notes);
      notesContainer.removeChild(noteElement);
    }
  
    function filterNotes() {
      const searchTerm = searchInput.value.toLowerCase();
      const noteElements = notesContainer.querySelectorAll(".note");
  
      noteElements.forEach((noteElement) => {
        const titleElement = noteElement.querySelector("h3");
        const contentElement = noteElement.querySelector("p");
        const titleText = titleElement
          ? titleElement.textContent.toLowerCase()
          : "";
        const contentText = contentElement
          ? contentElement.textContent.toLowerCase()
          : "";
  
        if (titleText.includes(searchTerm) || contentText.includes(searchTerm)) {
          noteElement.classList.remove("hidden");
        } else {
          noteElement.classList.add("hidden");
        }
      });
    }
  });
  