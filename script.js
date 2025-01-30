document.addEventListener('DOMContentLoaded', () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskForm = document.getElementById('task-form');
    const taskInputForm = document.getElementById('task-input-form');
    const taskList = document.getElementById('task-list');
    const filterTasks = document.getElementById('filter-tasks');
    const sortTasksBtn = document.getElementById('sort-tasks');

    // Load tasks and update dashboard
    loadTasks();

    // Show/hide task form
    addTaskBtn.addEventListener('click', () => {
        taskForm.classList.toggle('hidden');
    });

    // Add new task
    taskInputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const task = {
            id: Date.now(),
            name: document.getElementById('task-name').value,
            details: document.getElementById('task-details').value,
            importance: document.getElementById('task-importance').value,
            difficulty: document.getElementById('task-difficulty').value,
            dueDate: document.getElementById('task-due-date').value,
            status: 'pending'
        };
        tasks.push(task);
        saveTasks();
        loadTasks();
        taskInputForm.reset();
        taskForm.classList.add('hidden');
    });

    // Load tasks into the UI
    function loadTasks() {
        taskList.innerHTML = '';
        const filter = filterTasks.value;
        const filteredTasks = filter === 'all' ? tasks : tasks.filter(task => task.status === filter);

        filteredTasks.forEach((task) => {
            const taskCard = document.createElement('div');
            taskCard.className = `task-card ${task.importance === 'high' ? 'bg-red-50' : task.importance === 'medium' ? 'bg-yellow-50' : 'bg-green-50'}`;
            taskCard.draggable = true;
            taskCard.id = `task-${task.id}`;
            taskCard.setAttribute('data-importance', task.importance);

            taskCard.innerHTML = `
            <div class="task-card-header">
                <h3 class="text-xl font-bold text-gray-900">${task.name}</h3>
                <span class="drag-handle">&#9776;</span>
            </div>
            <p class="text-gray-700 mb-4">${task.details}</p>
            <p class="text-gray-600"><strong>Due Date:</strong> ${task.dueDate}</p>
            <p class="text-gray-600"><strong>Difficulty:</strong> <span class="difficulty-value" data-difficulty="${task.difficulty}">${task.difficulty}</span></p>
            <p class="text-gray-600"><strong>Importance:</strong> <span class="importance-value" data-importance="${task.importance}">${task.importance}</span></p>
            <div class="task-card-footer">
                <select onchange="updateStatus(${task.id}, this.value)" class="status-box">
                    <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                    <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
            </div>
            <span onclick="deleteTask(${task.id})" class="trash-icon"><i class="fas fa-trash"></i></span>
        `;

            taskList.appendChild(taskCard);
        });
        updateDashboard();
    }

    // Update task status
    window.updateStatus = (id, status) => {
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.status = status;
            saveTasks();
            loadTasks();
        }
    };

    // Delete task
    window.deleteTask = (id) => {
        const index = tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            tasks.splice(index, 1);
            saveTasks();
            loadTasks();
        }
    };

    // Save tasks to local storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Update dashboard counts
    function updateDashboard() {
        const pendingCount = tasks.filter(task => task.status === 'pending').length;
        const inProgressCount = tasks.filter(task => task.status === 'in-progress').length;
        const completedCount = tasks.filter(task => task.status === 'completed').length;
        const dueTodayCount = tasks.filter(task => {
            const today = new Date().toISOString().split('T')[0];
            return task.dueDate === today && task.status !== 'completed';
        }).length;

        document.getElementById('pending-count').textContent = pendingCount;
        document.getElementById('in-progress-count').textContent = inProgressCount;
        document.getElementById('completed-count').textContent = completedCount;
        document.getElementById('due-today-count').textContent = dueTodayCount;
    }

    // Filter tasks
    filterTasks.addEventListener('change', () => {
        loadTasks();
    });

    const sortTasks = document.getElementById('sort-tasks');

    // Sort tasks based on selected criteria
    sortTasks.addEventListener('change', () => {
        const sortBy = sortTasks.value;

        if (sortBy === 'due-date') {
            tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)); // Sort by due date
        } else if (sortBy === 'importance') {
            const importanceOrder = { high: 3, medium: 2, low: 1 }; // Define importance levels
            tasks.sort((a, b) => importanceOrder[b.importance] - importanceOrder[a.importance]); // Sort by importance
        } else if (sortBy === 'difficulty') {
            const difficultyOrder = { hard: 3, medium: 2, easy: 1 }; // Define difficulty levels
            tasks.sort((a, b) => difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty]); // Sort by difficulty
        }

        loadTasks(); // Reload tasks after sorting
    });
});