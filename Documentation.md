# Sprint To-Do App - Comprehensive Documentation

A modern, client-side task management application that organizes work into time-boxed sprints with real-time progress tracking and persistent browser storage.

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architecture & Design Patterns](#3-architecture--design-patterns)
4. [File Structure](#4-file-structure)
5. [Data Model](#5-data-model)
6. [HTML Structure](#6-html-structure)
7. [CSS Design System](#7-css-design-system)
8. [JavaScript Architecture](#8-javascript-architecture)
9. [Feature Implementation](#9-feature-implementation)
10. [UI Components](#10-ui-components)
11. [Event Flow](#11-event-flow)
12. [LocalStorage Strategy](#12-localstorage-strategy)
13. [Responsive Design](#13-responsive-design)
14. [Browser Compatibility](#14-browser-compatibility)

---

## 1. Project Overview

The Sprint To-Do App is a **zero-backend** task management system that runs entirely in the browser. It enables users to:
- Create time-boxed work periods called "sprints"
- Add tasks to sprints with descriptions
- Track task completion status
- View real-time progress visualization
- Archive completed sprints
- Persist all data locally using browser LocalStorage

### Key Features
✅ Sprint Management (Create, View, End)  
✅ Task Management (Add, Update, Delete)  
✅ Progress Visualization (Animated progress bars)  
✅ Data Persistence (LocalStorage)  
✅ Collapsible Completed Sprints Section  
✅ Modal-based Task Creation  
✅ Keyboard Shortcuts (ESC to close modals)  
✅ Responsive Mobile-First Design  
✅ Glassmorphism UI with Smooth Animations  

---

## 2. Technology Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **HTML5** | Semantic markup and structure | Latest |
| **CSS3** | Styling, animations, layout | Latest |
| **JavaScript (ES6+)** | Application logic | ES6+ |
| **LocalStorage API** | Client-side persistence | Browser Native |
| **Google Fonts** | Typography (Inter font family) | Web Font |

**No Build Tools Required** - This is a pure vanilla JavaScript application that runs directly in the browser without compilation or bundling.

---

## 3. Architecture & Design Patterns

### Design Patterns Used

#### 1. **Module Pattern**
The app uses function-scoped modules with clear separation of concerns:
```javascript
// State Management
const state = { sprints: [], completedSprints: [] };

// DOM References
const elements = { /* cached DOM elements */ };

// Business Logic
function createSprint() { /* ... */ }
```

#### 2. **Template Pattern**
HTML `<template>` elements are cloned for dynamic rendering:
```html
<template id="sprintTemplate">
    <!-- Reusable sprint card structure -->
</template>
```

#### 3. **Observer Pattern**
Event listeners respond to user interactions and trigger state updates:
```javascript
elements.sprintForm.addEventListener('submit', (e) => {
    createSprint(...);  // Updates state
});
```

#### 4. **Single Source of Truth**
The `state` object is the authoritative data source. All UI updates derive from state changes.

---

## 4. File Structure

```
to-do-app/
├── index.html          # Main HTML document (172 lines)
├── styles.css          # Complete stylesheet (817 lines)
├── app.js              # Application logic (408 lines)
├── Documentation.md    # This file
└── Claude.md           # Original requirements
```

---

## 5. Data Model

### Sprint Object Schema
```javascript
{
    id: String,              // Unique identifier (timestamp-based)
    name: String,            // User-provided sprint name
    description: String,     // Optional sprint description
    duration: Number,        // Duration in days (default: 7)
    tasks: Array<Task>,      // Array of task objects
    createdAt: String,       // ISO timestamp of creation
    completedAt: String      // ISO timestamp when sprint ended (optional)
}
```

### Task Object Schema
```javascript
{
    id: String,              // Unique identifier (timestamp-based)
    name: String,            // Task name
    description: String,     // Optional task description
    status: String,          // 'not-done' | 'done'
    createdAt: String        // ISO timestamp of creation
}
```

### State Structure
```javascript
const state = {
    sprints: Array<Sprint>,           // Active sprints
    completedSprints: Array<Sprint>   // Archived sprints
};
```

---

## 6. HTML Structure

### Document Structure

The HTML follows a semantic, single-page application layout:

```html
<body>
    <div class="app-container">
        <header class="app-header">...</header>
        <main class="main-content">
            <section class="create-sprint-section">...</section>
            <section class="sprints-section" id="activeSprintsSection">...</section>
            <section class="sprints-section completed-sprints">...</section>
        </main>
        <footer class="app-footer">...</footer>
    </div>
    
    <!-- Modal -->
    <div class="modal-overlay hidden" id="taskModal">...</div>
    
    <!-- Templates -->
    <template id="sprintTemplate">...</template>
    <template id="taskTemplate">...</template>
</body>
```

### Key Sections Explained

#### A. Header Section (Lines 14-22)
Contains the app branding and tagline.
```html
<header class="app-header">
    <div class="logo">
        <span class="logo-icon">🚀</span>
        <h1>Sprint To-Do</h1>
    </div>
    <p class="tagline">Organize your work into sprints and track progress</p>
</header>
```

#### B. Sprint Creation Form (Lines 27-57)
Toggleable form for creating new sprints:
```html
<div class="sprint-form-container hidden" id="sprintFormContainer">
    <form id="sprintForm">
        <input id="sprintName" required>
        <textarea id="sprintDescription"></textarea>
        <input type="number" id="sprintDuration" value="7">
    </form>
</div>
```

#### C. Active Sprints Container (Lines 59-71)
Dynamic container populated with sprint cards:
```html
<div id="activeSprintsContainer">
    <!-- Sprint cards rendered here by JavaScript -->
</div>
```

#### D. Task Modal (Lines 95-118)
Overlay modal for adding tasks to sprints:
```html
<div class="modal-overlay hidden" id="taskModal">
    <div class="modal">
        <form id="taskForm">
            <input type="hidden" id="taskSprintId">
            <input id="taskName" required>
            <textarea id="taskDescription"></textarea>
        </form>
    </div>
</div>
```

#### E. Templates (Lines 120-167)

**Sprint Template** - Cloned for each sprint:
```html
<template id="sprintTemplate">
    <div class="sprint-card">
        <div class="sprint-header">
            <div class="sprint-info">
                <h3 class="sprint-name"></h3>
                <p class="sprint-description"></p>
                <div class="sprint-meta">
                    <span class="sprint-duration">⏱️ <span class="duration-text"></span></span>
                    <span class="sprint-tasks-count">📝 <span class="tasks-text"></span></span>
                </div>
            </div>
            <div class="sprint-actions">
                <button class="add-task-btn">➕</button>
                <button class="end-sprint-btn">✓</button>
            </div>
        </div>
        <div class="progress-container">
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <span class="progress-text">0%</span>
        </div>
        <div class="tasks-container">
            <div class="tasks-list"></div>
        </div>
    </div>
</template>
```

**Task Template** - Cloned for each task:
```html
<template id="taskTemplate">
    <div class="task-item">
        <label class="task-checkbox">
            <input type="checkbox" class="task-status-checkbox">
            <span class="checkmark"></span>
        </label>
        <div class="task-content">
            <span class="task-name"></span>
            <span class="task-description"></span>
        </div>
        <button class="delete-task-btn">🗑️</button>
    </div>
</template>
```

---

## 7. CSS Design System

### Design Philosophy
The app uses a **dark glassmorphism** aesthetic with:
- Semi-transparent layered cards
- Backdrop blur effects
- Vibrant gradient accents
- Smooth micro-animations
- Responsive fluid layouts

### CSS Custom Properties
All design tokens are defined as CSS variables for consistency:

```css
:root {
    /* Color Gradients */
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --success-gradient: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    
    /* Solid Colors */
    --bg-dark: #0f0f23;           /* Main background */
    --bg-card: #1a1a2e;           /* Card backgrounds */
    --text-primary: #ffffff;       /* Primary text */
    --text-muted: #718096;         /* Secondary text */
    
    /* Glassmorphism */
    --glass-bg: rgba(255, 255, 255, 0.05);
    --glass-border: rgba(255, 255, 255, 0.1);
    
    /* Spacing Scale */
    --spacing-xs: 0.25rem;   /* 4px */
    --spacing-sm: 0.5rem;    /* 8px */
    --spacing-md: 1rem;      /* 16px */
    --spacing-lg: 1.5rem;    /* 24px */
    --spacing-xl: 2rem;      /* 32px */
    --spacing-2xl: 3rem;     /* 48px */
    
    /* Border Radius */
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-full: 50%;
    
    /* Transitions */
    --transition-fast: 0.15s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
}
```

### Animated Background
The body has an animated radial gradient overlay:
```css
body::before {
    content: '';
    position: fixed;
    background: 
        radial-gradient(ellipse at 20% 20%, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 80%, rgba(118, 75, 162, 0.15) 0%, transparent 50%);
    animation: gradientShift 20s ease infinite;
}
```

### Key Animations

#### 1. Fade In Up (Sprint/Task Cards)
```css
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

#### 2. Float Animation (Logo Icon)
```css
@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}
```

#### 3. Progress Bar Shimmer
```css
.progress-fill::after {
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
    animation: shimmer 2s ease-in-out infinite;
}
```

### Component Styles

#### Sprint Cards
```css
.sprint-card {
    background: var(--glass-bg);
    backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    transition: all var(--transition-normal);
}

.sprint-card:hover {
    border-color: rgba(102, 126, 234, 0.3);
    box-shadow: var(--shadow-lg);
}
```

#### Custom Checkbox
```css
.checkmark {
    width: 24px;
    height: 24px;
    border: 2px solid var(--text-muted);
    border-radius: var(--radius-sm);
}

.task-checkbox input:checked + .checkmark {
    background: var(--success-gradient);
    border-color: transparent;
}

.task-checkbox input:checked + .checkmark::after {
    content: '✓';
    color: white;
}
```

### Responsive Breakpoints
```css
@media (max-width: 768px) {
    /* Tablet and below */
}

@media (max-width: 480px) {
    /* Mobile phones */
}
```

---

## 8. JavaScript Architecture

### Application Initialization Flow
```javascript
document.addEventListener('DOMContentLoaded', init);

function init() {
    loadFromStorage();          // 1. Load saved data
    renderActiveSprints();      // 2. Render active sprints
    renderCompletedSprints();   // 3. Render completed sprints
    initEventListeners();       // 4. Attach event handlers
}
```

### Core Modules

#### A. State Management (Lines 6-16)
```javascript
const state = {
    sprints: [],
    completedSprints: []
};

const STORAGE_KEYS = {
    SPRINTS: 'sprintTodo_sprints',
    COMPLETED_SPRINTS: 'sprintTodo_completedSprints'
};
```

#### B. DOM Element Caching (Lines 18-52)
All DOM queries are performed once at initialization:
```javascript
const elements = {
    toggleSprintFormBtn: document.getElementById('toggleSprintForm'),
    sprintForm: document.getElementById('sprintForm'),
    activeSprintsContainer: document.getElementById('activeSprintsContainer'),
    // ... 20+ cached elements
};
```

#### C. Utility Functions (Lines 54-87)

**ID Generation** - Timestamp + random string:
```javascript
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
```

**Duration Formatting**:
```javascript
function formatDuration(days) {
    if (days === 1) return '1 day';
    return `${days} days`;
}
```

**LocalStorage Operations**:
```javascript
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
        if (savedSprints) {
            state.sprints = JSON.parse(savedSprints);
        }
        // Similar for completed sprints
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}
```

#### D. Sprint Management (Lines 89-126)

**Creating a Sprint**:
```javascript
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
```

**Ending a Sprint** (Moving to completed):
```javascript
function endSprint(sprintId) {
    const sprintIndex = state.sprints.findIndex(s => s.id === sprintId);
    if (sprintIndex === -1) return;
    
    const sprint = state.sprints[sprintIndex];
    sprint.completedAt = new Date().toISOString();
    
    // Move to completed array
    state.completedSprints.unshift(sprint);
    state.sprints.splice(sprintIndex, 1);
    
    saveToStorage();
    renderActiveSprints();
    renderCompletedSprints();
}
```

**Progress Calculation**:
```javascript
function calculateProgress(sprint) {
    if (!sprint.tasks || sprint.tasks.length === 0) return 0;
    const completedTasks = sprint.tasks.filter(t => t.status === 'done').length;
    return Math.round((completedTasks / sprint.tasks.length) * 100);
}
```

#### E. Task Management (Lines 128-169)

**Adding a Task**:
```javascript
function addTask(sprintId, name, description) {
    const sprint = state.sprints.find(s => s.id === sprintId);
    if (!sprint) return null;
    
    const task = {
        id: generateId(),
        name: name,
        description: description,
        status: 'not-done',
        createdAt: new Date().toISOString()
    };
    
    sprint.tasks.push(task);
    saveToStorage();
    renderActiveSprints();
    return task;
}
```

**Updating Task Status**:
```javascript
function updateTaskStatus(sprintId, taskId, status) {
    const sprint = state.sprints.find(s => s.id === sprintId);
    const task = sprint.tasks.find(t => t.id === taskId);
    
    task.status = status;
    saveToStorage();
    renderActiveSprints();  // Triggers progress bar update
}
```

**Deleting a Task**:
```javascript
function deleteTask(sprintId, taskId) {
    const sprint = state.sprints.find(s => s.id === sprintId);
    const taskIndex = sprint.tasks.findIndex(t => t.id === taskId);
    
    sprint.tasks.splice(taskIndex, 1);
    saveToStorage();
    renderActiveSprints();
}
```

#### F. Rendering Engine (Lines 171-308)

**Rendering Active Sprints**:
```javascript
function renderActiveSprints() {
    const container = elements.activeSprintsContainer;
    
    // Update badge count
    elements.activeSprintCount.textContent = state.sprints.length;
    
    // Clear existing cards
    container.querySelectorAll('.sprint-card').forEach(card => card.remove());
    
    // Show empty state if no sprints
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
```

**Template Cloning for Sprint Cards**:
```javascript
function renderSprintCard(sprint, isCompleted) {
    // Clone template
    const template = elements.sprintTemplate.content.cloneNode(true);
    const card = template.querySelector('.sprint-card');
    
    // Set data attributes
    card.dataset.sprintId = sprint.id;
    
    // Populate content
    card.querySelector('.sprint-name').textContent = sprint.name;
    card.querySelector('.sprint-description').textContent = sprint.description || 'No description';
    card.querySelector('.duration-text').textContent = formatDuration(sprint.duration);
    
    // Update task count
    const taskCount = sprint.tasks ? sprint.tasks.length : 0;
    card.querySelector('.tasks-text').textContent = `${taskCount} task${taskCount !== 1 ? 's' : ''}`;
    
    // Calculate and display progress
    const progress = calculateProgress(sprint);
    card.querySelector('.progress-fill').style.width = `${progress}%`;
    card.querySelector('.progress-text').textContent = `${progress}%`;
    
    // Render tasks
    const tasksList = card.querySelector('.tasks-list');
    sprint.tasks?.forEach(task => {
        const taskElement = renderTaskItem(task, sprint.id, isCompleted);
        tasksList.appendChild(taskElement);
    });
    
    // Attach event listeners (only for active sprints)
    if (!isCompleted) {
        card.querySelector('.add-task-btn').addEventListener('click', 
            () => openTaskModal(sprint.id));
        card.querySelector('.end-sprint-btn').addEventListener('click', 
            () => endSprint(sprint.id));
    }
    
    return card;
}
```

**Template Cloning for Tasks**:
```javascript
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
    
    // Event listeners (only for active sprints)
    if (!isCompleted) {
        checkbox.addEventListener('change', (e) => {
            const newStatus = e.target.checked ? 'done' : 'not-done';
            updateTaskStatus(sprintId, task.id, newStatus);
        });
        
        taskItem.querySelector('.delete-task-btn').addEventListener('click', 
            () => deleteTask(sprintId, task.id));
    }
    
    return taskItem;
}
```

#### G. Event Listeners (Lines 322-394)

**Toggle Sprint Form**:
```javascript
elements.toggleSprintFormBtn.addEventListener('click', () => {
    elements.sprintFormContainer.classList.toggle('hidden');
    if (!elements.sprintFormContainer.classList.contains('hidden')) {
        elements.sprintNameInput.focus();
    }
});
```

**Submit Sprint Form**:
```javascript
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
```

**Keyboard Shortcuts**:
```javascript
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close task modal
        if (!elements.taskModal.classList.contains('hidden')) {
            closeTaskModal();
        }
        // Close sprint form
        if (!elements.sprintFormContainer.classList.contains('hidden')) {
            elements.sprintFormContainer.classList.add('hidden');
            elements.sprintForm.reset();
        }
    }
});
```

---

## 9. Feature Implementation

### Feature: Creating a Sprint

**User Flow:**
1. User clicks "+ New Sprint" button
2. Form slides down with animation
3. User fills: name (required), description (optional), duration (default: 7)
4. User clicks "Create Sprint"
5. Sprint card appears with fade-in animation
6. Form resets and hides

**Code Flow:**
```
User Click → toggleSprintFormBtn
           → classList.toggle('hidden')
           → Form appears
           
Form Submit → sprintForm.addEventListener('submit')
           → createSprint(name, desc, duration)
           → state.sprints.push(newSprint)
           → saveToStorage()
           → renderActiveSprints()
           → DOM updated with new card
```

### Feature: Adding a Task

**User Flow:**
1. User clicks ➕ button on a sprint card
2. Modal overlay appears
3. User enters task name and description
4. User clicks "Add Task"
5. Task appears in the sprint's task list
6. Progress bar updates automatically

**Code Flow:**
```
➕ Click → openTaskModal(sprintId)
        → taskModal.classList.remove('hidden')
        → taskSprintIdInput.value = sprintId
        
Submit → taskForm.addEventListener('submit')
      → addTask(sprintId, name, description)
      → sprint.tasks.push(newTask)
      → saveToStorage()
      → renderActiveSprints()
      → Progress recalculated
```

### Feature: Updating Task Status

**User Flow:**
1. User clicks checkbox next to a task
2. Task text gets strikethrough (if completed)
3. Progress bar animates to new percentage
4. Change persists to LocalStorage

**Code Flow:**
```
Checkbox Change → checkbox.addEventListener('change')
               → newStatus = checked ? 'done' : 'not-done'
               → updateTaskStatus(sprintId, taskId, newStatus)
               → task.status = newStatus
               → saveToStorage()
               → renderActiveSprints()
               → calculateProgress() recalculates
               → progress-fill width updated with CSS transition
```

### Feature: Ending a Sprint

**User Flow:**
1. User clicks ✓ button on sprint card
2. Confirmation dialog appears
3. User confirms
4. Sprint moves to "Completed Sprints" section
5. Sprint becomes read-only (no ➕ or ✓ buttons)

**Code Flow:**
```
✓ Click → endSprintBtn.addEventListener('click')
       → confirm("Are you sure?")
       → endSprint(sprintId)
       → sprint.completedAt = timestamp
       → state.completedSprints.unshift(sprint)
       → state.sprints.splice(index, 1)
       → saveToStorage()
       → renderActiveSprints()
       → renderCompletedSprints()
```

---

## 10. UI Components

### Component: Sprint Card

**States:**
- Active (with action buttons)
- Completed (read-only, with success border)

**Props (Dynamic Data):**
- `sprint.name` → `.sprint-name`
- `sprint.description` → `.sprint-description`
- `sprint.duration` → `.duration-text`
- `sprint.tasks.length` → `.tasks-text`
- `calculateProgress(sprint)` → `.progress-fill` width & `.progress-text`

**Interactions:**
- Hover: Border color change + shadow
- Click ➕: Opens task modal
- Click ✓: Ends sprint (with confirmation)

### Component: Task Item

**States:**
- Not Done (default checkbox)
- Done (checked checkbox, strikethrough text)

**Props:**
- `task.name` → `.task-name`
- `task.description` → `.task-description`
- `task.status` → checkbox checked state

**Interactions:**
- Hover: Background color darkens, delete button appears
- Click checkbox: Toggles status
- Click 🗑️: Deletes task (with confirmation)

### Component: Modal

**States:**
- Hidden (display: none)
- Visible (display: flex, with backdrop)

**Interactions:**
- Click overlay: Closes modal
- Click × button: Closes modal
- Press ESC: Closes modal
- Submit form: Adds task & closes modal

### Component: Progress Bar

**Visual Updates:**
Animated width transition based on task completion percentage.

**CSS Transitions:**
```css
.progress-fill {
    transition: width 0.5s ease;
}
```

**Real-time Updates:**
Recalculated on every task status change.

---

## 11. Event Flow

### Complete Event Chain: Adding a Task

```
1. User Action
   └─ Click ➕ button on sprint card

2. Event Handler (renderSprintCard)
   └─ addTaskBtn.addEventListener('click', () => openTaskModal(sprintId))

3. Modal Display
   └─ openTaskModal(sprintId)
      ├─ elements.taskSprintIdInput.value = sprintId
      ├─ elements.taskModal.classList.remove('hidden')
      └─ elements.taskNameInput.focus()

4. Form Submission
   └─ taskForm.addEventListener('submit', (e) => {...})
      ├─ e.preventDefault()
      ├─ Extract form values
      └─ addTask(sprintId, name, description)

5. State Update
   └─ addTask()
      ├─ Find sprint by ID
      ├─ Create task object
      ├─ sprint.tasks.push(task)
      └─ saveToStorage()

6. View Update
   └─ renderActiveSprints()
      ├─ Clear existing cards
      ├─ Loop through state.sprints
      └─ For each sprint:
         └─ renderSprintCard(sprint, false)
            ├─ Clone template
            ├─ Populate data
            ├─ calculateProgress()
            └─ For each task:
               └─ renderTaskItem(task, sprintId, false)

7. DOM Update Complete
   └─ New task visible with fade-in animation
   └─ Progress bar updated with new percentage
```

---

## 12. LocalStorage Strategy

### Storage Keys
```javascript
const STORAGE_KEYS = {
    SPRINTS: 'sprintTodo_sprints',
    COMPLETED_SPRINTS: 'sprintTodo_completedSprints'
};
```

### Stored Data Format
```javascript
// localStorage.getItem('sprintTodo_sprints')
[
    {
        "id": "lj2k3h4g56h",
        "name": "Week 1 Sprint",
        "description": "Initial development tasks",
        "duration": 7,
        "tasks": [
            {
                "id": "n5m6j7k8l9m",
                "name": "Review code",
                "description": "",
                "status": "done",
                "createdAt": "2026-01-05T15:20:00.000Z"
            }
        ],
        "createdAt": "2026-01-05T10:00:00.000Z"
    }
]
```

### When Data is Saved
Every state-modifying operation triggers `saveToStorage()`:
- Creating a sprint
- Ending a sprint
- Adding a task
- Updating task status
- Deleting a task

### When Data is Loaded
On app initialization:
```javascript
function init() {
    loadFromStorage();  // First action on page load
    // ...
}
```

### Error Handling
```javascript
try {
    localStorage.setItem(key, value);
} catch (error) {
    console.error('Error saving to localStorage:', error);
    // Fails gracefully - user sees warning in console
}
```

---

## 13. Responsive Design

### Mobile-First Approach
The design adapts from small screens upward.

### Breakpoints

**Tablet (768px and below):**
```css
@media (max-width: 768px) {
    .section-header { flex-direction: column; }
    .section-header .btn { width: 100%; }
    .sprint-header { flex-direction: column; }
    .form-actions { flex-direction: column; }
    .task-actions { opacity: 1; }  /* Always visible on touch devices */
}
```

**Mobile (480px and below):**
```css
@media (max-width: 480px) {
    .logo h1 { font-size: 1.75rem; }
    .sprint-meta { flex-direction: column; }
    .modal { width: 95%; }
}
```

### Touch Optimizations
- Larger tap targets (40px minimum)
- Delete buttons always visible on mobile (no hover state)
- Full-width buttons in forms
- Larger text inputs (16px to prevent zoom)

---

## 14. Browser Compatibility

### Required Browser Features
- **ES6 JavaScript** (Arrow functions, `const`/`let`, template literals)
- **LocalStorage API**
- **CSS Custom Properties**
- **CSS Grid & Flexbox**
- **CSS Backdrop Filter** (Glassmorphism effect)

### Supported Browsers
✅ Chrome 88+  
✅ Firefox 85+  
✅ Safari 14+  
✅ Edge 88+  

### Not Supported
❌ Internet Explorer (all versions)

### Fallbacks
If LocalStorage is unavailable (private browsing), the app will still function but data won't persist between sessions.

---

## Summary

The Sprint To-Do App is a **production-ready**, **zero-dependency** task management system that demonstrates modern web development best practices:

- **Clean Architecture**: Separation of concerns (HTML/CSS/JS)
- **Declarative Templates**: HTML `<template>` elements
- **State-Driven UI**: Single source of truth pattern
- **Persistent Storage**: LocalStorage API
- **Modern CSS**: Custom properties, animations, glassmorphism
- **Semantic HTML**: Accessible and SEO-friendly
- **Responsive Design**: Mobile-first approach
- **Error Handling**: Graceful degradation

**Total Codebase:** ~1,400 lines of well-structured, commented code.

---

*Documentation last updated: 2026-01-05*  
*Generated by Antigravity 🚀*
