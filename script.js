const inputtask = document.getElementById("taskinput");
const tasklist = document.getElementById("newTaskList");
const allTasks = document.getElementById("allTasksList");

let sectionsList = [tasklist, allTasks];

function addTask(){
    if(inputtask.value === ""){
        alert("Please enter a task!");
    }
    else{
        let li1 = document.createElement("li");
        li1.innerHTML = inputtask.value;
        tasklist.appendChild(li1);

        let li2 = document.createElement("li");
        li2.innerHTML = inputtask.value;
        allTasks.appendChild(li2);

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
}

//to-do list section functions
tasklist.addEventListener("click",function(e){
    if(e.target.tagName === "LI"){
        e.target.classList.toggle("checked");
        saveTasks();
    }else if(e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
        saveTasks();
    }
},false);

function saveTasks(){
    localStorage.setItem("tasks", tasklist.innerHTML);
}

function showTasks(){
    tasklist.innerHTML = localStorage.getItem("tasks");
}

showTasks();

//All tasks section functions
allTasks.addEventListener("click",function(e){
    if(e.target.tagName === "LI"){
        e.target.classList.toggle("checked");
        saveAllTasks();
    }else if(e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
        saveAllTasks();
    }
}, false);

function saveAllTasks(){
    localStorage.setItem("all-tasks", allTasks.innerHTML);
}

function showAllTasks(){
    allTasks.innerHTML = localStorage.getItem("all-tasks");
}
showAllTasks();

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