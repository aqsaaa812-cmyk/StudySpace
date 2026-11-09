var currentFilter = 'all';
var currentPriority = 'Medium';
var currentSort = 'due';
var editingTaskId = null;

var filterNames = ['all', 'pending', 'completed'];

document.getElementById('taskDue').setAttribute('min', getTodayDate());

showTasks();

function markActive(selector, attribute, value) {
    var buttons = document.querySelectorAll(selector);

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.toggle('active', buttons[i].getAttribute(attribute) === value);
    }
}

function setPriority(priority) {
    currentPriority = priority;
    markActive('.priority-btn', 'data-priority', priority);
}

function setSort(sortBy) {
    currentSort = sortBy;
    markActive('.sort-btn', 'data-sort', sortBy);
    showTasks();
}

function setFilter(filter) {
    currentFilter = filter;

    var buttons = document.querySelectorAll('.filter-btn');

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.toggle('active', i === filterNames.indexOf(filter));
    }

    showTasks();
}

function priorityValue(priority) {
    var order = { High: 1, Medium: 2, Low: 3 };
    return order[priority] || 4;
}

function findTask(tasks, id) {
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            return tasks[i];
        }
    }

    return null;
}

function addTask() {
    var title = document.getElementById('taskTitle').value.trim();
    var subject = document.getElementById('taskSubject').value.trim();
    var due = document.getElementById('taskDue').value;
    var description = document.getElementById('taskDescription').value.trim();
    var errorBox = document.getElementById('formError');

    var tasks = getTasks();
    var editingTask = findTask(tasks, editingTaskId);
    var today = getTodayDate();

    var maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 6);
    var maxDateText = formatDate(maxDate);

    // Edit karte waqt purani date rakh sakte hain, chahe wo guzar chuki ho
    var keepsOldDate = editingTask !== null && editingTask.due === due;

    var message = '';

    if (title === '') {
        message = 'Task title is required.';
    } else if (title.length < 3) {
        message = 'Title must be at least 3 characters.';
    } else if (title.length > 80) {
        message = 'Title cannot be more than 80 characters.';
    } else if (subject === '') {
        message = 'Subject is required.';
    } else if (due === '') {
        message = 'Please select a due date.';
    } else if (due < today && !keepsOldDate) {
        message = 'Due date must be today or later.';
    } else if (due > maxDateText) {
        message = 'Due date cannot be more than 6 months away.';
    }

    if (message !== '') {
        errorBox.textContent = message;
        return;
    }

    if (editingTask) {
        editingTask.title = title;
        editingTask.subject = subject;
        editingTask.due = due;
        editingTask.priority = currentPriority;
        editingTask.description = description;
    } else {
        tasks.push({
            id: Date.now(),
            title: title,
            subject: subject,
            due: due,
            priority: currentPriority,
            description: description,
            completed: false
        });
    }

    if (!saveTasks(tasks)) {
        errorBox.textContent = 'Could not save. Browser storage may be full.';
        return;
    }

    editingTaskId = null;
    errorBox.textContent = '';
    document.getElementById('submitBtn').textContent = '+ Add Task';

    document.getElementById('taskTitle').value = '';
    document.getElementById('taskSubject').value = '';
    document.getElementById('taskDue').value = '';
    document.getElementById('taskDescription').value = '';
    setPriority('Medium');

    showTasks();
}

function toggleTask(id) {
    var tasks = getTasks();
    var task = findTask(tasks, id);

    if (task) {
        task.completed = !task.completed;
        saveTasks(tasks);
        showTasks();
    }
}

function deleteTask(id) {
    if (!confirm('Delete this task?')) {
        return;
    }

    var tasks = getTasks().filter(function (task) {
        return task.id !== id;
    });

    saveTasks(tasks);
    showTasks();
}

function editTask(id) {
    var task = findTask(getTasks(), id);

    if (!task) {
        return;
    }

    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskSubject').value = task.subject;
    document.getElementById('taskDue').value = task.due;
    document.getElementById('taskDescription').value = task.description || '';
    setPriority(task.priority || 'Medium');

    editingTaskId = id;
    document.getElementById('submitBtn').textContent = 'Update Task';
    document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth' });
}

function showTasks() {
    var container = document.getElementById('taskList');
    var search = document.getElementById('searchInput').value.trim().toLowerCase();

    var filtered = getTasks().filter(function (task) {
        if (currentFilter === 'pending' && task.completed) { return false; }
        if (currentFilter === 'completed' && !task.completed) { return false; }

        if (search !== '') {
            var inTitle = task.title.toLowerCase().indexOf(search) !== -1;
            var inSubject = task.subject.toLowerCase().indexOf(search) !== -1;
            return inTitle || inSubject;
        }

        return true;
    });

    filtered.sort(function (a, b) {
        if (currentSort === 'priority') {
            return priorityValue(a.priority) - priorityValue(b.priority);
        }

        if (currentSort === 'title') {
            return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        }

        return a.due.localeCompare(b.due);
    });

    document.getElementById('taskCount').textContent = filtered.length + ' tasks shown';

    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state">' +
            '<h3>No tasks found</h3>' +
            '<p>Add a task or change the filters.</p>' +
            '</div>';
        return;
    }

    var html = '';

    for (var i = 0; i < filtered.length; i++) {
        var t = filtered[i];
        var priority = t.priority || 'Medium';

        html += '<div class="task-item ' + (t.completed ? 'done' : '') + '">';
        html += '<div class="task-left">';
        html += '<div class="task-meta">';
        html += '<span class="task-subject">' + escapeHTML(t.subject) + '</span>';
        html += '<span class="task-priority priority-' + priority.toLowerCase() + '">' + escapeHTML(priority) + '</span>';
        html += '</div>';
        html += '<h4>' + escapeHTML(t.title) + '</h4>';

        if (t.description) {
            html += '<p class="task-desc">' + escapeHTML(t.description) + '</p>';
        }

        html += '<small>Due: ' + escapeHTML(t.due) + '</small>';
        html += '</div>';
        html += '<div class="task-actions">';
        html += '<button class="btn-small" onclick="toggleTask(' + t.id + ')">' + (t.completed ? 'Mark Pending' : 'Mark Done') + '</button>';
        html += '<button class="btn-small btn-edit" onclick="editTask(' + t.id + ')">Edit</button>';
        html += '<button class="btn-small btn-delete" onclick="deleteTask(' + t.id + ')">Delete</button>';
        html += '</div>';
        html += '</div>';
    }

    container.innerHTML = html;
}