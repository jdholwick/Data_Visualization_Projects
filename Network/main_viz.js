const svg = d3.select('#networkCont');

// As a reminder the '+' is simply there to ensure casting to an int.
const width = +svg.attr('width');
const height = +svg.attr('height');

const centX = width/2;
const centY = height/2;

import {charNodes, charNodeEdges} from "./data/data.js"; // Import apparently DOES need to know the file extension of '.js'

const strwrsCharSim = d3.forceSimulation(charNodes)
    .force("charge", d3.forceManyBody().strength(-1100))
    .force("link", d3.forceLink(charNodeEdges))//.distance(10))
    .force("center", d3.forceCenter(centX, centY));

const dragFeature = d3.drag().on('drag', (event, node) => {
    // 'fx' keeps moved nodes in fixed place.
    node.fx = event.x;
    node.fy = event.y;

    strwrsCharSim.alpha = 1;
    strwrsCharSim.restart();

});

const edgeLines = svg
    .selectAll('line')
    .data(charNodeEdges)
    .enter()
    .append('line')
    .attr('stroke-width', 2.0)
    .attr('stroke', '#83B8CD');

const nodeCircles = svg
    .selectAll('circle')
    .data(charNodes)
    .enter()
    .append('circle')
    .attr('r', (d) => (d.value)/1.2)
    .attr('stroke', '#000000')
    .attr('fill', function(d) {
        if (d.colour != "#808080") {return "#F59432"}
        else {return "#95765D"}
    }) // Instead of using the colors that original data author assigned, this 'if' statement will simplify to two colors.
    .call(dragFeature);

const nodeText = svg
    .selectAll('text')
    .data(charNodes)
    .enter()
    .append('text')
    .attr('text-anchor', 'middle') // Puts text on middle of nodes
    .attr('alignment-baseline', 'middle')
    .attr('fill', '#1d3557')
    .attr('stroke-width', .65)
    .attr('font-family', 'courier')
    .attr('font-size', 30)
    .attr('font-weight', 'bold')
    .attr('pointer-events', 'none') // Using this ensures that '.append('title')' over circles is not impeded by the text.
    .text(d => d.name);

strwrsCharSim.on('tick', () => { // The parameter 'tick' is commanding what happens when something in the viz changes.
    nodeCircles
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .append('title')
        .text(d => "Number of scenes " + d.name + " appeared in: " + d.value)

    edgeLines
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
        .append('title')
        .text(d => 'Number of scenes the two appeared in: ' + d.value)

    nodeText
        .attr('x', d => d.x)
        .attr('y', d => d.y)
});

