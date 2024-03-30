// Define the nodes (courses)
var nodes = new vis.DataSet([
    { id: 1, label: 'CS 1501', x: 350, y: 450, fixed: true, shape: 'box', font: { size: 20 } },
    { id: 2, label: 'CS 441 or CS 446', x: 600, y: 450, fixed: true, shape: 'box', font: { size: 20 } },
    { id: 3, label: 'CS 445 or CS 455 or COE 445', x: 100, y: 250, fixed: true, shape: 'box', font: { size: 20 } },
    { id: 4, label: 'CS 245 and CS 207', x: 100, y: 650, fixed: true, shape: 'box', font: { size: 20 } },
    { id: 5, label: 'or', shape: 'circle', x: 100, y: 450, fixed: true, font: { size: 20 } }
]);

// Define the edges (prerequisites)
var edges = new vis.DataSet([
    { from: 1, to: 2, label: '', font: { align: 'horizontal' } },
    { from: 3, to: 5, label: '', font: { align: 'horizontal' }, length: 20 },
    { from: 4, to: 5, label: '', font: { align: 'horizontal' } },
    { from: 1, to: 5, label: '', font: { align: 'horizontal' } }
]);

// Provide data in the format of nodes and edges
var data = {
    nodes: nodes,
    edges: edges
};

// Get the container where the network will be displayed
var container = document.getElementById('network');

// Set the options for the network
var options = {
    physics: false, // Disable physics simulation
    edges: {
        smooth: false // Disable curved edges
    }
};

// Create a new vis network using the data and options
var network = new vis.Network(container, data, options);

// Define variables to keep track of the previously selected node
var previouslyClickedNodeId = null;

// Add an event listener to handle node clicks
network.on("click", function (params) {
    if (params.nodes.length > 0) {
        var clickedNodeId = params.nodes[0];

        // Reset font size of previously clicked node, if exists
        if (previouslyClickedNodeId !== null) {
            var previouslyClickedNode = nodes.get(previouslyClickedNodeId);
            previouslyClickedNode.font.size = 20; // Reset font size to original size
            nodes.update(previouslyClickedNode);
        }

        // Increase font size of clicked node
        var clickedNode = nodes.get(clickedNodeId);
        clickedNode.font.size = 30; // Increase font size
        nodes.update(clickedNode);

        // Update previously clicked node
        previouslyClickedNodeId = clickedNodeId;
    }
});
