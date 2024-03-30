// In popup.js or background.js, depending on your setup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'elementClicked') {
        generateGraphForClass(message.courseId);
    }
});
// In background.js
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'elementClicked') {
        // Fetch or retrieve the prerequisites data for message.courseId
        // This might involve sending another message back to the content script with the data
        let prerequisitesData = {}; // Fetch the prerequisites from your data structure
        chrome.tabs.sendMessage(sender.tab.id, { action: 'displayGraph', data: prerequisitesData });
    }
});

  
  