// Get HTML elements
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Load all tasks
async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');

        if (!response.ok) {
            throw new Error('Failed to load tasks');
        }

        const tasks = await response.json();

        taskList.innerHTML = '';

        if (tasks.length === 0) {
            taskList.textContent = 'No tasks available.';
            return;
        }

        tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';

            const title = document.createElement('h3');
            title.textContent = task.title;

            const description = document.createElement('p');
            description.textContent = task.description || 'No description';

            const status = document.createElement('p');
            status.textContent = `Status: ${task.status}`;

            // Complete button
            const completeBtn = document.createElement('button');
            completeBtn.textContent =
                task.status === 'completed' ? 'Mark Pending' : 'Complete';

            completeBtn.addEventListener('click', () => {
                updateTaskStatus(
                    task.id,
                    task.status === 'completed' ? 'pending' : 'completed'
                );
            });

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.style.backgroundColor = '#dc2626';

            deleteBtn.addEventListener('click', () => {
                deleteTask(task.id);
            });

            taskItem.appendChild(title);
            taskItem.appendChild(description);
            taskItem.appendChild(status);
            taskItem.appendChild(completeBtn);
            taskItem.appendChild(deleteBtn);

            taskList.appendChild(taskItem);
        });

    } catch (error) {
        console.error(error);
        taskList.textContent = 'Unable to load tasks.';
    }
}

// Add a task
async function addTask() {
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();

    if (!title) {
        alert('Please enter a task title!');
        return;
    }

    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        taskTitle.value = '';
        taskDescription.value = '';

        await loadTasks();

    } catch (error) {
        alert(error.message);
    }
}

// Update task status
async function updateTaskStatus(id, status) {
    try {
        const response = await fetch(`/api/tasks/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        await loadTasks();

    } catch (error) {
        alert(error.message);
    }
}

// Delete a task
async function deleteTask(id) {
    const confirmDelete = confirm(
        'Are you sure you want to delete this task?'
    );

    if (!confirmDelete) return;

    try {
        const response = await fetch(`/api/tasks/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        await loadTasks();

    } catch (error) {
        alert(error.message);
    }
}

// Button event
addTaskBtn.addEventListener('click', addTask);

// Load tasks when page opens
loadTasks();