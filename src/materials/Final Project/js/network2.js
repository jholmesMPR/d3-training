function buildGraph(containerId) {
    var width = 1350;
    var height = 960;
    var radius = 6;

    var margin = {
            top: 50,
            right: 50,
            bottom: 50,
            left: 75};

    // calculate dimensions without margins
    var innerWidth = width - margin.left - margin.right;
    var innerHeight = height - margin.top - margin.bottom;

    var svg = d3
        .select(containerId)
        .append('svg')
        .attr('height', height)
        .attr('width', width)
        .attr("align","center");

    var g = svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    d3.json("data/mpr.json", function(error, graph) {
        if (error) {
              console.error('failed to read data');
              return;
          }
          console.log('raw_graph', graph);

        initialDivision = "Health";
        drawNetwork(graph, initialDivision);
        //additional();

    });

    function drawNetwork(graph, initialDivision){
   
       var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody().strength(-15))
        .force("collide", d3.forceCollide().radius(15))
        .force("center", d3.forceCenter(innerWidth / 2, innerHeight / 2));

        // set the nodes
        var nodes = graph.nodes
         .filter(function(d) { return d.division == initialDivision |
                                      d.id == "Paul Decker"});
        // links between nodes}
        var links = graph.links
         .filter(function(d) { return d.division == initialDivision |
                                      d.id == "Paul Decker"});

        var color = d3.scaleOrdinal(d3.schemeCategory20);

        nodes.forEach(function(d){
            d.color = color(d.level);
        });

        // var cl = nodes.map(
        //     function(d){return {
        //         level: d.level,
        //         color: d.color};
        //     });

        // var colorLegend = d3.nest()
        //   .key(function(d) { return {
        //     level:d.level,
        //     color: d.color}; })
        //   .entries(cl);
        // var colorLegend = d3.nest()
        //   .key(function(d) { return d.level; })
        //   //.rollup(function(v) { return v.level; })
        //   .entries(cl);

        //var colorLegend = d3.map(nodes, function(d) { return d.level; });
        //console.log('keys', keys);
        // var colorLegend =  d3
        //    .map(nodes, 
        //     function(d){return {
        //         level: d.level
        //         color: d.color};
        //     })
        //   .keys();

        
        // colorLegend.sort(function(x, y){
        //     return d3.ascending(x.level, y.level);
        // })

        //console.log('colorLegend', colorLegend); 


        // add the curved links to our graphic
        var link = svg.selectAll(".link")
            .data(links)
            .enter()
            .append("path")
            .attr("class", "link")
            .attr('stroke', function(d){
                return "#ddd";
            });

        // add the nodes to the graphic
        var node = svg.selectAll(".node")
            .data(nodes)
            .enter()
            .append("g");

        // a circle to represent the node
        node.append("circle")
            .attr("class", "node")
            .attr("r", 4)
            .attr("fill", function(d) {
                return d.color;
            })
            .on("mouseover", mouseOver(.2))
            .on("mouseout", mouseOut);

        // add a label to each node
        node.append("text")
            .attr('class', 'labels')
            .attr("dx", 11)
            .attr("dy", ".35em")
            .text(function(d) {
                return d.id;
            })
            .style("fill", "#555")
            .attr("transform", "rotate(325)")
            .style("fill-opacity", 0)
            .style("font-family", "Arial")
            .style("font-size", 10);

        // add the nodes to the simulation and
        // tell it what to do on each tick
        simulation
            .nodes(nodes)
            .on("tick", ticked);

        // add the links to the simulation
        simulation
            .force("link")
            .links(links);

        // on each tick, update node and link positions
        function ticked() {
            link.attr("d", positionLink);
            node.attr("transform", positionNode);
        }

        // links are drawn as curved paths between nodes,
        // through the intermediate nodes
        function positionLink(d) {
            var offset = 10;

            var midpoint_x = (d.source.x + d.target.x) / 2;
            var midpoint_y = (d.source.y + d.target.y) / 2;

            var dx = (d.target.x - d.source.x);
            var dy = (d.target.y - d.source.y);

            var normalise = Math.sqrt((dx * dx) + (dy * dy));

            var offSetX = midpoint_x + offset*(dy/normalise);
            var offSetY = midpoint_y - offset*(dx/normalise);

            return "M" + d.source.x + "," + d.source.y +
                "S" + offSetX + "," + offSetY +
                " " + d.target.x + "," + d.target.y;
        }


        // move the node based on forces calculations
        function positionNode(d) {
            // keep the node within the boundaries of the svg
            if (d.x < 0) {
                d.x = 0
            };
            if (d.y < 0) {
                d.y = 0
            };
            if (d.x > innerWidth) {
                d.x = innerWidth
            };
            if (d.y > innerHeight) {
                d.y = innerHeight
            };

              d.x = Math.max(radius, Math.min(innerWidth - radius, d.x)); 
              d.y = Math.max(radius, Math.min(innerWidth - radius, d.y)); 

            return "translate(" + d.x + "," + d.y + ")";
        }


        // build a dictionary of nodes that are linked
        var linkedByIndex = {};
        links.forEach(function(d) {
            linkedByIndex[d.source.index + "," + d.target.index] = 1;
        });

        // check the dictionary to see if nodes are linked
        function isConnected(a, b) {
            return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
        }

        // fade nodes on hover
        function mouseOver(opacity) {
            return function(d) {
                // check all other nodes to see if they're connected
                // to this one. if so, keep the opacity at 1, otherwise
                // fade
                node.style("stroke-opacity", function(o) {
                    thisOpacity = isConnected(d, o) ? 1 : opacity;
                    return thisOpacity;
                });
                node.style("fill-opacity", function(o) {
                    thisOpacity = isConnected(d, o) ? 1 : opacity;
                    return thisOpacity;
                });

                node.selectAll('.labels')
                //.attr('class', 'labels')
                    .style('fill-opacity', function(o){
                    thisOpacity = isConnected(d, o) ? 1 : 0;
                    return thisOpacity;
                    });            

                // also style link accordingly
                link.style("stroke-opacity", function(o) {
                    return o.source === d || o.target === d ? 1 : opacity;
                });
                link.style("stroke", function(o){
                    return o.source === d || o.target === d ? o.source.colour : "#ddd";
                });
            };
        }

        function mouseOut() {
            node.style("stroke-opacity", 1);
            node.style("fill-opacity", 1);
            node.selectAll('.labels')
                .style("fill-opacity", 0);
            link.style("stroke-opacity", 1);
            link.style("stroke", "#ddd");
        }

        //Legend
        var radius1 = 6;
        var y1 = 40;
        var x1 = 40;
        var spacing1 = 27;
        var w1 = 100;
        var h1 = height;

        var legend = d3
                .select(containerId)
                .append('svg')
                .attr('height', h1)
                .attr('width', w1)
                .attr('transform', 'translate(' + 5 + ',' + 5 + ')');

        legend.append('text')
                .attr('class', 'title')
                .attr('x', w1 / 2)
                .attr('y', 20)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'baseline')
                .text('Level')
                .style("font", "16px Arial");

        // var g2 = legend
        //         .append("g")
        //         .selectAll("g")
        //         .data(colorLegend)
        //         .enter()
        //         .append('g')
        //         .attr('class', 'dots');

        //     g2.append('circle')
        //           .attr('r', radius1)
        //           .attr('cx', x1)
        //           .attr('cy', function(d, i){
        //             return i * spacing1 + y1;
        //             })
        //           .style('fill', function(d){
        //             return d.value.color;
        //           })
        //           .style('stroke',  function(d){
        //             return d.value.color;
        //           })
        //           .attr('fill-opacity', 1);

        //     g2.append('text')
        //         .attr('x', x1 + 20)
        //         .attr('y', function(d, i){
        //             return i * spacing1 + y1 + radius1/2;
        //             })
        //         .text(function(d) { 
        //             return d.key; 
        //         });
    }


    // function additional(){
    //   var choices = ["Health", "Human Serivces", "International", "Admin"];

    //  // Create a dropdown
    //   var Menu = d3.select("#dropdown")

    //   Menu
    //   .append("select")
    //   .selectAll("option")
    //       .data(choices)
    //       .enter()
    //       .append("option")
    //       .attr("value", function(d){
    //           return d;
    //       })
    //       .text(function(d){
    //           return d;
    //       });
    // }

}

function buildBar(containerId){

    d3.csv("data/mpr_nodes.csv", function(error, data){
        if (error) {
              console.error('failed to read data');
              return;
        }
        console.log('raw_data', data); 

        startYear = dm(data);
        console.log('summarized data', startYear);
        drawBar(startYear);
    
    });

    function dm(data){
        //Add variable to summarize
        var startYear = d3.nest()
            .key(function(d) { return d.start_year; })
            .rollup(function(v) { return v.length; })
            .entries(data);

        startYear.forEach(function(d){
            d.key = +d.key;
        })

        startYear.sort(function(x, y){
            return d3.ascending(x.key, y.key);
        });
        
        return startYear;
    }

    function drawBar(data){
        var width = 1500;
        var height = 960;

        var margin = {
                top: 50,
                right: 50,
                bottom: 50,
                left: 75};

        // calculate dimensions without margins
        var innerWidth = width - margin.left - margin.right;
        var innerHeight = height - margin.top - margin.bottom;


        var color = d3.scaleOrdinal(d3.schemeCategory20);

        var svg = d3
            .select(containerId)
            .append('svg')
            .attr('height', height)
            .attr('width', width)
            .attr("align","center");

        var g = svg
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        g
            .selectAll('.years')
            .data(startYear)
            .enter()
            .append('g')
            .attr('class', 'years');


        // var x = d3
        //     .scaleBand()
        //     .domain(
        //         data.map(function(d) {
        //             return d.State;
        //         })
        //     )
        //     .range([0, innerWidth])
        //     .padding(0.1);

        // var y = d3
        //     .scaleLinear()
        //     .domain([
        //         0,
        //         d3.max(data, function(d) {
        //             return d.Emissions;
        //         })
        //     ])
        //     .range([innerHeight, 0]);


        // var xAxis = d3.axisBottom(x);

        // g
        //     .append('g')
        //     .attr('class', 'x-axis')
        //     .attr('transform', 'translate(0,' + innerHeight + ')')
        //     .call(xAxis);

        // var yAxis = d3.axisLeft(y).ticks(12);

        // g
        //     .append('g')
        //     .attr('class', 'y-axis')
        //     .call(yAxis);

    }


}

buildGraph('#network');

buildBar('#bar');