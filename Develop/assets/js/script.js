// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Function to generate a unique task id
function generateTaskId() {
    return nextId++;
}

// Function to create a task card
function createTaskCard(task) {
    return `
    <div class="card mb-3" data-id="${task.id}">
      <div class="card-body">
        <h5 class="card-title">${task.title}</h5>
        <p class="card-text">${task.description}</p>
        <button class="btn btn-danger btn-sm delete-task">Delete</button>
      </div>
    </div>
  `;
}

// Function to render the task list and make cards draggable
function renderTaskList() {
    $('#todo-cards').html('');
    $('#in-progress-cards').html('');
    $('#done-cards').html('');

    taskList.forEach(task => {
        const taskCard = createTaskCard(task);
        $(`#${task.category}-cards`).append(taskCard);
    });

    $(".card").draggable({
        revert: "invalid",
        helper: "clone"
    });

    $(".lane .card-body").droppable({
        accept: ".card",
        drop: handleDrop
    });
}

// Function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();

    const taskTitle = $('#taskTitle').val();
    const taskDescription = $('#taskDescription').val();
    const taskCategory = $('#taskCategory').val();

    const newTask = {
        id: generateTaskId(),
        title: taskTitle,
        description: taskDescription,
        category: taskCategory
    };

    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));

    $('#formModal').modal('hide');
    $('#taskForm')[0].reset();

    renderTaskList();
}

// Function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = $(event.target).closest('.card').data('id');
    taskList = taskList.filter(task => task.id !== taskId);

    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.data('id');
    const newCategory = $(this).closest('.lane').attr('id');

    const task = taskList.find(task => task.id === taskId);
    task.category = newCategory;

    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// When the page loads, render the task list, add event listeners, make lanes droppable
$(document).ready(function () {
    renderTaskList();

    $('#taskForm').on('submit', handleAddTask);
    $(document).on('click', '.delete-task', handleDeleteTask);
});
