//elements
const noteInput = document.querySelector(".noteInput");
const submitBtn = document.querySelector(".submit");
const cancelBtn = document.querySelector(".cancel");
const grid = document.querySelector(".grid");

//functions
function addNewNote() {
    if(noteInput.value !== "") {
        //creating elements
        const tempDiv = document.createElement("div");
        tempDiv.classList.add("template");
        const textArea = document.createElement("textarea");
        textArea.readOnly = true;
        const btnDiv = document.createElement("div");
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.classList.add("delete");
        const editBtn = document.createElement("button");
        editBtn.innerHTML = '<i class="far fa-edit"></i>';
        editBtn.classList.add("edit");

        //saving Note
        savingNotes(noteInput.value);
        
        //appending elements
        btnDiv.appendChild(deleteBtn);
        btnDiv.appendChild(editBtn);
        tempDiv.appendChild(textArea);
        tempDiv.appendChild(btnDiv);
        grid.appendChild(tempDiv);

        textArea.value = noteInput.value;
        noteInput.value = "";
    }
}

function changeNote(event) {
    const btnClicked = event.target;
    const parent = btnClicked.parentElement.parentElement;
    if(btnClicked.classList[0] === "delete") {
        parent.classList.add("removing");
        removeFromStorage(parent.children[0].value);
        parent.addEventListener("transitionend", function() {
            parent.remove();
        });
    }
    else if(btnClicked.classList[0] === "edit") {
        parent.children[0].readOnly = false;
        parent.children[0].focus();
        const newBtn = document.createElement("button");
        newBtn.classList.add("submit");
        newBtn.innerHTML = "<i class='fas fa-check'>";
        parent.children[1].appendChild(newBtn);
        const oldNote = parent.children[0].value;
        newBtn.addEventListener("click", function() {
            parent.children[0].readOnly = true;
            newBtn.remove();
            savingEdits(oldNote, parent.children[0].value);
        });
    }
}
//check for saved notes 
let savedNotes;
function checkSaved(note){
    if(localStorage.getItem("savedNotes") === null) {
        savedNotes = [];
    }
    else {
        savedNotes = JSON.parse(localStorage.getItem("savedNotes"));
    }
}
//saving notes to localStorage
function savingNotes(note) {
    checkSaved();
    savedNotes.push(note);
    localStorage.setItem("savedNotes", JSON.stringify(savedNotes));
    console.log(savedNotes);
}
function loadingNotes(note) {
    checkSaved();
    savedNotes.forEach(function(note) {
        const tempDiv = document.createElement("div");
        tempDiv.classList.add("template");
        const textArea = document.createElement("textarea");
        textArea.readOnly = true;
        const btnDiv = document.createElement("div");
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.classList.add("delete");
        const editBtn = document.createElement("button");
        editBtn.innerHTML = '<i class="far fa-edit"></i>';
        editBtn.classList.add("edit");

        btnDiv.appendChild(deleteBtn);
        btnDiv.appendChild(editBtn);
        tempDiv.appendChild(textArea);
        tempDiv.appendChild(btnDiv);
        grid.appendChild(tempDiv);

        textArea.value = note;
    });
}
function savingEdits(oldNote, newNote) {
    checkSaved();
    savedNotes[savedNotes.indexOf(oldNote)] = newNote;
    localStorage.setItem("savedNotes", JSON.stringify(savedNotes));
}
function removeFromStorage(note) {
    checkSaved();
    savedNotes.splice(savedNotes.indexOf(note), 1);
    localStorage.setItem("savedNotes", JSON.stringify(savedNotes));
}

//events
document.addEventListener("DOMContentLoaded", loadingNotes);

cancelBtn.addEventListener("click", function() {
    noteInput.value = "";
});

submitBtn.addEventListener("click", addNewNote);

grid.addEventListener("click", changeNote);
