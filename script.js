const defaultTasks = [
    {
        id: 1,
        title: "Complete DevOps Assignment",
        description: "Complete the Git and GitHub practical assignment.",
        done: true
    },
    {
        id: 2,
        title: "Study Database Systems",
        description: "Review database concepts and SQL queries.",
        done: false
    },
    {
        id: 3,
        title: "Prepare Presentation",
        description: "Prepare slides for the upcoming university presentation.",
        done: false
    }
];

let tasks = loadTasks();
let currentFilter = "all";


function loadTasks() {

    try {

        const saved = localStorage.getItem("studentTasks");

        return saved ? JSON.parse(saved) : defaultTasks;

    } catch (e) {

        return defaultTasks;

    }

}


function saveTasks() {

    try {

        localStorage.setItem(
            "studentTasks",
            JSON.stringify(tasks)
        );

    } catch (e) {

    }

}


function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


function addTask() {

    const titleInput =
        document.getElementById("taskTitle");

    const descInput =
        document.getElementById("taskDescription");

    const errorMessage =
        document.getElementById("errorMessage");


    const title =
        titleInput.value.trim();

    const description =
        descInput.value.trim();


    if (title === "" || description === "") {

        errorMessage.textContent =
            "Please enter both task title and description.";

        return;

    }


    errorMessage.textContent = "";


    tasks.unshift({

        id: Date.now(),

        title: title,

        description: description,

        done: false

    });


    saveTasks();

    renderTasks();


    titleInput.value = "";

    descInput.value = "";

    titleInput.focus();

}


function toggleTask(id) {

    const task =
        tasks.find(t => t.id === id);


    if (task) {

        task.done = !task.done;

    }


    saveTasks();

    renderTasks();

}


function deleteTask(id) {

    tasks =
        tasks.filter(t => t.id !== id);


    saveTasks();

    renderTasks();

}


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


    if (visible.length === 0) {

        taskList.innerHTML =
            `<p class="empty">
                No tasks here yet. Add one to get started.
            </p>`;

    } else {

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


                    <span class="status ${t.done ? "completed" : "pending"}">

                        ${t.done ? "Completed" : "Pending"}

                    </span>

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


    const doneCount =
        tasks.filter(t => t.done).length;


    const percent =
        tasks.length
            ? (doneCount / tasks.length) * 100
            : 0;


    document.getElementById("progressText").textContent =
        `${doneCount} of ${tasks.length} done`;


    document.getElementById("barFill").style.width =
        percent + "%";

}


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


renderTasks();