// Function to handle the click event on the element
function handleElementClick() {
    // Execute your desired action here, e.g., displaying an alert
    alert('View Sections button clicked!');
}

// Find the span element with the specified class and add a click event listener to it
const element = document.querySelector('span.cx-MuiButton-label');
if (element) {
    console.log('Found View Sections button!');
    element.addEventListener('click', handleElementClick);
} else {
    console.log('View Sections button not found!');
}

// Log a message to indicate that the content script has been injected successfully
console.log('Content script injected!');
