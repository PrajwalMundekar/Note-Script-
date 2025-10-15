let notes = []
let editingNoteId = null

function loadNotes() {
    const savedNotes = localStorage.getItem('quickNotes')
    return savedNotes ? JSON.parse(savedNotes) : []
}

function saveNote(event) {
    event.preventDefault()

    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();

    if (editingNoteId) {
        // Update existing Note

        const noteIndex = notes.findIndex(note => note.id === editingNoteId)
        notes[noteIndex] = {
            ...notes[noteIndex],
            title: title,
            content: content
        }

    } else {
        // Add New Note
        notes.unshift({
            id: generateId(),
            title: title,
            content: content
        })
    }

    closeNoteDialog()
    saveNotes()
    renderNotes()
}

function generateId() {
    return Date.now().toString()
}

function saveNotes() {
    localStorage.setItem('quickNotes', JSON.stringify(notes))
}

function deleteNote(noteId) {
    notes = notes.filter(note => note.id != noteId)
    saveNotes()
    renderNotes()
}




function renderNotes() {
    const bodyElement = document.body;
  
    const notesContainer = document.getElementById('notesContainer');

    if (notes.length === 0) {
        // show some fall back elements
        notesContainer.innerHTML = `
      <div class="empty-state">
        <h2>No notes yet</h2>
        <p>Create your first note to get started!</p>
        <button class="add-note-btn" onclick="openNoteDialog()">+ Add Your First Note</button>
      </div>
       <img src="./assets/—Pngtree—new task add note vector_20746733.png" alt="" class="empty-img" height="300px" width="300px" style="margin: 0; padding: 0;">
    `
        notesContainer.classList.add('emptyNotes')
        
        return
    }

    notesContainer.innerHTML = notes.map(note => `
    <div class="note-card">
      <h3 class="note-title">${note.title}</h3>
      <p class="note-content">${note.content}</p>
      <div class="note-actions">
        <button class="edit-btn" onclick="openNoteDialog('${note.id}')" title="Edit Note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </button>
        <button class="delete-btn" onclick="deleteNote('${note.id}')" title="Delete Note">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
        </button>
      </div>

    </div>
    `).join('')

    notesContainer.classList.remove('emptyNotes')
}

function openNoteDialog(noteId = null) {
    const dialog = document.getElementById('noteDialog');
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');

    if (noteId) {
        // Edit Mode
        const noteToEdit = notes.find(note => note.id === noteId)
        editingNoteId = noteId
        document.getElementById('dialogTitle').textContent = 'Edit Note'
        titleInput.value = noteToEdit.title
        contentInput.value = noteToEdit.content
    }
    else {
        // Add Mode
        editingNoteId = null
        document.getElementById('dialogTitle').textContent = 'Add New Note'
        titleInput.value = ''
        contentInput.value = ''
    }

    dialog.showModal()
    titleInput.focus()

}

function closeNoteDialog() {
    document.getElementById('noteDialog').close()
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    document.getElementById('themeToggleBtn').textContent = isDark ? '☀️' : '🌙'
}

function applyStoredTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme')
        document.getElementById('themeToggleBtn').textContent = '☀️'
    }
}

document.addEventListener('DOMContentLoaded', function () {
    applyStoredTheme()
    notes = loadNotes()
    renderNotes()

    document.getElementById('noteForm').addEventListener('submit', saveNote)
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme)

    document.getElementById('noteDialog').addEventListener('click', function (event) {
        if (event.target === this) {
            closeNoteDialog()
        }
    })
})

