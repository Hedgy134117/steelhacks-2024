// popup.js (Popup Script)
/*
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // Check if the message indicates that an element was clicked
    if (message.action === 'elementClicked') {
        // Perform the desired action in the popup window
        alert('Element clicked!');
    }
});
*/
// Include the modified version of parsePrerequisites function here

// Function to generate the network graph for a selected class


// Example usage: dynamically called based on user interaction, e.g., clicking a class
// In popup.js or background.js, depending on your setup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'elementClicked') {
        generateGraphForClass(message.courseId);
    }
});
// In popup.js, add this function
// This function parses the prerequisite string into a format usable by Vis.js (nodes and edges)
// Assume a simplistic representation of prerequisites for demonstration
function parsePrerequisites(courseId, prerequisiteString) {
    let nodes = [{ id: courseId, label: courseId, shape: 'box', color: '#97C2FC' }];
    let edges = [];
    let nodeId = 1;

    // Split the prerequisite string into individual requirements
    // For simplicity, this example will not handle nested requirements deeply
    // A more complex parser is needed for full support
    let prerequisites = prerequisiteString.split(',');

    prerequisites.forEach(prerequisite => {
        if (prerequisite.includes('or')) {
            // Handle OR conditions
            let options = prerequisite.match(/\b\d{4}\b|\bCOE \d{3}\b/g); // Extract course codes
            if (options) {
                options.forEach(option => {
                    let optionId = `OR${nodeId++}`;
                    nodes.push({ id: optionId, label: option, shape: 'ellipse', color: '#F9D423' });
                    edges.push({ from: courseId, to: optionId });
                });
            }
        } else if (prerequisite.includes('and')) {
            // Handle AND conditions
            let requiredCourses = prerequisite.match(/\b\d{4}\b|\bCOE \d{3}\b/g); // Extract course codes
            if (requiredCourses) {
                requiredCourses.forEach(course => {
                    let requiredId = `AND${nodeId++}`;
                    nodes.push({ id: requiredId, label: course, shape: 'ellipse', color: '#FB7E81' });
                    edges.push({ from: courseId, to: requiredId });
                });
            }
        } else {
            // Handle single course prerequisites
            let match = prerequisite.match(/\b\d{4}\b|\bCOE \d{3}\b/g); // Extract course code
            if (match) {
                let singleId = `SINGLE${nodeId++}`;
                nodes.push({ id: singleId, label: match[0], shape: 'ellipse', color: '#FFC837' });
                edges.push({ from: courseId, to: singleId });
            }
        }
    });

    return { nodes, edges };
}

// Assume classPrerequisites is accessible here
document.addEventListener('DOMContentLoaded', function() {
    var container = document.getElementById('network');
    var data = { nodes: new vis.DataSet([]), edges: new vis.DataSet([]) };
    var options = {};
    var network = new vis.Network(container, data, options);

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.action === 'elementClicked') {
            var parsedData = parsePrerequisites(classPrerequisites[message.courseId]);
            data.nodes.clear();
            data.edges.clear();
            data.nodes.add(parsedData.nodes);
            data.edges.add(parsedData.edges);
            // You may need to call some network method to refresh or update the graph here if necessary
        }
    });
});


// In popup.js or another script loaded by your popup.html or a dedicated page
function generateGraphForClass(courseId) {
    var prerequisiteString = classPrerequisites[courseId]; // Assume classPrerequisites is accessible
    if (!prerequisiteString) {
        console.error("Prerequisite data for " + courseId + " not found.");
        return;
    }

    // Parse the prerequisite string to a format usable by Vis.js (nodes and edges)
    var parsedData = parsePrerequisites(prerequisiteString); // Implement this based on your data format

    // Assuming nodes and edges are Vis.js DataSet instances
    var nodes = new vis.DataSet(parsedData.nodes);
    var edges = new vis.DataSet(parsedData.edges);

    // Assuming `container` is the DOM element to host the network graph
    var network = new vis.Network(container, {nodes: nodes, edges: edges}, {});

    // You may need additional logic here to update the graph if it already exists
}

