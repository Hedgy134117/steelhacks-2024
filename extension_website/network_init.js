// Define the nodes
var nodes = new vis.DataSet([
    { id: 1, label: 'CS 441' },
    { id: 2, label: 'CS 445' },
    { id: 3, label: 'CS 1501' }
]);

// Define the edges
var edges = new vis.DataSet([
    { from: 1, to: 3 },
    { from: 2, to: 3 }
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
    nodes: {

        font: {
            size: 20

        }

    },
    edges: {
        width: 2
    },
    physics: {
        enabled: true
    }
};

// Create a new vis network using the data and options
var network = new vis.Network(container, data, options);
