const inputtask = document.getElementById("taskinput");
const tasklist = document.getElementById("newTaskList");
const allTasks = document.getElementById("allTasksList");
const completedTasks = document.getElementById("completedTasksList");

// A map to keep track of task relationships
const taskMap = new Map();

function addTask(){
    if(inputtask.value === ""){
        return false;
    }
    else{
        let li1 = document.createElement("li");
        li1.innerHTML = inputtask.value;
        li1.dataset.taskId = Date.now().toString();
        tasklist.appendChild(li1);

        let li2 = document.createElement("li");
        li2.innerHTML = inputtask.value;
        li2.dataset.taskId = li1.dataset.taskId;
        allTasks.appendChild(li2);

        // Store relationship between the two elements
        taskMap.set(li1.dataset.taskId, {
            newTask: li1,
            allTask: li2,
            completed: false
        });
        
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li1.appendChild(span);

        let span2 = document.createElement("span");
        span2.innerHTML = "\u00d7";
        li2.appendChild(span2);
    }
    inputtask.value="";
    saveTasks();
    saveAllTasks();
    saveTaskMap();
}

//to-do list section functions
tasklist.addEventListener("click",function(e){
    if(e.target.tagName === "LI"){
        const taskId = e.target.dataset.taskId;
        moveToCompleted(e.target, taskId);
        // e.target.classList.toggle("checked");
        saveTasks();
    }else if(e.target.tagName === "SPAN"){
        const taskId = e.target.parentElement.dataset.taskId;

        // Remove the task from the map 
        if (taskMap.has(taskId)) {
            const mapItem = taskMap.get(taskId);
            if (mapItem.allTask) {
                mapItem.allTask.remove();
            }
            taskMap.delete(taskId);
        }

        e.target.parentElement.remove();
        saveTasks();
        saveAllTasks();
        saveTaskMap();
    }
},false);

function saveTasks(){
    localStorage.setItem("tasks", tasklist.innerHTML);
}

function showTasks(){
    tasklist.innerHTML = localStorage.getItem("tasks") || "";
}

showTasks();

//Completed Tasks section functions
function moveToCompleted(taskitem, taskId){
    let completeLi = document.createElement("li");
    completeLi.innerHTML = taskitem.textContent.replace('\u00d7','');
    completeLi.dataset.taskId = taskId;

    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    completeLi.appendChild(span);

    completedTasks.appendChild(completeLi);

    // Update the All Tasks list item to show as completed
    if (taskMap.has(taskId)) {
        const mapItem = taskMap.get(taskId);
        if (mapItem.allTask) {
            mapItem.allTask.classList.add("checked");
            mapItem.completed = true;
        }
        // Update the map to point to the completed task
        mapItem.newTask = null;
        mapItem.completedTask = completeLi;
    }

    taskitem.remove();

    saveTasks();
    saveCompletedTasks();
    saveAllTasks();
    saveTaskMap();
}

completedTasks.addEventListener("click", function(e){
    if(e.target.tagName === "SPAN"){
        const taskId = e.target.parentElement.dataset.taskId;

        // Update All Tasks list if needed
        if (taskMap.has(taskId)) {
            const mapItem = taskMap.get(taskId);
            if (mapItem.allTask) {
                mapItem.allTask.remove();
            }
            taskMap.delete(taskId);
        }

        e.target.parentElement.remove();
        saveCompletedTasks();
        saveAllTasks();
        saveTaskMap();
    }
},false);

function saveCompletedTasks(){
    localStorage.setItem("completed-tasks", completedTasks.innerHTML);
}

function showCompletedTasks(){
    completedTasks.innerHTML = localStorage.getItem("completed-tasks") || "";
}
showCompletedTasks();


//All tasks section functions
allTasks.addEventListener("click",function(e){
    if (e.target.tagName === "LI") {
        const taskId = e.target.dataset.taskId;
        
        if (taskMap.has(taskId)) {
            const mapItem = taskMap.get(taskId);
            
            // Toggle completed status
            if (!e.target.classList.contains("checked")) {
                // Mark as complete and move to completed list if it's in new tasks
                e.target.classList.add("checked");
                mapItem.completed = true;
                
                if (mapItem.newTask) {
                    // If it's in New Tasks, move it to Completed
                    moveToCompleted(mapItem.newTask, taskId);
                } else if (!mapItem.completedTask) {
                    // If it's not in Completed Tasks yet, add it there
                    addToCompletedFromAll(taskId, e.target.textContent.replace('\u00d7', ''));
                }
            } else {
                // Uncheck the task
                e.target.classList.remove("checked");
                mapItem.completed = false;
                
                // Remove from completed tasks if it exists there
                if (mapItem.completedTask) {
                    mapItem.completedTask.remove();
                    mapItem.completedTask = null;
                }
                
                // Move back to new tasks if it doesn't exist there
                if (!mapItem.newTask) {
                    addToNewFromAll(taskId, e.target.textContent.replace('\u00d7', ''));
                }
            }
        }
        
        saveTasks();
        saveCompletedTasks();
        saveAllTasks();
        saveTaskMap();
    } else if (e.target.tagName === "SPAN") {
        const taskId = e.target.parentElement.dataset.taskId;
        
        // Remove corresponding tasks from other lists
        if (taskMap.has(taskId)) {
            const mapItem = taskMap.get(taskId);
            if (mapItem.newTask) {
                mapItem.newTask.remove();
            }
            if (mapItem.completedTask) {
                mapItem.completedTask.remove();
            }
            taskMap.delete(taskId);
        }
        
        e.target.parentElement.remove();
        saveTasks();
        saveCompletedTasks();
        saveAllTasks();
        saveTaskMap();
    }
}, false);

function saveAllTasks(){
    localStorage.setItem("all-tasks", allTasks.innerHTML);
}

function showAllTasks(){
    allTasks.innerHTML = localStorage.getItem("all-tasks") || "";
}
showAllTasks();

function saveTaskMap(){
    const mapArray = Array.from(taskMap.entries()).map(([key, value]) => {
        return {
            id: key,
            completed: value.completed
        };
    });
    localStorage.setItem("task-map", JSON.stringify(mapArray));
}

function loadTaskMap() {
    const mapData = localStorage.getItem("task-map");
    if (mapData) {
        const mapArray = JSON.parse(mapData);
        
        // Rebuild task relationships
        const newTasks = tasklist.querySelectorAll('li');
        const allTaskItems = allTasks.querySelectorAll('li');
        const completedTaskItems = completedTasks.querySelectorAll('li');
        
        mapArray.forEach(item => {
            const taskObj = { completed: item.completed };
            
            // Find corresponding elements
            newTasks.forEach(task => {
                if (task.dataset.taskId === item.id) {
                    taskObj.newTask = task;
                }
            });
            
            allTaskItems.forEach(task => {
                if (task.dataset.taskId === item.id) {
                    taskObj.allTask = task;
                    if (item.completed) {
                        task.classList.add("checked");
                    }
                }
            });
            
            completedTaskItems.forEach(task => {
                if (task.dataset.taskId === item.id) {
                    taskObj.completedTask = task;
                }
            });
            
            taskMap.set(item.id, taskObj);
        });
    }
}
loadTaskMap();

// Helper functions
function addToCompletedFromAll(taskId, taskText) {
    // Create new completed task item
    let completeLi = document.createElement("li");
    completeLi.innerHTML = taskText;
    completeLi.dataset.taskId = taskId;

    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    completeLi.appendChild(span);

    completedTasks.appendChild(completeLi);

    // Update the map to point to the completed task
    if (taskMap.has(taskId)) {
        const mapItem = taskMap.get(taskId);
        mapItem.completedTask = completeLi;
    }

    saveCompletedTasks();
    saveTaskMap();
}

function addToNewFromAll(taskId, taskText) {
    // Create new task item
    let newLi = document.createElement("li");
    newLi.innerHTML = taskText;
    newLi.dataset.taskId = taskId;

    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    newLi.appendChild(span);

    tasklist.appendChild(newLi);

    // Update the map to point to the new task
    if (taskMap.has(taskId)) {
        const mapItem = taskMap.get(taskId);
        mapItem.newTask = newLi;
    }

    saveTasks();
    saveTaskMap();
}

// section highlighting
function highlightsection(sectionNumber){
    let selectedSection = document.getElementById(`section${sectionNumber}`);
    selectedSection.classList.add('glow');
    selectedSection.classList.add('shake');
    //bringing focus to input box of section 1
    if(sectionNumber === 1){
        let inputBox = document.querySelector('#section1 input');
        if(inputBox){
            inputBox.focus();
        }
    }
    setTimeout(() => {
        selectedSection.classList.remove('glow');
        selectedSection.classList.remove('shake');
    }, 1000);
}