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

  // optional safeguard (browser required fields usually handle this)
  if (!title && !content) return;

  if (editingNoteId) {
    // Update existing Note
    const noteIndex = notes.findIndex(note => note.id === editingNoteId)
    if (noteIndex !== -1) {
      notes[noteIndex] = {
        ...notes[noteIndex],
        title: title,
        content: content
      }
    } else {
      // fallback: if not found, create new
      notes.unshift({
        id: generateId(),
        title,
        content
      })
    }
  } else {
    // Add New Note
    notes.unshift({
      id: generateId(),
      title,
      content
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
  // confirm deletion so user doesn't accidentally delete
  const should = confirm('Are you sure to delete this note?')
  if (!should) return

  notes = notes.filter(note => note.id != noteId)
  saveNotes()
  renderNotes()
}

function renderNotes() {
  const notesContainer = document.getElementById('notesContainer');

  if (notes.length === 0) {
    // show some fall back elements
    notesContainer.innerHTML = `
      <div class="empty-state">
        <h2>No notes yet</h2>
        <p>Create your first note to get started!</p>
        <button class="add-note-btn" onclick="openNoteDialog()">+ Add Your First Note</button>
      </div>
      <img src="./assets/—Pngtree—new task add note vector_20746733.png" alt="" class="empty-img" height="300" width="300" style="margin: 0; padding: 0;">
    `
    notesContainer.classList.add('emptyNotes')
    return
  }

  notesContainer.innerHTML = notes.map(note => `
    <div class="notes-container">
      <div class="note-card note" onclick="openNote(this)">
        <h3 class="note-title">${escapeHtml(note.title)}</h3>
        <p class="note-content">${escapeHtml(note.content)}</p>
        <div class="note-actions">
          <button class="edit-btn" onclick="event.stopPropagation(); openNoteDialog('${note.id}')" title="Edit Note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
          </button>
          <button class="delete-btn" onclick="event.stopPropagation(); deleteNote('${note.id}')" title="Delete Note">
            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor" aria-hidden="true">
              <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `).join('')

  notesContainer.classList.remove('emptyNotes')
}

// Basic HTML escaping to avoid accidental HTML injection if users paste HTML
function escapeHtml(unsafe) {
  if (!unsafe && unsafe !== '') return ''
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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
    if (noteToEdit) {
      titleInput.value = noteToEdit.title
      contentInput.value = noteToEdit.content
    } else {
      titleInput.value = ''
      contentInput.value = ''
    }
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

  // Close dialog when clicking on backdrop
  document.getElementById('noteDialog').addEventListener('click', function (event) {
    if (event.target === this) {
      closeNoteDialog()
    }
  })

  // Popup overlay click to close - already present in your code but keep here for clarity
  const popupOverlay = document.getElementById('popup')
  if (popupOverlay) {
    popupOverlay.addEventListener('click', (e) => {
      if (e.target === popupOverlay) closeNote()
    })
  }

  // Escape key to close dialog or popup
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // close dialog if open
      const dialog = document.getElementById('noteDialog')
      if (dialog && dialog.open) dialog.close()

      // close popup if open
      const popup = document.getElementById('popup')
      if (popup && popup.style.display === 'flex') popup.style.display = 'none'
    }
  })
})

function openNote(noteElement) {
  const title = noteElement.querySelector("h3").innerText;
  const text = noteElement.querySelector("p").innerText;

  document.getElementById("popup-title").innerText = title;
  document.getElementById("popup-text").innerText = text;

  document.getElementById("popup").style.display = "flex";
}

function closeNote() {
  document.getElementById("popup").style.display = "none";
}
