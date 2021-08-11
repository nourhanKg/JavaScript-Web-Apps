//elements
const task = document.querySelector(".newTask");
const btnAddNew = document.querySelector(".btnAddNew");
const listOfTasks = document.querySelector(".tasks");
const editBox = document.querySelector(".editBox");
const editTask = document.querySelector(".editTask");
const submitBtn = document.querySelector(".submit");
const cancelBtn = document.querySelector(".cancel");

//functions
function addTask(event) {
    event.preventDefault(); //prevent form submit
    if(task.value !== "") {
        const newTask = document.createElement("li");
        const divTask = document.createElement("div");
        const check = document.createElement("input");
        const para = document.createElement("p");
        const divBtn = document.createElement("div");
        const delBtn = document.createElement("button");
        const editBtn = document.createElement("button");

        check.type = "checkBox"
        para.textContent = task.value;
        delBtn.classList.add("delete");
        editBtn.classList.add("edit");
        delBtn.innerHTML = "<i class='fas fa-trash'></i>";
        editBtn.innerHTML = "<i class='far fa-edit'></i>";

        //saving task
        saveMyList(task.value);

        divTask.appendChild(check);
        divTask.appendChild(para);
        divBtn.appendChild(delBtn);
        divBtn.appendChild(editBtn);
        newTask.appendChild(divTask);
        newTask.appendChild(divBtn);
        listOfTasks.appendChild(newTask); 
        task.value = "";
    }
}
let btnClicked, oldTask;

function changeTask(e) {
    const btn = e.target;
    btnClicked = btn;
    const divParent = btn.parentElement;
    const liParent = divParent.parentElement;
    if(btn.classList[0] === "delete") {
        liParent.classList.add("remove");
        //remove from local storage
        removeFromStorage(liParent.children[0].children[1]);
        liParent.addEventListener("transitionend", function() {
            liParent.remove(); 
        });
    }
    else if(btn.classList[0] === "edit") {
        editBox.classList.remove("hidden");
        oldTask = liParent.children[0].children[1].textContent;
        console.log(oldTask);
    }
    else if(btn.type === "checkbox") {
        liParent.children[0].children[1].classList.toggle("completed");
    }
}
function cancelEdit() {
    editBox.classList.add("hidden");
    editTask.value = "";
}

function submitEdit() {
    if(editTask.value !== "") {
        const firstParent = btnClicked.parentElement; //div
        const liParent = firstParent.parentElement; //li
        liParent.children[0].children[1].textContent = editTask.value;
        editTask.value = "";
        editBox.classList.add("hidden");
        savingEdits(oldTask, liParent.children[0].children[1].textContent);
    }
}
//check for saved lists
let savedTasks;
function checkSaved(task){
    if(localStorage.getItem("savedTasks") === null) {
        savedTasks = [];
    }
    else {
        savedTasks = JSON.parse(localStorage.getItem("savedTasks"));
    }
}
//to store list 
function saveMyList(task) {
    checkSaved();
    savedTasks.push(task);
    localStorage.setItem("savedTasks", JSON.stringify(savedTasks));
}
//to display stored list
function loadList(task) {
    checkSaved();
    savedTasks.forEach(function(task) {
        const newTask = document.createElement("li");
        const divTask = document.createElement("div");
        const check = document.createElement("input");
        const para = document.createElement("p");
        const divBtn = document.createElement("div");
        const delBtn = document.createElement("button");
        const editBtn = document.createElement("button");

        check.type = "checkBox"
        para.textContent = task;
        delBtn.classList.add("delete");
        editBtn.classList.add("edit");
        delBtn.innerHTML = "<i class='fas fa-trash'></i>";
        editBtn.innerHTML = "<i class='far fa-edit'></i>";

        divTask.appendChild(check);
        divTask.appendChild(para);
        divBtn.appendChild(delBtn);
        divBtn.appendChild(editBtn);
        newTask.appendChild(divTask);
        newTask.appendChild(divBtn);
        listOfTasks.appendChild(newTask); 
    })
}
function savingEdits(oldTask, newTask) {
    checkSaved();
    console.log(oldTask, newTask);
    savedTasks[savedTasks.indexOf(oldTask)] = newTask;
    localStorage.setItem("savedTasks", JSON.stringify(savedTasks));
}

function removeFromStorage(task) {
    checkSaved();
    removedTask = task.innerText;
    savedTasks.splice(savedTasks.indexOf(removedTask), 1);
    localStorage.setItem("savedTasks", JSON.stringify(savedTasks));
}

document.addEventListener("DOMContentLoaded", loadList);
btnAddNew.addEventListener("click", addTask);
listOfTasks.addEventListener("click", changeTask);
submitBtn.addEventListener("click", submitEdit);
cancelBtn.addEventListener("click", cancelEdit);
