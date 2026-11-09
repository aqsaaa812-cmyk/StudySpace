var notes = getNotes();

var noteForm = document.getElementById('noteForm');
var notesList = document.getElementById('notesList');
var noteError = document.getElementById('noteError');
var noteSummary = document.getElementById('noteSummary');

var noteTitle = document.getElementById('noteTitle');
var noteSubject = document.getElementById('noteSubject');
var noteContent = document.getElementById('noteContent');

var searchNotes = document.getElementById('searchNotes');
var filterSubject = document.getElementById('filterSubject');
var characterCount = document.getElementById('characterCount');

var validSubjects = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'English',
    'Biology',
    'Other'
];

function showNoteError(message) {
    noteError.textContent = message;
    noteError.hidden = !message;
}

noteContent.addEventListener('input', function () {
    characterCount.textContent = noteContent.value.length + ' / 5000 characters';
});

noteForm.addEventListener('submit', function (event) {
    event.preventDefault();

    var title = noteTitle.value.trim();
    var subject = noteSubject.value;
    var content = noteContent.value.trim();

    if (title.length < 3 || title.length > 80) {
        showNoteError('Title must contain 3 to 80 characters.');
        return;
    }

    if (!validSubjects.includes(subject)) {
        showNoteError('Please select a valid subject.');
        return;
    }

    if (content.length < 5 || content.length > 5000) {
        showNoteError('Note must contain 5 to 5000 characters.');
        return;
    }

    notes.unshift({
        id: Date.now(),
        title: title,
        subject: subject,
        content: content,
        createdAt: new Date().toLocaleDateString()
    });

    if (!saveNotes(notes)) {
        notes.shift();
        showNoteError('Could not save note. Browser storage may be full.');
        return;
    }

    noteForm.reset();
    characterCount.textContent = '0 / 5000 characters';
    showNoteError('');
    renderNotes();
});

searchNotes.addEventListener('input', renderNotes);
filterSubject.addEventListener('change', renderNotes);

function renderNotes() {
    var search = searchNotes.value.trim().toLowerCase();
    var subjectFilter = filterSubject.value;

    var html = '';
    var visibleCount = 0;

    for (var i = 0; i < notes.length; i++) {
        var note = notes[i];

        var matchesSearch =
            note.title.toLowerCase().includes(search) ||
            note.content.toLowerCase().includes(search) ||
            note.subject.toLowerCase().includes(search);

        var matchesSubject = subjectFilter === 'all' || note.subject === subjectFilter;

        if (!matchesSearch || !matchesSubject) {
            continue;
        }

        visibleCount++;

        html += '<article class="note-card">';
        html += '<div class="note-card-top">';
        html += '<span class="note-subject">' + escapeHTML(note.subject) + '</span>';
        html += '<button class="note-delete" type="button" onclick="deleteNote(' + Number(note.id) + ')">Delete</button>';
        html += '</div>';
        html += '<h3>' + escapeHTML(note.title) + '</h3>';
        html += '<p class="note-content">' + escapeHTML(note.content) + '</p>';
        html += '<small class="note-date">Created: ' + escapeHTML(note.createdAt) + '</small>';
        html += '</article>';
    }

    if (visibleCount === 0) {
        html = '<div class="notes-empty">' +
            '<h3>No notes found</h3>' +
            '<p>Try another search or create a new note.</p>' +
            '</div>';
    }

    notesList.innerHTML = html;
    noteSummary.textContent = visibleCount + ' of ' + notes.length + ' notes displayed.';
}

function deleteNote(id) {
    if (!confirm('Are you sure you want to delete this note?')) {
        return;
    }

    var oldNotes = notes;

    notes = notes.filter(function (note) {
        return note.id !== id;
    });

    if (!saveNotes(notes)) {
        notes = oldNotes;
        return;
    }

    renderNotes();
}

renderNotes();