// popup.js (Popup Script)
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // Check if the message indicates that an element was clicked
    if (message.action === 'elementClicked') {
        // Perform the desired action in the popup window
        alert('Element clicked!');
    }
});
