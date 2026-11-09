function loadDashboard() {
    var tasks = getTasks();
    var total = tasks.length;
    var completed = 0;

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].completed === true) {
            completed++;
        }
    }

    var percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = total - completed;
    document.getElementById('totalSessions').textContent = getSessions().length;
    document.getElementById('completionPercent').textContent = percent + '%';
    document.getElementById('completionBar').style.width = percent + '%';

    showTodayTasks(tasks);
}

function showTodayTasks(tasks) {
    var container = document.getElementById('todayTasks');
    var today = getTodayDate();
    var html = '';
    var count = 0;

    for (var i = 0; i < tasks.length; i++) {
        var task = tasks[i];
        var isToday = task.due === today;
        var isOverdue = task.completed === false && task.due < today;

        if (!isToday && !isOverdue) {
            continue;
        }

        count++;

        var extraClass = task.completed ? 'done' : '';
        var dueText = 'Due: ' + escapeHTML(task.due);

        if (isOverdue) {
            extraClass += ' overdue';
            dueText += ' (overdue)';
        }

        html += '<div class="task-item ' + extraClass + '">';
        html += '<div class="task-left">';
        html += '<span class="task-subject">' + escapeHTML(task.subject) + '</span>';
        html += '<h4>' + escapeHTML(task.title) + '</h4>';
        html += '<small>' + dueText + '</small>';
        html += '</div>';
        html += '<span class="task-status">' + (task.completed ? 'Done' : 'Pending') + '</span>';
        html += '</div>';
    }

    if (count === 0) {
        html = '<div class="empty-state">' +
            '<h3>No tasks for today</h3>' +
            '<p>Add a task and start planning your day.</p>' +
            '</div>';
    }

    container.innerHTML = html;
}

loadDashboard();