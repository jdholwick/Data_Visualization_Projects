const svg = d3.select('#networkCont');

const width = +svg.attr('width');
const height = +svg.attr('height');
const centX = width/2;
const centY = height/2;

//import {testDataPoint} from "./data/data.js"; // Import apparently DOES need to know the file extension of '.js'
import {charNodes, charNodeLinks} from "./data/data.js";

console.log(charNodes, charNodeLinks);

const testSim = d3.forceSimulation(charNodes)
    .force("charge", d3.forceManyBody().strength(-1500))
    .force("link", d3.forceLink(charNodeLinks))//.distance(10))
    .force("center", d3.forceCenter(centX, centY));

// For the D3 'scaleOrdinal()' function it doesn't matter what the data is... it's just counting the number of elements.
//const circleData = [1,2,3]//,4,5,6,7,8,9,10,11,12,13,14,15,16]
//const lineData = [1,2,3]//,4,5,6,7,8,9,10,11,12,13,14,15]

//const circleColors = d3.scaleOrdinal().domain(circleData).range(d3.schemeSet3);
//const lineColors = d3.scaleOrdinal().domain(lineData).range(d3.schemeSet3);

const circleNodes = svg
    .selectAll('circle')
    .data(charNodes)
    .enter()
    .append('circle')
    .attr('r', (d) => (d.value)/1.2)//12)
    .attr('fill', (d) => d.colour);//'#ee9b00');//function(d){return circleColors(d) });

const lineLinks = svg
    .selectAll('line')
    .data(charNodeLinks)
    .enter()
    .append('line')
    .attr('stroke-width', 2)
    .attr('stroke', '#e9ecef');//function(d){return lineColors(d) });

const textNodes = svg
    .selectAll('text')
    .data(charNodes)
    .enter()
    .append('text')
    .attr('text-anchor', 'middle') // Puts text on middle of nodes
    .attr('alignment-baseline', 'middle')
    .attr('fill', '#f4f1de')//'#1d3557')
    .attr('stroke-width', .65)
    .attr('font-size', 30)
    .attr('font-weight', 'bold')
    .attr('stroke', '#335c67')
    .text(d => d.name);
testSim.on('tick', () => {
    circleNodes
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .append('title')
        .text((d) => d.name + " Character Interactions: " + d.value)

    lineLinks
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
        .append('title')
        .text((d) => 'Edge Value: ' + d.value) // TESTING: Just keep this for testing purposes.

            textNodes
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .append('title')
        .text((d) => d.name + " Character Interactions: " + d.value)

    //console.log('tick');
});

