document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    let painting = false;

    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;

    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";

    function startPosition(e) {
        painting = true;
        draw(e);
    }

    function endPosition() {
        painting = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!painting) return;

        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    }

    const colorSelect = document.getElementById("colorSelect");
    colorSelect.addEventListener("change", function () {
        ctx.strokeStyle = colorSelect.value;
    });

    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", endPosition);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseleave", endPosition);

    const eraseButton = document.getElementById("eraseButton");
    eraseButton.addEventListener("click", function () {
        ctx.strokeStyle = "#fff"; // Set the stroke style to white for erasing
    });

    const clearButton = document.getElementById("clearButton");
    clearButton.addEventListener("click", function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    });

    const saveButton = document.getElementById("saveButton");
    saveButton.addEventListener("click", function () {
        const drawingData = canvas.toDataURL();
        const timestamp = new Date().getTime();
        localStorage.setItem(`drawing_${timestamp}`, drawingData);
    });

    const loadButton = document.getElementById("loadButton");
    loadButton.addEventListener("click", function () {
        const drawingsContainer = document.getElementById("drawingsContainer");
        drawingsContainer.innerHTML = ""; // Clear the drawings container

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("drawing_")) {
                const drawingData = localStorage.getItem(key);
                const timestamp = parseInt(key.split("_")[1]); // Extract timestamp from the key
                const date = new Date(timestamp);
                const dateString = date.toLocaleString(); // Format date as a string

                const drawingItem = document.createElement("div");
                drawingItem.className = "drawing-item";
                drawingItem.innerHTML = `
                    <img src="${drawingData}" alt="My Drawing">
                    <p class="timestamp">${dateString}</p> <!-- Display date and time -->
                    <button class="delete-drawing-button" data-key="${key}">Delete</button>
                `;
                drawingsContainer.appendChild(drawingItem);

                // Add click event listener to each loaded drawing item
                drawingItem.addEventListener("click", function () {
                    // Set the canvas to display the clicked drawing
                    const canvas = document.getElementById("canvas");
                    const ctx = canvas.getContext("2d");
                    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
                    const image = new Image();
                    image.src = drawingData;
                    image.onload = function () {
                        ctx.drawImage(image, 0, 0);
                    };
                });
            }
        }
    });

    // Add event listener for the "Delete" button for each loaded drawing
    const drawingsContainer = document.getElementById("drawingsContainer");
    drawingsContainer.addEventListener("click", function (e) {
        if (e.target.classList.contains("delete-drawing-button")) {
            const keyToDelete = e.target.getAttribute("data-key");
            localStorage.removeItem(keyToDelete);
            // Remove the drawing item from the container
            e.target.parentElement.remove();
        }
    });
});
