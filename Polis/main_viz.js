var margin = { top: 75, left: 75, right: 75, bottom: 75},
    height = 800 - margin.top - margin.bottom,
    width = 1400 - margin.left - margin.right;

var svgMap = d3.select("#map")
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
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
    .style("fill", "#AED6F1") // Essentially gives our oceans color.
    .style("stroke-width", 4);

// The following does not work.
/*Promise.all([
    d3.json("data/countries-10m.json"), d3.csv("data/polis data_distributed 21.08.25.csv")
]).then(ready)*/

d3.queue()
    .defer(d3.json, "data/countries-10m.json") // first item here so second in 'function ready()'
    .defer(d3.csv, "data/polis data_distributed 21.08.25.csv") // second item here so third in 'function ready()'
    .await(ready)

// Whenever there are shapes on a map we want to use 'geoMercator' (generally) and 'geoPath' apparently
var projection = d3.geoMercator()
    .center([ 29, 41 ]) // Roughly puts the mediterranean area we need in the center
    .translate([width/2, height/2])
    .scale(1900) // essentially creates the level of zoom on our map we'll see

var mapPath = d3.geoPath()
    .projection(projection)

// Adapted from "https://bl.ocks.org/vasturiano/f821fc73f08508a3beeb7014b2e4d50f" but does not work presently
/*var zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on('zoom', zoomed)

svgMap.call(zoom)

d3.json('data/countries-10m.json')
    .then(world => {
        g.append('path')
            .datum({ type: 'Sphere' })
            .attr('class', 'sphere')
            .attr('d', mapPath)

        g.append('path')
            .datum(topojson.merge(world, world.objects.countries.geometries))
            .attr('class', 'land')
            .attr('d', mapPath)

        g.append('path')
            .datum(topojson.mesh(world, world.objects.countries, (a, b) => a !== b))
            .attr('class', 'boundary')
            .attr('d', mapPath)
    })

function zoomed() {
    svgMap
        .selectAll('mapPath')
        .attr('transform', d3.event.transform)
}
*/

function ready (error, data, city) {
    //console.log(city)

    var text_color = "#74FF00"
    var countries = topojson.feature(data, data.objects.countries).features

    svgMap.selectAll(".country")//.state")
        .data(countries)
        .enter().append("path")
        .attr("class", "country")
        .attr("d", mapPath) // grabs the 'map_path' variable i made and filled with 'geoPath' and then displays our map in the browser
        //.attr("title", "country name") // This won't work. We need to do something different with SVG.
        .attr("fill", "none") // no color so that there is no interference with my '.county' layer
        .attr("stroke", "#186A3B")
        .attr("stroke-width", "1.9")
//            .append("title")
//            .text("country name");


    // Zooming is not working, though the console does show a 'zoom' variable to go way up as I use mousewheel.
/*    svgMap.call(d3.zoom().on("zoom", () => {
        console.log("zoom");
    }))
*/
    svgMap.selectAll(".city-marks")
        .data(city)
        .enter().append("circle")
        .attr("r", 1.65)
        .attr("fill", "#F44336")//"#34495E")

        // the lat and long must be converted to x and y coordinates (as was discussed in lecture -- turns out this is true)
        .attr("cx", function (d) {
            // notice we must feed in both 'long' and 'lat' to get 'x' coord
            var coords = projection([d.Longitude, d.Latitude])
            return coords[0]; // returns 'x' only
        })
        .attr("cy", function (d) {
            var coords = projection([d.Longitude, d.Latitude])
            return coords[1]; // returns 'y' only
        })

        .attr("opacity", "0.85") // makes each dot slightly opaque

        .append("title")

        // Pulls city name of corresponding coordinates. JS Note: () => {} is a fast way of creating a function and the part after the arrows is the return.
        .text((d) => d.Name)

    svgMap.selectAll(".city-name")
        .data(city)
        .enter().append("text")
        .attr("class", "city-name")
}