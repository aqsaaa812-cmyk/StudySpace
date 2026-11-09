var sessions = getSessions().filter(function (item) {
    return item.start && item.end;
});

var sessionForm = document.getElementById('sessionForm');
var weeklySchedule = document.getElementById('weeklySchedule');
var sessionError = document.getElementById('sessionError');

var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function showError(message) {
    sessionError.textContent = message;
    sessionError.hidden = !message;
}

sessionForm.addEventListener('submit', function (event) {
    event.preventDefault();

    var title = document.getElementById('sessionTitle').value.trim();
    var subject = document.getElementById('sessionSubject').value.trim();
    var day = document.getElementById('sessionDay').value;
    var date = document.getElementById('sessionDate').value;
    var start = document.getElementById('startTime').value;
    var end = document.getElementById('endTime').value;
    var sessionNotes = document.getElementById('sessionNotes').value.trim();

    if (title.length < 3 || title.length > 60) {
        showError('Title must contain 3 to 60 characters.');
        return;
    }

    if (subject.length < 2 || subject.length > 40) {
        showError('Subject must contain 2 to 40 characters.');
        return;
    }

    if (!days.includes(day)) {
        showError('Please select a valid day.');
        return;
    }

    if (date) {
        var selectedDate = new Date(date + 'T12:00:00');
        var actualDay = days[(selectedDate.getDay() + 6) % 7];

        if (actualDay !== day) {
            showError('The selected date does not match the chosen day.');
            return;
        }
    }

    if (!start || !end) {
        showError('Please select the start and end times.');
        return;
    }

    if (start >= end) {
        showError('End time must be later than start time.');
        return;
    }

    if (sessionNotes.length > 200) {
        showError('Notes cannot exceed 200 characters.');
        return;
    }

    // Same din aur same date pe time overlap nahi hona chahiye
    for (var i = 0; i < sessions.length; i++) {
        var sameDay = sessions[i].day === day && sessions[i].date === date;
        var overlap = start < sessions[i].end && end > sessions[i].start;

        if (sameDay && overlap) {
            showError('These timings overlap with another session.');
            return;
        }
    }

    sessions.push({
        id: Date.now(),
        title: title,
        subject: subject,
        day: day,
        date: date,
        start: start,
        end: end,
        notes: sessionNotes
    });

    if (!saveSessions(sessions)) {
        sessions.pop();
        showError('Unable to save. Check your browser storage.');
        return;
    }

    sessionForm.reset();
    showError('');
    renderSchedule();
});

function formatTime(time) {
    var parts = time.split(':');
    var hour = Number(parts[0]);
    var suffix = hour >= 12 ? 'PM' : 'AM';

    hour = hour % 12 || 12;

    return hour + ':' + parts[1] + ' ' + suffix;
}

function renderSchedule() {
    var html = '';

    for (var d = 0; d < days.length; d++) {
        var day = days[d];

        var daySessions = sessions.filter(function (item) {
            return item.day === day;
        });

        daySessions.sort(function (a, b) {
            return a.start.localeCompare(b.start);
        });

        html += '<div class="tt-day">';
        html += '<div class="tt-day-heading">';
        html += '<h3>' + day + '</h3>';
        html += '<span>' + daySessions.length + ' session(s)</span>';
        html += '</div>';

        if (daySessions.length === 0) {
            html += '<p class="tt-empty">No sessions planned</p>';
        }

        for (var j = 0; j < daySessions.length; j++) {
            var item = daySessions[j];

            html += '<div class="tt-session">';
            html += '<div class="tt-session-time">' + formatTime(item.start);
            html += '<span>to ' + formatTime(item.end) + '</span>';
            html += '</div>';

            html += '<div class="tt-session-info">';
            html += '<h4>' + escapeHTML(item.title) + '</h4>';
            html += '<p>' + escapeHTML(item.subject) + '</p>';

            if (item.date) {
                html += '<small>' + escapeHTML(item.date) + '</small>';
            }

            if (item.notes) {
                html += '<p class="tt-notes">' + escapeHTML(item.notes) + '</p>';
            }

            html += '</div>';
            html += '<button type="button" class="tt-delete" onclick="deleteSession(' + Number(item.id) + ')">Delete</button>';
            html += '</div>';
        }

        html += '</div>';
    }

    weeklySchedule.innerHTML = html;
}

function deleteSession(id) {
    if (!confirm('Delete this study session?')) {
        return;
    }

    var oldSessions = sessions;

    sessions = sessions.filter(function (item) {
        return item.id !== id;
    });

    if (!saveSessions(sessions)) {
        sessions = oldSessions;
        return;
    }

    renderSchedule();
}

renderSchedule();