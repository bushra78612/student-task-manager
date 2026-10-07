const defaultTasks = [
    {
        id: 1,
        title: "Complete DevOps Assignment",
        description: "Complete the Git and GitHub practical assignment.",
        done: true,
        priority: "High"
    },

    {
        id: 2,
        title: "Study Database Systems",
        description: "Review database concepts and SQL queries.",
        done: false,
        priority: "Medium"
    },

    {
        id: 3,
        title: "Prepare Presentation",
        description: "Prepare slides for the upcoming university presentation.",
        done: false,
        priority: "Low"
    }
];


let tasks = loadTasks();

let currentFilter = "all";


// LOAD TASKS
function loadTasks() {

    try {

        const saved = localStorage.getItem("studentTasks");

        if (saved) {

            const loadedTasks = JSON.parse(saved);

            // Add Medium priority to older tasks
            // that were created before priority was added.
            return loadedTasks.map(task => ({
                ...task,
                priority: task.priority || "Medium"
            }));

        }

        return defaultTasks;

    } catch (e) {

        return defaultTasks;

    }
}


// SAVE TASKS
function saveTasks() {

    try {

        localStorage.setItem(
            "studentTasks",
            JSON.stringify(tasks)
        );

    } catch (e) {

        // Storage unavailable
    }
}


// ESCAPE HTML
function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ADD TASK
function addTask() {

    const titleInput =
        document.getElementById("taskTitle");

    const descInput =
        document.getElementById("taskDescription");

    const priorityInput =
        document.getElementById("taskPriority");

    const errorMessage =
        document.getElementById("errorMessage");


    const title =
        titleInput.value.trim();

    const description =
        descInput.value.trim();

    const priority =
        priorityInput.value;


    // VALIDATION
    if (title === "" || description === "") {

        errorMessage.textContent =
            "Please enter both task title and description.";

        return;
    }


    errorMessage.textContent = "";


    // CREATE NEW TASK
    const newTask = {

        id: Date.now(),

        title: title,

        description: description,

        done: false,

        priority: priority

    };


    tasks.unshift(newTask);

    saveTasks();

    renderTasks();


    // CLEAR INPUTS
    titleInput.value = "";

    descInput.value = "";

    priorityInput.value = "Medium";

    titleInput.focus();
}


// TOGGLE TASK
function toggleTask(id) {

    const task =
        tasks.find(t => t.id === id);


    if (task) {

        task.done = !task.done;

    }


    saveTasks();

    renderTasks();
}


// DELETE TASK
function deleteTask(id) {

    tasks =
        tasks.filter(t => t.id !== id);


    saveTasks();

    renderTasks();
}


// GET PRIORITY CLASS
function getPriorityClass(priority) {

    if (priority === "High") {

        return "priority-high";

    }

    if (priority === "Low") {

        return "priority-low";

    }

    return "priority-medium";
}


// RENDER TASKS
function renderTasks() {

    const taskList =
        document.getElementById("taskList");


    const visible =
        tasks.filter(t =>

            currentFilter === "all"

                ? true

                : currentFilter === "done"

                    ? t.done

                    : !t.done

        );


    // NO TASKS
    if (visible.length === 0) {

        taskList.innerHTML =
            `<p class="empty">
                No tasks here yet. Add one to get started.
            </p>`;

    }

    else {

        taskList.innerHTML = visible.map(t => `

            <div class="task ${t.done ? "done" : ""}">

                <input
                    type="checkbox"
                    ${t.done ? "checked" : ""}
                    aria-label="Mark ${escapeHTML(t.title)} as done"
                    onchange="toggleTask(${t.id})"
                >


                <div class="task-body">

                    <h3>
                        ${escapeHTML(t.title)}
                    </h3>


                    <p>
                        ${escapeHTML(t.description)}
                    </p>


                    <div class="task-meta">

                        <span class="status ${t.done ? "completed" : "pending"}">
                            ${t.done ? "Completed" : "Pending"}
                        </span>


                        <span class="priority ${getPriorityClass(t.priority)}">
                            Priority: ${escapeHTML(t.priority)}
                        </span>

                    </div>

                </div>


                <button
                    class="delete"
                    onclick="deleteTask(${t.id})"
                >
                    Delete
                </button>

            </div>

        `).join("");

    }


    // PROGRESS
    const doneCount =
        tasks.filter(t => t.done).length;


    const percent =
        tasks.length
            ? (doneCount / tasks.length) * 100
            : 0;


    document.getElementById(
        "progressText"
    ).textContent =
        `${doneCount} of ${tasks.length} done`;


    document.getElementById(
        "barFill"
    ).style.width =
        percent + "%";
}


// FILTER BUTTONS
document.querySelectorAll(".filter").forEach(btn => {

    btn.addEventListener("click", () => {

        document
            .querySelector(".filter.active")
            .classList.remove("active");


        btn.classList.add("active");


        currentFilter =
            btn.dataset.filter;


        renderTasks();

    });

});


// INITIAL RENDER
renderTasks();