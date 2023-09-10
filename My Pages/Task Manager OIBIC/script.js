// script.js
document.addEventListener("DOMContentLoaded", function () {
    const taskDateInput = document.getElementById("taskDate");
    const taskTimeInput = document.getElementById("taskTime");
    const taskTextInput = document.getElementById("taskText");
    const addTaskButton = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");
    const completedTaskList = document.getElementById("completedTaskList");

    let editingIndex = null; // Track the index of the task being edited

    addTaskButton.addEventListener("click", function () {
        const taskDate = taskDateInput.value;
        const taskTime = taskTimeInput.value;
        const taskText = taskTextInput.value;

        if (!taskDate || !taskTime || !taskText) {
            alert("Please enter date, time, and task.");
            return;
        }

        const dateTime = new Date(`${taskDate}T${taskTime}`);
        const task = {
            date: dateTime.toLocaleDateString(),
            time: dateTime.toLocaleTimeString(),
            text: taskText,
            completed: false, // Initial state is not completed
        };

        // Check if the task's date and time are in the past
        const currentTime = new Date();
        if (dateTime <= currentTime) {
            task.warning = "This task can't be completed. Check date and time.";
        }

        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        if (editingIndex !== null) {
            tasks[editingIndex] = task;
            editingIndex = null; // Reset editing state
        } else {
            tasks.push(task);
        }

        localStorage.setItem("tasks", JSON.stringify(tasks));

        displayTasks();
        taskDateInput.value = "";
        taskTimeInput.value = "";
        taskTextInput.value = "";
    });

    function deleteTask(index) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        displayTasks();
    }

    function editTask(index) {
        editingIndex = index;

        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const task = tasks[index];

        taskDateInput.value = task.date;
        taskTimeInput.value = task.time;
        taskTextInput.value = task.text;
    }

    function toggleCompleted(index) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks[index].completed = !tasks[index].completed;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        displayTasks();
    }

    function displayTasks() {
        taskList.innerHTML = "";
        completedTaskList.innerHTML = "";

        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        tasks.forEach((task, index) => {
            const taskItem = document.createElement("div");
            taskItem.className = "task-list-item";

            const taskText = document.createElement("div");
            taskText.innerText = task.text;

            if (task.completed) {
                taskItem.style.backgroundColor = "#88cc88"; // Green background for completed tasks
            } else if (task.warning) {
                taskItem.style.backgroundColor = "#ff3333"; // Red background for tasks with warnings
                const taskWarning = document.createElement("div");
                taskWarning.innerText = task.warning;
                taskWarning.style.color = "#fff";
                taskWarning.style.fontStyle = "italic";
                taskItem.appendChild(taskWarning);
            }

            const taskActions = document.createElement("div");
            taskActions.className = "task-actions";

            const taskDate = document.createElement("div");
            taskDate.className = "task-date";
            taskDate.innerText = `${task.date} ${task.time}`;

            const editButton = document.createElement("button");
            editButton.innerText = "Edit";
            editButton.addEventListener("click", () => editTask(index));

            const deleteButton = document.createElement("button");
            deleteButton.innerText = "Delete";
            deleteButton.addEventListener("click", () => deleteTask(index));

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;
            checkbox.addEventListener("change", () => toggleCompleted(index));

            taskActions.appendChild(checkbox);
            taskActions.appendChild(editButton);
            taskActions.appendChild(deleteButton);
            taskItem.appendChild(taskText);
            taskItem.appendChild(taskActions);
            taskItem.appendChild(taskDate);

            if (task.completed) {
                completedTaskList.appendChild(taskItem);
            } else {
                taskList.appendChild(taskItem);
            }
        });
    }

    displayTasks();
});
