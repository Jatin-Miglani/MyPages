// checkTasks.js
document.addEventListener("DOMContentLoaded", function () {
    const taskManagerMessage = document.getElementById("taskManagerMessage");

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const currentDate = new Date();

    const tasksOneDayLeft = tasks.filter((task) => {
        const taskDate = new Date(task.date);
        const timeDiff = taskDate - currentDate;
        const oneDayInMillis = 24 * 60 * 60 * 1000; // One day in milliseconds

        return timeDiff >= 0 && timeDiff <= oneDayInMillis;
    });

    if (tasksOneDayLeft.length > 0) {
        taskManagerMessage.textContent = `Tasks to be done if one day is left: ${tasksOneDayLeft.length}`;
    } else {
        taskManagerMessage.textContent = "No tasks with one day left.";
    }

    
});
