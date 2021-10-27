const colorScale = d3.scaleOrdinal(d3.schemeSet1);

const margin = { top: 75, left: 75, right: 75, bottom: 75},
     height = 700 - margin.top - margin.bottom,
     width = 1325 - margin.left - margin.right;

// Whenever there are shapes on a map we want to use 'geoMercator' (generally) and 'geoPath' apparently
const projection = d3.geoMercator()
    .center([25, 40 ]) // Roughly puts the mediterranean area we need in the center
    .translate([width/2, height/2])
    .scale(1900); // Essentially creates the level of zoom on our map we'll see

const svgMap = d3.select("#map")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("border", 2)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const borderPath = svgMap.append("rect")
    // -75 compensates for 75 pixels margins in 'margin'.
    .attr("x", -75)
    .attr("y", -75)
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    .style("stroke", "#566573")
    .style("fill", "#AED6F1") // essentially gives our oceans color
    .style("stroke-width", 4);

const mapPath = d3.geoPath()
    .projection(projection);

const g = svgMap.append("g");

// The following will display the Mediterranean part of the world
d3.json("data/world-50m.json").then(function(worldTopo) {

    g.selectAll("countries")
        .data(topojson.feature(worldTopo, worldTopo.objects.countries)
            .features)
        .enter().append("path")
        .attr("d", mapPath) // grabs the 'map_path' constiable i made and filled with 'geoPath' and then displays our map in the browser
        .attr("fill", "none") // no color so that there is no interference with my '.county' layer
        .attr("stroke", "#566573") // subtle border color for countries
        .attr("stroke-width", "1.9");

    // load and display the cities
    d3.csv("data/polis data_distributed 21.08.25.csv").then(function(polisData) {
        const optionsWalls = ["has walls", "has no walls"]

        //console.log(polisData)
        g.selectAll("city-marks")
            .data(polisData)
            .enter()
            .append("a")
            .append("circle")

            // the lat and long must be converted to x and y coordinates (as was discussed in lecture -- turns out this is true)
            .attr("cx", function(d) {
                if (d.area_1 >= 3){
                    return projection([d.Longitude, d.Latitude])[0]; // Returns only x coord
                }
            })
            .attr("cy", function(d) {
                if (d.area_1 >= 3){
                    //console.log(d.Latitude) // There is a green dot with no city name that is unaccounted for. It does not seem to be listed in the console data because it would have to be lat 45 or 46 and the four that fit that are cities.
                    return projection([d.Longitude, d.Latitude])[1]; // returns only y coord
                }
            })

            .attr("r", 3.5)
            .style("fill", (d) => colorScale(d.Democracy))//"#F44336")
            // i commented out opacity for now, because it produces different shades of colors which can be confusing when comparing to the key
            //.attr("opacity", "0.85") // makes each dot slightly opaque
            .append("title")
            .text((d) => "City Name: " + d.Name + "\nDemocracy: " + d.Democracy + "\nHellenicity: " + d.Hellenicity) // Pulls city name of corresponding coordinates. JS Note: () => {} is a fast way of creating a function and the part after the arrows is the return.

        // add the options to the button
        var selectCategories = ["Level of Democracy", "Level of Hellenicity"]

        d3.select("#selectCategory")
            .selectAll("myOptions")
            .data(selectCategories)
            .enter()
            .append("option")
            .text(function (d) { return d; }) // text showed in the menu
            .attr("value", function (d) { return d; }) // corresponding value returned by the button

        // used to update the map based on the selection from pulldown, 'selectCategory'
        function mapUpdate(selectedGroup) {

            if (selectedGroup == "Level of Democracy") {
                // Create new data with the selection?
                //var dataFilter = polisData.map(function(d){return {value:d[selectedGroup]} })

                g.selectAll("city-marks")
                    .data(polisData)
                    .enter()
                    .append("a")
                    .append("circle")

                    // the lat and long must be converted to x and y coordinates (as was discussed in lecture -- turns out this is true)
                    .attr("cx", function (d) {
                        if (d.area_1 >= 3) {
                            return projection([d.Longitude, d.Latitude])[0]; // Returns only x coord
                        }
                    })
                    .attr("cy", function (d) {
                        if (d.area_1 >= 3) {
                            //console.log(d.Latitude) // There is a green dot with no city name that is unaccounted for. It does not seem to be listed in the console data because it would have to be lat 45 or 46 and the four that fit that are cities.
                            return projection([d.Longitude, d.Latitude])[1]; // returns only y coord
                        }
                    })

                    .attr("r", 3.5)
                    .style("fill", (d) => colorScale(d.Democracy))//"#F44336")
                    // i commented out opacity for now, because it produces different shades of colors which can be confusing when comparing to the key
                    //.attr("opacity", "0.85") // makes each dot slightly opaque
                    .append("title")
                    .text((d) => "City Name: " + d.Name + "\nDemocracy: " + d.Democracy + "\nHellenicity: " + d.Hellenicity) // Pulls city name of corresponding coordinates. JS Note: () => {} is a fast way of creating a function and the part after the arrows is the return.

                    // the following resets the zoom based on the option selected from 'selectCategory' pulldown
                    g.selectAll('path')
                        .attr('transform', d3.transform);
                    g.selectAll("circle")
                        .attr('transform', d3.transform);
                    g.selectAll("text")
                        .attr('transform', d3.transform);
            }

            if (selectedGroup == "Level of Hellenicity") {

                g.selectAll("city-marks")
                    .data(polisData)
                    .enter()
                    .append("a")
                    .append("circle")

                    // the lat and long must be converted to x and y coordinates (as was discussed in lecture -- turns out this is true)
                    .attr("cx", function (d) {
                        if (d.area_1 >= 3) {
                            return projection([d.Longitude, d.Latitude])[0]; // Returns only x coord
                        }
                    })
                    .attr("cy", function (d) {
                        if (d.area_1 >= 3) {
                            //console.log(d.Latitude) // There is a green dot with no city name that is unaccounted for. It does not seem to be listed in the console data because it would have to be lat 45 or 46 and the four that fit that are cities.
                            return projection([d.Longitude, d.Latitude])[1]; // returns only y coord
                        }
                    })

                    .attr("r", 3.5)
                    .style("fill", (d) => colorScale(d.Hellenicity))//"#F44336")
                    // i commented out opacity for now, because it produces different shades of colors which can be confusing when comparing to the key
                    //.attr("opacity", "0.85") // makes each dot slightly opaque
                    .append("title")
                    .text((d) => "City Name: " + d.Name + "\nDemocracy: " + d.Democracy + "\nHellenicity: " + d.Hellenicity) // Pulls city name of corresponding coordinates. JS Note: () => {} is a fast way of creating a function and the part after the arrows is the return.

                    // the following resets the zoom based on the option selected from 'selectCategory' pulldown
                    g.selectAll('path')
                        .attr('transform', d3.transform);
                    g.selectAll("circle")
                        .attr('transform', d3.transform);
                    g.selectAll("text")
                        .attr('transform', d3.transform);
            }

        }

        // when the pulldown is selected 'mapUpdate()' is called to change the coloring of the cities
        d3.select("#selectCategory").on("change", function(d) {
            var selectedOption = d3.select(this).property("value") // selected option is stored to be passed to 'mapUpdate()'
            mapUpdate(selectedOption)
        })

    });
});

const zoom = d3.zoom()
    .scaleExtent([.5, 8]) // .5 seems to allow us to zoom out just a bit from the starting zoom, where 1 did not. .5 works best I think.
    //.translateextent(... // refer to pg. 309 in D3 book and see if this would be helpful in constraining.
    .on('zoom', function(event) {
        g.selectAll('path')
            .attr('transform', event.transform);
        g.selectAll("circle")
            .attr('transform', event.transform);
        g.selectAll("text")
            .attr('transform', event.transform);
    });

svgMap.call(zoom);