// Create a new vis Network instance
var nodes = new vis.DataSet([
    { id: 1, label: 'Node 1' },
    { id: 2, label: 'Node 2' },
    { id: 3, label: 'Node 3' }
]);
var edges = new vis.DataSet([]);

// Provide data in the format of nodes and edges
var data = {
    nodes: nodes,
    edges: edges
};

// Get the container where the network will be displayed
var container = document.getElementById('network');

// Set the options for the network
var options = {};

// Create a new vis network using the data and options
var network = new vis.Network(container, data, options);
