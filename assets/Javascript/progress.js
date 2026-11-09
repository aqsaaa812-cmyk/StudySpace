function isCompleted(task) {
    return task.completed === true;
}

function getProgressMessage(total, percent) {
    if (total === 0) {
        return 'Add your first task to begin your progress journey.';
    }

    if (percent === 0) {
        return 'Your journey has started. Complete your first task!';
    }

    if (percent < 50) {
        return 'Good start! Keep completing your tasks.';
    }

    if (percent < 100) {
        return 'Great progress! You are more than halfway there.';
    }

    return 'Amazing! You have completed all your tasks.';
}

function showProgress() {
    var tasks = getTasks();
    var total = tasks.length;
    var completed = tasks.filter(isCompleted).length;
    var percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = total - completed;

    document.getElementById('progressPercent').textContent = percent + '%';
    document.getElementById('progressFill').style.width = percent + '%';
    document.getElementById('progressMessage').textContent = getProgressMessage(total, percent);

    showSubjectProgress(tasks);
}

function showSubjectProgress(tasks) {
    var subjects = {};

    tasks.forEach(function (task) {
        var name = task.subject || 'Other';

        if (!subjects[name]) {
            subjects[name] = { total: 0, completed: 0 };
        }

        subjects[name].total++;

        if (isCompleted(task)) {
            subjects[name].completed++;
        }
    });

    var html = '';

    for (var name in subjects) {
        var total = subjects[name].total;
        var completed = subjects[name].completed;
        var percent = Math.round((completed / total) * 100);

        html += '<div class="subject-progress-item">';
        html += '<div class="subject-progress-heading">';
        html += '<span>' + escapeHTML(name) + '</span>';
        html += '<span>' + completed + '/' + total + ' tasks</span>';
        html += '</div>';
        html += '<div class="progress-track">';
        html += '<div class="progress-fill" style="width: ' + percent + '%"></div>';
        html += '</div>';
        html += '</div>';
    }

    if (html === '') {
        html = '<p class="empty-progress">Add tasks with subjects to see your progress.</p>';
    }

    document.getElementById('subjectProgress').innerHTML = html;
}

showProgress();