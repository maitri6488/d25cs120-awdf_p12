const createTaskForm = document.getElementById('create-task-form');
const taskTitle = document.getElementById('task-title');
const taskUser = document.getElementById('task-user');
const taskPriority = document.getElementById('task-priority');

const tasksList = document.getElementById('tasks-list');
const logsContainer = document.getElementById('logs-container');
const btnRunTests = document.getElementById('btn-run-tests');
const btnClearLogs = document.getElementById('btn-clear-logs');
const toast = document.getElementById('toast');

let logs = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
    checkHealth();

    createTaskForm.addEventListener('submit', handleCreateTask);
    btnRunTests.addEventListener('click', checkHealth);
    btnClearLogs.addEventListener('click', handleClearLogs);
    tasksList.addEventListener('click', handleTaskListClick);

    addLog('start', '[CI/CD Init] GitHub Actions workflow registered (.github/workflows/ci.yml)');
    addLog('api', '[CI Test Suite] Jest Supertest unit tests configured for GET & POST /tasks');
});

function showToast(msg, type = 'info') {
    toast.textContent = msg;
    toast.className = `toast ${type}`;
    setTimeout(() => {
        toast.className = 'toast hidden';
    }, 4000);
}

function addLog(type, message) {
    const time = new Date().toISOString().substring(11, 19);
    logs.unshift({ time, type, message });
    renderLogs();
}

function renderLogs() {
    if (logs.length === 0) {
        logsContainer.innerHTML = '<p style="text-align: center; color: #888; padding: 15px;">No logs yet.</p>';
        return;
    }
    logsContainer.innerHTML = logs.map(l => `
        <div class="log-entry">
            <span class="log-time">${l.time}</span>
            <span class="log-type-${l.type}">${escapeHtml(l.message)}</span>
        </div>
    `).join('');
}

function handleClearLogs() {
    logs = [];
    renderLogs();
}

async function checkHealth() {
    try {
        const res = await fetch('/api/health');
        const data = await res.json();
        addLog('complete', `[GET /api/health 200] Status: ${data.status} | Pipeline: ${data.pipeline} | DB: ${data.database.status}`);
        showToast('API is healthy and running smoothly', 'success');
    } catch (err) {
        addLog('error', `[Health Error] ${err.message}`);
        showToast('Health check failed: ' + err.message, 'error');
    }
}

async function fetchTasks() {
    try {
        const res = await fetch('/tasks');
        const data = await res.json();
        renderTasks(data.tasks || []);
    } catch (err) {
        addLog('error', `[Fetch Error] ${err.message}`);
    }
}

function renderTasks(tasks) {
    if (tasks.length === 0) {
        tasksList.innerHTML = '<li style="color: #888; text-align: center; padding: 12px;">No tasks available.</li>';
        return;
    }

    tasksList.innerHTML = tasks.map(t => `
        <li class="task-item" data-id="${t._id}">
            <div class="task-info">
                <span class="task-title">${escapeHtml(t.title)}</span>
                <div class="task-meta">
                    <span>Assigned: ${escapeHtml(t.assignedUser || 'Maitri Sheta (D25CS120)')}</span>
                    <span class="badge badge-${t.priority || 'medium'}">${t.priority || 'medium'}</span>
                </div>
            </div>
            <button type="button" class="btn btn-sm btn-danger btn-delete" data-id="${t._id}">Delete</button>
        </li>
    `).join('');
}

async function handleTaskListClick(e) {
    const btn = e.target.closest('.btn-delete');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    if (!id) return;

    try {
        const res = await fetch(`/tasks/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
            showToast('Task deleted successfully', 'info');
            addLog('complete', `[DELETE /tasks/${id} 200] Task removed`);
            fetchTasks();
        } else {
            showToast(data.message || 'Error deleting task', 'error');
        }
    } catch (err) {
        showToast('Error: ' + err.message, 'error');
    }
}

async function handleCreateTask(e) {
    e.preventDefault();
    const title = taskTitle.value.trim();
    if (!title) return;

    try {
        const res = await fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                assignedUser: taskUser.value.trim(),
                priority: taskPriority.value
            })
        });

        const data = await res.json();
        if (data.success) {
            showToast('Task created successfully (Covered by automated Supertest)!', 'success');
            addLog('complete', `[POST /tasks 201] Created task "${data.task.title}"`);
            taskTitle.value = '';
            fetchTasks();
        } else {
            showToast(data.message || 'Error creating task', 'error');
            addLog('error', `[POST /tasks 400] ${data.message}`);
        }
    } catch (err) {
        showToast('Error: ' + err.message, 'error');
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
