// Forward messages from the content script to the popup script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // Forward the message to the popup script
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
});
