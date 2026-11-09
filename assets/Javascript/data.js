var sampleTasks = [
    { id: 1, title: 'Complete JavaScript arrays practice', subject: 'JavaScript', due: '2026-10-30', completed: true },
    { id: 2, title: 'Revise HTML forms', subject: 'HTML', due: '2026-10-30', completed: false },
    { id: 3, title: 'CSS Flexbox exercises', subject: 'CSS', due: '2026-10-31', completed: false },
    { id: 4, title: 'Read about Local Storage', subject: 'JavaScript', due: '2026-10-29', completed: true },
    { id: 5, title: 'Build a small calculator', subject: 'JavaScript', due: '2026-11-02', completed: false },
    { id: 6, title: 'Practice DOM manipulation', subject: 'JavaScript', due: '2026-11-01', completed: false },
    { id: 7, title: 'Revise CSS Grid basics', subject: 'CSS', due: '2026-10-28', completed: false }
];

var sampleNotes = [
    { id: 1, title: 'JavaScript Arrays', subject: 'Computer Science', content: 'push(), pop(), shift(), unshift(), map(), filter(), reduce().', createdAt: '2026-10-25' },
    { id: 2, title: 'HTML Forms', subject: 'Computer Science', content: 'input types: text, email, password, checkbox, radio, submit.', createdAt: '2026-10-26' },
    { id: 3, title: 'CSS Flexbox', subject: 'Computer Science', content: 'display: flex, justify-content, align-items, flex-direction, gap.', createdAt: '2026-10-27' },
    { id: 4, title: 'Local Storage', subject: 'Computer Science', content: 'localStorage.setItem(), getItem(), removeItem(), clear().', createdAt: '2026-10-28' }
];

var sampleSessions = [
    { id: 1, title: 'JavaScript Practice', subject: 'JavaScript', day: 'Monday', date: '', start: '18:00', end: '19:30', notes: '' },
    { id: 2, title: 'HTML and CSS', subject: 'Web Design', day: 'Tuesday', date: '', start: '17:00', end: '18:30', notes: '' },
    { id: 3, title: 'JavaScript Practice', subject: 'JavaScript', day: 'Wednesday', date: '', start: '18:00', end: '19:30', notes: '' },
    { id: 4, title: 'Practice Projects', subject: 'Projects', day: 'Thursday', date: '', start: '19:00', end: '20:30', notes: '' },
    { id: 5, title: 'Revision', subject: 'Revision', day: 'Friday', date: '', start: '17:00', end: '18:00', notes: '' },
    { id: 6, title: 'JavaScript Practice', subject: 'JavaScript', day: 'Saturday', date: '', start: '10:00', end: '12:00', notes: '' }
];

function loadSampleData() {
    if (!isSeeded()) {
        saveTasks(sampleTasks);
        saveNotes(sampleNotes);
        saveSessions(sampleSessions);
        setSeeded();
    }
}

loadSampleData();