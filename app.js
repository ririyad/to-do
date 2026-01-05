/**
 * Sprint To-Do App
 * A modern task management app with sprint-based organization
 */

// ===== State Management =====
const state = {
    sprints: [],
    completedSprints: []
};

// ===== Storage Keys =====
const STORAGE_KEYS = {
    SPRINTS: 'sprintTodo_sprints',
    COMPLETED_SPRINTS: 'sprintTodo_completedSprints'
};

// ===== DOM Elements =====
const elements = {
    // Sprint Form
    toggleSprintFormBtn: document.getElementById('toggleSprintForm'),
    sprintFormContainer: document.getElementById('sprintFormContainer'),
    sprintForm: document.getElementById('sprintForm'),
    cancelSprintFormBtn: document.getElementById('cancelSprintForm'),
    sprintNameInput: document.getElementById('sprintName'),
    sprintDescriptionInput: document.getElementById('sprintDescription'),
    sprintDurationInput: document.getElementById('sprintDuration'),

    // Sprint Containers
    activeSprintsContainer: document.getElementById('activeSprintsContainer'),
    completedSprintsContainer: document.getElementById('completedSprintsContainer'),
    noActiveSprintsMessage: document.getElementById('noActiveSprintsMessage'),
    noCompletedSprintsMessage: document.getElementById('noCompletedSprintsMessage'),
    activeSprintCount: document.getElementById('activeSprintCount'),
    completedSprintCount: document.getElementById('completedSprintCount'),

    // Completed Sprints Toggle
    toggleCompletedSprints: document.getElementById('toggleCompletedSprints'),

    // Task Modal
    taskModal: document.getElementById('taskModal'),
    taskForm: document.getElementById('taskForm'),
    closeTaskModalBtn: document.getElementById('closeTaskModal'),
    cancelTaskFormBtn: document.getElementById('cancelTaskForm'),
    taskSprintIdInput: document.getElementById('taskSprintId'),
    taskNameInput: document.getElementById('taskName'),
    taskDescriptionInput: document.getElementById('taskDescription'),

    // Templates
    sprintTemplate: document.getElementById('sprintTemplate'),
    taskTemplate: document.getElementById('taskTemplate')
};

// ===== Utility Functions =====
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDuration(days) {
    if (days === 1) return '1 day';
    return `${days} days`;
}

function saveToStorage() {
    try {
        localStorage.setItem(STORAGE_KEYS.SPRINTS, JSON.stringify(state.sprints));
        localStorage.setItem(STORAGE_KEYS.COMPLETED_SPRINTS, JSON.stringify(state.completedSprints));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function loadFromStorage() {
    try {
        const savedSprints = localStorage.getItem(STORAGE_KEYS.SPRINTS);
        const savedCompletedSprints = localStorage.getItem(STORAGE_KEYS.COMPLETED_SPRINTS);

        if (savedSprints) {
            state.sprints = JSON.parse(savedSprints);
        }
        if (savedCompletedSprints) {
            state.completedSprints = JSON.parse(savedCompletedSprints);
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}

// ===== Sprint Functions =====
function createSprint(name, description, duration) {
    const sprint = {
        id: generateId(),
        name: name,
        description: description,
        duration: parseInt(duration) || 7,
        tasks: [],
        createdAt: new Date().toISOString()
    };

    state.sprints.push(sprint);
    saveToStorage();
    renderActiveSprints();
    return sprint;
}

function endSprint(sprintId) {
    const sprintIndex = state.sprints.findIndex(s => s.id === sprintId);
    if (sprintIndex === -1) return;

    const sprint = state.sprints[sprintIndex];
    sprint.completedAt = new Date().toISOString();

    // Move to completed sprints
    state.completedSprints.unshift(sprint);
    state.sprints.splice(sprintIndex, 1);

    saveToStorage();
    renderActiveSprints();
    renderCompletedSprints();
}

function calculateProgress(sprint) {
    if (!sprint.tasks || sprint.tasks.length === 0) return 0;
    const completedTasks = sprint.tasks.filter(t => t.status === 'done').length;
    return Math.round((completedTasks / sprint.tasks.length) * 100);
}

// ===== Task Functions =====
function addTask(sprintId, name, description) {
    const sprint = state.sprints.find(s => s.id === sprintId);
    if (!sprint) return null;

    const task = {
        id: generateId(),
        name: name,
        description: description,
        status: 'not-done', // 'not-done' or 'done'
        createdAt: new Date().toISOString()
    };

    sprint.tasks.push(task);
    saveToStorage();
    renderActiveSprints();
    return task;
}

function updateTaskStatus(sprintId, taskId, status) {
    const sprint = state.sprints.find(s => s.id === sprintId);
    if (!sprint) return;

    const task = sprint.tasks.find(t => t.id === taskId);
    if (!task) return;

    task.status = status;
    saveToStorage();
    renderActiveSprints();
}

function deleteTask(sprintId, taskId) {
    const sprint = state.sprints.find(s => s.id === sprintId);
    if (!sprint) return;

    const taskIndex = sprint.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    sprint.tasks.splice(taskIndex, 1);
    saveToStorage();
    renderActiveSprints();
}

// ===== Rendering Functions =====
function renderActiveSprints() {
    const container = elements.activeSprintsContainer;

    // Update count
    elements.activeSprintCount.textContent = state.sprints.length;

    // Clear container (except empty state message)
    const existingCards = container.querySelectorAll('.sprint-card');
    existingCards.forEach(card => card.remove());

    // Show/hide empty state
    if (state.sprints.length === 0) {
        elements.noActiveSprintsMessage.classList.remove('hidden');
        return;
    }

    elements.noActiveSprintsMessage.classList.add('hidden');

    // Render each sprint
    state.sprints.forEach(sprint => {
        const sprintCard = renderSprintCard(sprint, false);
        container.appendChild(sprintCard);
    });
}

function renderCompletedSprints() {
    const container = elements.completedSprintsContainer;

    // Update count
    elements.completedSprintCount.textContent = state.completedSprints.length;

    // Clear container (except empty state message)
    const existingCards = container.querySelectorAll('.sprint-card');
    existingCards.forEach(card => card.remove());

    // Show/hide empty state
    if (state.completedSprints.length === 0) {
        elements.noCompletedSprintsMessage.classList.remove('hidden');
        return;
    }

    elements.noCompletedSprintsMessage.classList.add('hidden');

    // Render each completed sprint
    state.completedSprints.forEach(sprint => {
        const sprintCard = renderSprintCard(sprint, true);
        container.appendChild(sprintCard);
    });
}

function renderSprintCard(sprint, isCompleted) {
    const template = elements.sprintTemplate.content.cloneNode(true);
    const card = template.querySelector('.sprint-card');

    // Set sprint data
    card.dataset.sprintId = sprint.id;
    card.querySelector('.sprint-name').textContent = sprint.name;
    card.querySelector('.sprint-description').textContent = sprint.description || 'No description';
    card.querySelector('.duration-text').textContent = formatDuration(sprint.duration);

    // Update tasks count
    const taskCount = sprint.tasks ? sprint.tasks.length : 0;
    card.querySelector('.tasks-text').textContent = `${taskCount} task${taskCount !== 1 ? 's' : ''}`;

    // Calculate and display progress
    const progress = calculateProgress(sprint);
    const progressFill = card.querySelector('.progress-fill');
    const progressText = card.querySelector('.progress-text');
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${progress}%`;

    // Render tasks
    const tasksList = card.querySelector('.tasks-list');
    const noTasksMessage = card.querySelector('.no-tasks-message');

    if (sprint.tasks && sprint.tasks.length > 0) {
        noTasksMessage.classList.add('hidden');
        sprint.tasks.forEach(task => {
            const taskElement = renderTaskItem(task, sprint.id, isCompleted);
            tasksList.appendChild(taskElement);
        });
    } else {
        noTasksMessage.classList.remove('hidden');
    }

    // Set up event listeners for active sprints
    if (!isCompleted) {
        const addTaskBtn = card.querySelector('.add-task-btn');
        const endSprintBtn = card.querySelector('.end-sprint-btn');

        addTaskBtn.addEventListener('click', () => openTaskModal(sprint.id));
        endSprintBtn.addEventListener('click', () => {
            if (confirm(`Are you sure you want to end "${sprint.name}"?`)) {
                endSprint(sprint.id);
            }
        });
    }

    return card;
}

function renderTaskItem(task, sprintId, isCompleted) {
    const template = elements.taskTemplate.content.cloneNode(true);
    const taskItem = template.querySelector('.task-item');

    taskItem.dataset.taskId = task.id;
    taskItem.querySelector('.task-name').textContent = task.name;
    taskItem.querySelector('.task-description').textContent = task.description || '';

    const checkbox = taskItem.querySelector('.task-status-checkbox');
    checkbox.checked = task.status === 'done';

    if (task.status === 'done') {
        taskItem.classList.add('completed');
    }

    // Set up event listeners for active sprint tasks
    if (!isCompleted) {
        checkbox.addEventListener('change', (e) => {
            const newStatus = e.target.checked ? 'done' : 'not-done';
            updateTaskStatus(sprintId, task.id, newStatus);
        });

        const deleteBtn = taskItem.querySelector('.delete-task-btn');
        deleteBtn.addEventListener('click', () => {
            if (confirm('Delete this task?')) {
                deleteTask(sprintId, task.id);
            }
        });
    } else {
        // Disable interactions for completed sprints
        checkbox.disabled = true;
        taskItem.querySelector('.task-actions').remove();
    }

    return taskItem;
}

// ===== Modal Functions =====
function openTaskModal(sprintId) {
    elements.taskSprintIdInput.value = sprintId;
    elements.taskModal.classList.remove('hidden');
    elements.taskNameInput.focus();
}

function closeTaskModal() {
    elements.taskModal.classList.add('hidden');
    elements.taskForm.reset();
}

// ===== Event Listeners =====
function initEventListeners() {
    // Toggle Sprint Form
    elements.toggleSprintFormBtn.addEventListener('click', () => {
        elements.sprintFormContainer.classList.toggle('hidden');
        if (!elements.sprintFormContainer.classList.contains('hidden')) {
            elements.sprintNameInput.focus();
        }
    });

    // Cancel Sprint Form
    elements.cancelSprintFormBtn.addEventListener('click', () => {
        elements.sprintFormContainer.classList.add('hidden');
        elements.sprintForm.reset();
    });

    // Submit Sprint Form
    elements.sprintForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = elements.sprintNameInput.value.trim();
        const description = elements.sprintDescriptionInput.value.trim();
        const duration = elements.sprintDurationInput.value;

        if (name) {
            createSprint(name, description, duration);
            elements.sprintForm.reset();
            elements.sprintFormContainer.classList.add('hidden');
        }
    });

    // Toggle Completed Sprints
    elements.toggleCompletedSprints.addEventListener('click', () => {
        elements.toggleCompletedSprints.classList.toggle('collapsed');
        elements.completedSprintsContainer.classList.toggle('hidden');
    });

    // Task Modal Events
    elements.closeTaskModalBtn.addEventListener('click', closeTaskModal);
    elements.cancelTaskFormBtn.addEventListener('click', closeTaskModal);

    // Close modal on overlay click
    elements.taskModal.addEventListener('click', (e) => {
        if (e.target === elements.taskModal) {
            closeTaskModal();
        }
    });

    // Submit Task Form
    elements.taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const sprintId = elements.taskSprintIdInput.value;
        const name = elements.taskNameInput.value.trim();
        const description = elements.taskDescriptionInput.value.trim();

        if (sprintId && name) {
            addTask(sprintId, name, description);
            closeTaskModal();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!elements.taskModal.classList.contains('hidden')) {
                closeTaskModal();
            }
            if (!elements.sprintFormContainer.classList.contains('hidden')) {
                elements.sprintFormContainer.classList.add('hidden');
                elements.sprintForm.reset();
            }
        }
    });
}

// ===== Initialization =====
function init() {
    loadFromStorage();
    renderActiveSprints();
    renderCompletedSprints();
    initEventListeners();

    console.log('Sprint To-Do App initialized!');
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
