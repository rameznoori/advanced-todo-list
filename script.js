const inputtask = document.getElementById("taskinput");
const tasklist = document.getElementById("newTaskList");

function addTask(){
    if(inputtask.value === ""){
        alert("Please enter a task!");
    }
    else{
        let li = document.createElement("li");
        li.innerHTML = inputtask.value;
        tasklist.appendChild(li);
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
    }
    inputtask.value="";
    saveTasks();
}
tasklist.addEventListener("click",function(e){
    if(e.target.tagName === "LI"){
        e.target.classList.toggle("checked");
        saveTasks();
    }else if(e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
        saveTasks();
    }
}, false);

function saveTasks(){
    localStorage.setItem("tasks", tasklist.innerHTML);
}

function showTasks(){
    tasklist.innerHTML = localStorage.getItem("tasks");
}
showTasks();