var TASKS_KEY = 'studyspace_tasks';
var NOTES_KEY = 'studyspace_notes';
var SESSIONS_KEY = 'studyspace_sessions';
var SEEDED_KEY = 'studyspace_seeded';

function readList(key) {
    try {
        var data = JSON.parse(localStorage.getItem(key));
        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
}

function writeList(key, list) {
    try {
        localStorage.setItem(key, JSON.stringify(list));
        return true;
    } catch (error) {
        return false;
    }
}

function getTasks() { return readList(TASKS_KEY); }
function saveTasks(tasks) { return writeList(TASKS_KEY, tasks); }

function getNotes() { return readList(NOTES_KEY); }
function saveNotes(notes) { return writeList(NOTES_KEY, notes); }

function getSessions() { return readList(SESSIONS_KEY); }
function saveSessions(sessions) { return writeList(SESSIONS_KEY, sessions); }

function isSeeded() {
    return localStorage.getItem(SEEDED_KEY) === 'true';
}

function setSeeded() {
    localStorage.setItem(SEEDED_KEY, 'true');
}

function resetAll() {
    localStorage.removeItem(TASKS_KEY);
    localStorage.removeItem(NOTES_KEY);
    localStorage.removeItem(SESSIONS_KEY);
    localStorage.removeItem(SEEDED_KEY);
    location.reload();
}