function showPopup() {
    const popup = document.getElementById("popup");
    popup.classList.add("show");
}
function confirmAdd() {
    const subjectInput = document.getElementById("subject");
    const periodInput = document.getElementById("period");
    const titleInput = document.getElementById("title");
    const deadlineInput = document.getElementById("deadline");
    const descriptionInput = document.getElementById("description");
    const itemList = document.getElementById("itemList");

    const subject = subjectInput.value;
    const deadline = deadlineInput.value;
    const period = periodInput.value;
    const title = titleInput.value;
    const description = descriptionInput.value;

    // Construct item object
    const newItem = {
        subject: subject,
        deadline: deadline,
        period: period,
        title: title,
        description: description
    };

    // Retrieve existing items from local storage or initialize empty array 
    let items = JSON.parse(localStorage.getItem('items')) || [];

    // Add the new item to the array
    items.push(newItem);

    // Save the updated array back to local storage
    localStorage.setItem('items', JSON.stringify(items));

    // Get the template
    const template = document.getElementById("listItemTemplate");

    // Clone the template content
    const listItem = document.importNode(template.content, true);

    // Populate the cloned template with data
    listItem.querySelector(".subject").textContent = subject;
    listItem.querySelector(".deadline").textContent = deadline;
    listItem.querySelector(".period").textContent = period;
    listItem.querySelector(".title").textContent = title;
    listItem.querySelector(".description").textContent = description;

    // Append the populated list item to the <ul> element
    itemList.appendChild(listItem);

    // Clear the input fields
    subjectInput.value = "";
    deadlineInput.value = "";
    titleInput.selectedIndex = 0;
    periodInput.selectedIndex = 0;
    descriptionInput.value = "";

    // Hide the popup
    const popup = document.getElementById("popup");
    popup.classList.remove("show");
}

function loadItems() {
    // Retrieve items from local storage
    const items = JSON.parse(localStorage.getItem('items')) || [];

    // Get the itemList element
    const itemList = document.getElementById("itemList");

    // Clear the itemList
    itemList.innerHTML = '';

    // Populate the itemList with saved items
    items.forEach(item => {
        // Get the template
        const template = document.getElementById("listItemTemplate");

        // Clone the template content
        const listItem = document.importNode(template.content, true);

        // Populate the cloned template with data
        listItem.querySelector(".subject").textContent = item.subject;
        listItem.querySelector(".deadline").textContent = item.deadline;
        listItem.querySelector(".period").textContent = item.period;
        listItem.querySelector(".title").textContent = item.title;
        listItem.querySelector(".description").textContent = item.description;

        // Append the populated list item to the <ul> element
        itemList.appendChild(listItem);
    });
}

// Call loadItems when the page loads
window.onload = loadItems; 

function activityDone(listItem) {
    // Check if a list item exists
    if (listItem) {
        // Extract subject and title from the listItemTemplate
        const { subject, title, period } = extractSubjectAndTitle(listItem);

        // Remove the list item from its current parent (itemList)
        listItem.parentNode.removeChild(listItem);

        // Create a new container for the finished assignment
        const finishedAssignmentsContainer = document.getElementById("finishedAssignmentsContainer");
        const newContainer = document.createElement("div");
        newContainer.classList.add("finishedAssignmentContainer");

        // Append the extracted subject and title to the new container
        newContainer.innerHTML = `<div><strong>Subject:</strong> ${subject}</div><div><strong>Period:</strong> ${period}</div><div><strong>Title:</strong> ${title}</div><button onclick="deleteFinishedAssignment(this.parentElement)" id="btnFinishedDelete"></button>`;

        // Append the new container to the finishedAssignmentsContainer
        finishedAssignmentsContainer.appendChild(newContainer);
    }
}


function extractSubjectAndTitle(listItem) {
    // Get subject and title from the listItemTemplate
    const templateSubject = listItem.querySelector(".subject").textContent;
    const templateTitle = listItem.querySelector(".title").textContent;
    const templatePeriod = listItem.querySelector(".period").textContent;


    return { subject: templateSubject, title: templateTitle, period: templatePeriod };
}


function deleteActivity(activity) {
    // Retrieve the items from localStorage
    let items = JSON.parse(localStorage.getItem('items')) || [];

    // Find the index of the item to remove
    const index = items.findIndex(item => item.title === activity.querySelector(".title").textContent);

    // Remove the item from the items array
    if (index !== -1) {
        items.splice(index, 1);
    }

    // Update localStorage with the modified items array
    localStorage.setItem('items', JSON.stringify(items));

    // Remove the activity from the DOM
    activity.remove();
}

function deleteFinishedAssignment(listItem) {
    listItem.remove();
} 
// Function to save assignments to localStorage
function saveAssignmentsToStorage(assignments) {
    localStorage.setItem('assignments', JSON.stringify(assignments));
}

// Function to retrieve assignments from localStorage
function getAssignmentsFromStorage() {
    const storedAssignments = localStorage.getItem('assignments');
    return storedAssignments ? JSON.parse(storedAssignments) : [];
}

// Function to add a new assignment
function addAssignment(subject, deadline, title, description) {
    const assignments = getAssignmentsFromStorage();
    const newAssignment = { subject, deadline, title, description };
    assignments.push(newAssignment);
    saveAssignmentsToStorage(assignments);
}

// Function to load assignments from storage and display them
function loadAssignments() {
    const assignments = getAssignmentsFromStorage();
    const itemList = document.getElementById("itemList");

    // Clear existing items
    itemList.innerHTML = '';

    // Display assignments
    assignments.forEach(assignment => {
        const listItem = createListItem(assignment);
        itemList.appendChild(listItem);
    });
}

// Function to create a list item from assignment data
function createListItem(assignment) {
    const template = document.getElementById("listItemTemplate");
    const listItem = document.importNode(template.content, true);

    // Update content with assignment data
    listItem.querySelector(".subject").textContent = assignment.subject;
    listItem.querySelector(".deadline").textContent = assignment.deadline;
    listItem.querySelector(".title").textContent = assignment.title;
    listItem.querySelector(".description").textContent = assignment.description;

    return listItem;
}

// Call loadAssignments when the page is loaded
document.addEventListener("DOMContentLoaded", loadAssignments);
