
const submitbtn = document.getElementById("submitbtn");
const tableBody = document.getElementById("list");

// loading students in an array from local storage 
// initializing empty array if no student information present in local storage

const studentInfo = JSON.parse(localStorage.getItem('students')) || [];
console.log(studentInfo)


//function to save students to local storage

function saveStudents(){
    localStorage.setItem('students', JSON.stringify(studentInfo));
}

// Rendering Students on page load

window.addEventListener("load", function(){
    loadStudents();
});

// function to load students from local storage and display on the screen

function loadStudents(){
    studentInfo.forEach(function(student, index){
        const studentRow =document.createElement("tr");
        

        // Load full Name
        const fullNameListItem = document.createElement("td");
        fullNameListItem.innerHTML =  student.fullName;
        fullNameListItem.classList.add("table-cell");
        studentRow.appendChild(fullNameListItem);

        // Load address
        const address = document.createElement("td");
        address.innerHTML =  student.address;
        address.classList.add("table-cell");
        studentRow.appendChild(address);

        // Load contact number 
        const contact = document.createElement("td");
        contact.innerHTML =  student.contact;
        contact.classList.add("table-cell");
        studentRow.appendChild(contact);

        // Load Class
        const studentClass = document.createElement("td");
        studentClass.innerHTML =  student.Class;
        studentClass.classList.add("table-cell");
        studentRow.appendChild(studentClass);

        // Adding edit button
        const editbtn= document.createElement("button");
        editbtn.innerHTML="Edit"
        const editbtnCell = document.createElement("td");
        editbtnCell.appendChild(editbtn);
        studentRow.appendChild(editbtnCell);
        editbtnCell.classList.add("table-cell")
        editbtn.classList.add("edit-btn");
        editbtn.addEventListener("click", function(){
            makeTableCellsEditable(index)
        });

         // Add delete button
         const deletebtn = document.createElement("button");
         deletebtn.innerHTML = "&#x1F5D1;";
         const deletebtnCell = document.createElement("td");
         deletebtnCell.appendChild(deletebtn);
         studentRow.appendChild(deletebtnCell);
         tableBody.appendChild(studentRow);
         deletebtnCell.classList.add("table-cell");
         deletebtn.classList.add("btn-red");
         deletebtn.addEventListener("click", function() {
             deleteStudent(index)
         });
    })
}

// function to handle submit

function handleSubmit(){
    const name = document.getElementById("name").value.trim();
    const stdClass = document.getElementById("class").value.trim();
    const address = document.getElementById("Address").value.trim();
    const contact = document.getElementById("Contact").value.trim();

    const fullNameRegex = /^[A-Za-z\s]+$/;

    if (name === "" || stdClass === "" || address=== "" || contact === "") {
        alert("All the fields are required");
        return;
    }
     if(contact.length<10){
        alert("contact number must be 10 digits");
        return;
    }
    
    if(!fullNameRegex.test(name)) {
        alert("Full name should contain only letters and spaces");
        return;
    }

    studentInfo.push({ fullName :name, Class:stdClass, address:address, contact:contact });
    //saving in the updated array to local storage
    saveStudents();

      // Clear the container element before reloading the updated list
    tableBody.innerHTML = '';

    //loading after saving

    loadStudents();

    //clearing the form after the data has been saved

    document.getElementById("name").value="";
    document.getElementById("Address").value='';
    document.getElementById("Contact").value="";
    document.getElementById("class").value="";

    
}

// Function to delete a task

function deleteStudent(index) {
    const isConfirmed =window.confirm("Are you sure you want delete student entry?");
    if(isConfirmed){
        
        studentInfo.splice(index, 1);
        saveStudents(); // Save students to local storage
        tableBody.innerHTML = '';
        loadStudents(); // Load updated students on the page
        alert("deleted")
    
    }
}

submitbtn.addEventListener("click", handleSubmit);

function makeTableCellsEditable(index) {
    const studentRow = tableBody.children[index];

    // Iterate through each cell in the row (except the last two containing the edit and delete buttons)
    for (let i = 0; i < studentRow.cells.length - 2; i++) {
        const cell = studentRow.cells[i];
        cell.setAttribute("contenteditable", "true"); // Make the cell editable
        cell.classList.add("editable");
    }

    // Change the "Edit" button to "Save"
    const editBtnCell = studentRow.cells[studentRow.cells.length - 2];
    const editBtn = editBtnCell.querySelector(".edit-btn");
    editBtn.textContent = "Save";
    editBtn.removeEventListener("click", function() {
        makeTableCellsEditable(index);
    });
    editBtn.addEventListener("click", function() {
        saveEditedStudent(index);
    });
}

const propertyNames = ["fullName", "address", "contact", "Class"];

function saveEditedStudent(index) {
    const studentRow = tableBody.children[index];
    let isValid = true; // Flag to track validation status

     //validating the updated data entries before saving

    // Get the edited details
    const fullNameCell = studentRow.cells[0];
    const editedFullName = fullNameCell.textContent.trim();
    const  editedAddressCell = studentRow.cells[1];
    const  editedContactCell = studentRow.cells[2];
    const  editedClassCell = studentRow.cells[3];
    const editedAddress =editedAddressCell.textContent.trim();
    const editedClass =editedClassCell.textContent.trim();
    const editedContact =editedContactCell.textContent.trim();

   // Regular expression to match only letters and spaces
    const fullNameRegex = /^[A-Za-z\s]+$/;

    // Regular expression to match only numbers

    const numbersOnlyRegex = /^[0-9]+$/;


    // Validate the edited full name
    if (!fullNameRegex.test(editedFullName)) {
        alert("Full name should contain only letters and spaces");
        isValid = false; // Set validation flag to false
    }
    if (editedAddress==="") {
        alert("address cannot be empty");
        isValid = false; // Set validation flag to false
    }
    if (editedContact ==="" || !numbersOnlyRegex.test(editedContact) ) {
        alert("contact should only contain numbers and cannot be empty");
        isValid = false; // Set validation flag to false
    }
    if (editedClass ==="" || !numbersOnlyRegex.test(editedClass) ) {
        alert("class should only contain numbers and cannot be empty");
        isValid = false; // Set validation flag to false
    }

    // If any validation error occurred, return early without saving
    if (!isValid) {
        return;
    }

    // Iterate through each cell in the row (except the last two containing the edit and delete buttons)
    for (let i = 0; i < studentRow.cells.length - 2; i++) {
        const cell = studentRow.cells[i];
        const newValue = cell.textContent.trim(); // Get the edited content of the cell
        const propertyName = propertyNames[i]; // Get the corresponding property name
        studentInfo[index][propertyName] = newValue; // Update the corresponding property in the studentInfo array
        cell.removeAttribute("contenteditable"); // Make the cell non-editable again
        cell.classList.remove("editable");
    }


    

    // Change the "Save" button back to "Edit"
    const editBtnCell = studentRow.cells[studentRow.cells.length - 2];
    const editBtn = editBtnCell.querySelector(".edit-btn");
    editBtn.textContent = "Edit";
    editBtn.removeEventListener("click", function() {
        saveEditedStudent(index);
    });
    editBtn.addEventListener("click", function() {
        makeTableCellsEditable(index);
    });

   
    

    saveStudents(); // Save the updated array to local storage
}
