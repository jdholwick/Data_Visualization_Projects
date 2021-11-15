// (function (d3)
// {
//     'use strict';

    const svg = d3.select('#networkCont');

    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const centX = width/2;
    const centY = height/2;

    import {testDataPoint} from "./data/data.js"; // Import apparently DOES need to know the file extension of '.js'

    import {testNodes, testLinks} from "./data/data.js";

    console.log(testDataPoint, testNodes, testLinks);

    /*const testNodes = [
        {"id": "Java"},
        {"id": "Python"},
        {"id": "COBOL"},
        {"id": "R"},
        {"id": "Charm"},
        {"id": "C++"},
        {"id": "Swift"},
        {"id": "F#"},
        {"id": "Alice"}
    ]

    const testLinks = [
        {"source": 0, "target": 1}, // Java -> Python
        {"source": 1, "target": 2},
        {"source": 2, "target": 2},
        {"source": 2, "target": 3},
        {"source": 2, "target": 4},
        {"source": 3, "target": 4},
        {"source": 4, "target": 5},
        {"source": 4, "target": 6},
        {"source": 6, "target": 7},
        {"source": 6, "target": 8}
    ];*/

    const testSim = d3.forceSimulation(testNodes)
        .force("charge", d3.forceManyBody().strength(-400))
        .force("link", d3.forceLink(testLinks))
        .force("center", d3.forceCenter(centX, centY));


    // For the D3 'scaleOrdinal()' function it doesn't matter what the data is... it's just counting the number of elements.
    const circleData = [1,2,3]//,4,5,6,7,8,9,10,11,12,13,14,15,16]
    const lineData = [1,2,3]//,4,5,6,7,8,9,10,11,12,13,14,15]

    const circleColors = d3.scaleOrdinal().domain(circleData).range(d3.schemeSet3);
    const lineColors = d3.scaleOrdinal().domain(lineData).range(d3.schemeSet3);

    const circleNodes = svg
        .selectAll('circle')
        .data(testNodes)
        .enter()
        .append('circle')
        .attr('r', 12)
        .attr('fill', '#ee9b00');//function(d){return circleColors(d) });

    const textNodes = svg
        .selectAll('text')
        .data(testNodes)
        .enter()
        .append('text')
        .attr('text-anchor', 'middle') // Puts text on middle of nodes
        .attr('alignment-baseline', 'middle')
        .text(d => d.name);

    const lineLinks = svg
        .selectAll('line')
        .data(testLinks)
        .enter()
        .append('line')
        .attr('stroke', '#0a9396');//function(d){return lineColors(d) });

    testSim.on('tick', () => {
        circleNodes
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
        textNodes
            .attr('x', d => d.x)
            .attr('y', d => d.y)
        lineLinks
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y)
        console.log('tick');
    });

// }(d3));