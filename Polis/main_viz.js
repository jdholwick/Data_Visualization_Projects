var margin = { top: 75, left: 75, right: 75, bottom: 75},
     height = 800 - margin.top - margin.bottom,
     width = 1400 - margin.left - margin.right;

// Whenever there are shapes on a map we want to use 'geoMercator' (generally) and 'geoPath' apparently
var projection = d3.geoMercator()
    .center([25, 40 ]) // Roughly puts the mediterranean area we need in the center
    .translate([width/2, height/2])
    .scale(1900); // Essentially creates the level of zoom on our map we'll see

var svgMap = d3.select("#map")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("border", 2)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var borderPath = svgMap.append("rect")
    // -75 compensates for 75 pixels margins in 'margin'.
    .attr("x", -75)
    .attr("y", -75)
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    .style("stroke", "black")
    .style("fill", "#AED6F1") // Essentially gives our oceans color
    .style("stroke-width", 4);

var mapPath = d3.geoPath()
    .projection(projection);

var g = svgMap.append("g");

// The following will display the Mediterranean part of the world
d3.json("data/world-50m.json").then(function(worldTopo) {

    g.selectAll("countries")
        .data(topojson.feature(worldTopo, worldTopo.objects.countries)
            .features)
        .enter().append("path")
        .attr("d", mapPath) // grabs the 'map_path' variable i made and filled with 'geoPath' and then displays our map in the browser
        .attr("fill", "none") // no color so that there is no interference with my '.county' layer
        .attr("stroke", "#186A3B")
        .attr("stroke-width", "1.9");

    // load and display the cities
    d3.csv("data/polis data_distributed 21.08.25.csv").then(function(polisData) {
        g.selectAll("city-marks")
            .data(polisData)
            .enter()
            .append("a")
            .append("circle")

            // the lat and long must be converted to x and y coordinates (as was discussed in lecture -- turns out this is true)
            .attr("cx", function(d) {
                return projection([d.Longitude, d.Latitude])[0]; // Returns only x coord
            })
            .attr("cy", function(d) {
                return projection([d.Longitude, d.Latitude])[1]; // returns only y coord
            })
            .attr("r", 5.65)
            .style("fill", "#F44336")
            .attr("opacity", "0.85") // makes each dot slightly opaque
            .append("title")
            .text((d) => d.Name); // Pulls city name of corresponding coordinates. JS Note: () => {} is a fast way of creating a function and the part after the arrows is the return.
    });
});

var zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on('zoom', function(event) {
        g.selectAll('path')
            .attr('transform', event.transform);
        g.selectAll("circle")
            .attr('transform', event.transform);
        g.selectAll("text")
            .attr('transform', event.transform);
    });

svgMap.call(zoom);
