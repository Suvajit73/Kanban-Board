let taskData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const columns = [todo, progress, done];

const tasks = document.querySelectorAll(".task");
const toggleModelBtn = document.querySelector("#toggle-modal")
const modal = document.querySelector(".modal")
const modalBg = document.querySelector(".modal .bg")
const addNewTaskBtn = document.querySelector("#add-new-task")

// function to create or add a new task...........................
function addTask(title, desc, column) {
    const div = document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", "true");

    div.innerHTML = `
        <h2>${title}</h2>
        <p>${desc}</p>
        <button>Delete</button>
    `;
    column.appendChild(div);

    div.addEventListener("drag", (e) => {
        dragElement = div;
    });

    // delete btn functionality...................
    const deleteBtn = div.querySelector("button");
    deleteBtn.addEventListener("click", () => {
        div.remove();
        updateTaskCount();
    });

    return div;
}

// function to update task count.........................
function updateTaskCount() {
    columns.forEach(col => {
        const tasks = col.querySelectorAll(".task");
        const count = col.querySelector(".right");

        taskData[col.id] = Array.from(tasks).map(task => {
            return {
                title: task.querySelector("h2").textContent,
                desc: task.querySelector("p").textContent
            }
        });
        localStorage.setItem("tasks", JSON.stringify(taskData));

        count.textContent = tasks.length;
    })
}

// load tasks from local storage...................................
if (localStorage.getItem("tasks")) {
    const data = JSON.parse(localStorage.getItem("tasks"));
    // console.log(data);

    for (const col in data) {
        const column = document.querySelector(`#${col}`);
        data[col].forEach(task => {
            addTask(task.title, task.desc, column);
        });
    }
    // function call - count tasks in each column.......................
    updateTaskCount();
}

let dragElement = null;

tasks.forEach(task => {
    task.addEventListener("drag", (e) => {
        // console.log("dragging", e);
        dragElement = task;
    })
})

function addDragAndDropEvents(column) {
    column.addEventListener("dragenter", (e) => {
        e.preventDefault();
        column.classList.add('hover-over');
    })
    column.addEventListener("dragleave", (e) => {
        e.preventDefault();
        column.classList.remove('hover-over');
    })

    column.addEventListener("dragover", (e) => {
        e.preventDefault();
    })

    // drop functionality.................................................
    column.addEventListener("drop", (e) => {
        e.preventDefault();

        column.appendChild(dragElement);
        column.classList.remove('hover-over');

        // function call - count tasks in each column.......................
        updateTaskCount();

    })
}

addDragAndDropEvents(todo)
addDragAndDropEvents(progress)
addDragAndDropEvents(done)


/*modal feature..............................  */
toggleModelBtn.addEventListener("click", () => {
    modal.classList.toggle("active")
})

modalBg.addEventListener("click", () => {
    modal.classList.remove("active")
});

addNewTaskBtn.addEventListener("click", () => {
    const taskTitleInput = document.querySelector("#task-title-input").value;
    const taskDescInput = document.querySelector("#task-desc-input").value;

    addTask(taskTitleInput, taskDescInput, todo);

    // function call - count tasks in each column.......................
    updateTaskCount();
    modal.classList.remove("active");

    document.querySelector("#task-title-input").value = "";
    document.querySelector("#task-desc-input").value = "";
})

