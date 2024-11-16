document.addEventListener('DOMContentLoaded', () => {
    const taskNameInput = document.getElementById('task-name');
    const importanceSelect = document.getElementById('importance');
    const difficultySelect = document.getElementById('difficulty');
    const dueDateInput = document.getElementById('due-date');
    const detailsInput = document.getElementById('task-details');
    const addTaskButton = document.getElementById('add-task-btn');
    const tasksContainer = document.getElementById('tasks-container');
    const taskListHeading = document.getElementById('task-list-heading');

    // Load tasks from localStorage
    loadTasks();
    detailsInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
        }
    });
    addTaskButton.addEventListener('click', addTask);

    function addTask() {
        const taskName = taskNameInput.value.trim();
        const importance = importanceSelect.value;
        const difficulty = difficultySelect.value;
        const dueDate = dueDateInput.value;
        const details = detailsInput.value.trim();
    
        if (!taskName || !importance || !difficulty || !dueDate) {
            alert('Please fill out all fields.');
            return;
        }
    
        const task = {
            id: Date.now(),
            taskName,
            importance,
            difficulty,
            dueDate,
            details,
            status: 'pending'
        };
    
        saveTask(task);
        renderTask(task);
        updateCounts();
    
        // Clear inputs
        taskNameInput.value = '';
        importanceSelect.value = '';
        difficultySelect.value = '';
        dueDateInput.value = '';
        detailsInput.value = '';
    
        // Ensure placeholder for due date is visible
        dueDateInput.className = '';
    }
    
    

    function saveTask(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        if (tasks.length > 0) {
            taskListHeading.style.display = 'block';
        }
        tasks.forEach(renderTask);
        updateCounts();
    }

    function renderTask(task) {
        const taskCard = document.createElement('div');
        taskCard.className = `task-card border-${task.difficulty.toLowerCase()}`;
        taskCard.dataset.id = task.id;

        taskCard.innerHTML = `
            <h3>${task.taskName}</h3>
            <p><strong>Importance:</strong> <span class="importance-${task.importance.toLowerCase()}">${task.importance}</span></p>
            <p><strong>Difficulty:</strong> <span class="difficulty-${task.difficulty.toLowerCase()}">${task.difficulty}</span></p>
            <p><strong>Due Date:</strong> ${task.dueDate}</p>
            <p><strong>Details:</strong> ${task.details}</p>
            <select class="status-select" onchange="updateTaskStatus(${task.id}, this.value)">
                <option value="status" disabled>Status</option>
                <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="on-hold" ${task.status === 'on-hold' ? 'selected' : ''}>On Hold</option>
                <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
            </select>
            <button class="delete-task-btn" onclick="deleteTask(${task.id})">&times;</button>
        `;

        tasksContainer.appendChild(taskCard);
        updateTaskListHeading();
    }

    function updateTaskStatus(taskId, newStatus) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateCounts();
    }

    function deleteTask(taskId) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        document.querySelector(`.task-card[data-id='${taskId}']`).remove();
        updateCounts();
        updateTaskListHeading();
    }

    function updateCounts() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const inProgressCount = tasks.filter(task => task.status === 'in-progress').length;
        const pendingCount = tasks.filter(task => task.status === 'pending').length;
        const onHoldCount = tasks.filter(task => task.status === 'on-hold').length;
        const completedCount = tasks.filter(task => task.status === 'completed').length;

        document.getElementById('in-progress-count').innerText = inProgressCount;
        document.getElementById('in-review-count').innerText = pendingCount;
        document.getElementById('on-hold-count').innerText = onHoldCount;
        document.getElementById('completed-count').innerText = completedCount;
    }

    function updateTaskListHeading() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        if (tasks.length > 0) {
            taskListHeading.style.display = 'block';
        } else {
            taskListHeading.style.display = 'none';
        }
    }

    window.updateTaskStatus = updateTaskStatus;
    window.deleteTask = deleteTask;
});
