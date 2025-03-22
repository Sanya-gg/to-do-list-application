const inputBox = document.getElementById("input-box");
const dueDateInput = document.getElementById("due-date");
const listContainer = document.getElementById("list-container");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const searchInput = document.getElementById("search");

let totalTasks = 0;
let completedTasks = 0;

function showTask() {
    const savedData = localStorage.getItem('data');
    if (savedData) {
        listContainer.innerHTML = savedData;
        totalTasks = listContainer.children.length; // Update total tasks
        completedTasks = Array.from(listContainer.children).filter(li => li.classList.contains('checked')).length;
        updateProgress();
    }
}

function addTask() {
    if (inputBox.value === '') {
        alert("You must write something!");
    } else {
        let li = document.createElement("li");
        let taskText = inputBox.value;
        let dueDate = dueDateInput.value;
        
        li.innerHTML = taskText;
        
        
        if (dueDate) {
            let dueDateElement = document.createElement("span");
            dueDateElement.classList.add("due-date");
            dueDateElement.innerHTML = `Due: ${new Date(dueDate).toLocaleDateString()}`;
            li.appendChild(dueDateElement);
        }

        listContainer.appendChild(li);

        
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);

        totalTasks = listContainer.children.length; // Update total tasks
        updateProgress();
        saveData();
        inputBox.value = "";
        dueDateInput.value = "";
    }
}

listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");

        if (e.target.classList.contains("checked")) {
            completedTasks++;
        } else {
            completedTasks--;
        }

        updateProgress();
        saveData();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();

        totalTasks--;
        if (e.target.parentElement.classList.contains("checked")) {
            completedTasks--;
        }

        updateProgress();
        saveData();
    }
});

function updateProgress() {
    if (totalTasks > 0) {
        let progressValue = (completedTasks / totalTasks) * 100;
        progressBar.value = progressValue;
        progressText.textContent = `${completedTasks}/${totalTasks}`;
    } else {
        progressBar.value = 0;
        progressText.textContent = `0/0`;
    }
    saveProgress(); 
}

function saveProgress() {
    localStorage.setItem('progressValue', progressBar.value);
}

function loadProgress() {
    const savedProgressValue = localStorage.getItem('progressValue');
    if (savedProgressValue) {
        progressBar.value = savedProgressValue;
        progressText.textContent = `${completedTasks}/${totalTasks}`; // Sync with progress bar
    }
}

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
    localStorage.setItem("totalTasks", totalTasks);
    localStorage.setItem("completedTasks", completedTasks);
}

function loadData() {
    totalTasks = parseInt(localStorage.getItem('totalTasks')) || 0;
    completedTasks = parseInt(localStorage.getItem('completedTasks')) || 0;
}


function searchTasks() {
    const searchTerm = searchInput.value.toLowerCase();
    const tasks = listContainer.children;

    for (let i = 0; i < tasks.length; i++) {
        const taskText = tasks[i].textContent.toLowerCase();
        if (taskText.includes(searchTerm)) {
            tasks[i].style.display = 'block';
        } else {
            tasks[i].style.display = 'none';
        }
    }
}

window.onload = function() {
    loadProgress();
    loadData();
    showTask();
}

