// network.js
// Create a new network instance
var container = document.getElementById('network');
var data = {
    nodes: [
        { id: 1, label: 'Node 1' },
        { id: 2, label: 'Node 2' },
        { id: 3, label: 'Node 3' }
    ],
    edges: [
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 1 }
    ]
};
var options = {};
var network = new vis.Network(container, data, options);
