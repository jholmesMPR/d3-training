function buildChart(containerId) {
var width = 1088;
var height = 960;
var radius = 6;

var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 75
    };

// calculate dimensions without margins
var innerWidth = width - margin.left - margin.right;
var innerHeight = height - margin.top - margin.bottom;

var svg = d3
    .select(containerId)
    .append('svg')
    .attr('height', height)
    .attr('width', width);

var g = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


var color = d3.scaleOrdinal(d3.schemeCategory20);

// var color = d3.scaleOrdinal()
// .domain(['A', 'B', 'C', 'D', 'E'])
// .range("#E70033", "#FFCB00", "#EF8200", "#C05131", "#FFD01A");

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody().strength(-10))
    .force("collide", d3.forceCollide().radius(-1))
    .force("center", d3.forceCenter(innerWidth / 2, innerHeight / 2));

d3.json("data/intl.json", function(error, graph) {
   if (error) {
          console.error('failed to read data');
          return;
      }
      drawNetwork(graph)
    });

  function drawNetwork(graph){

    var link = g
        .append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("stroke-width", 1)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var node = g
        .append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("fill", function(d) { return color(d.level); })

        //.on("mouseover", mouseover)
        //.attr("data-legend", function(d) { return d.level});
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        // .call(d3
        //   .on("mouseover", function(d) {
        //     .attr("r", 10);
        //   })
        //   );

     node.append("text")
          .attr("dx", 12)
          .attr("dy", ".35em")
          .text(function(d) {
              return d.id;
          });

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);
        //.on("mouseover", handleMouseOver);

    simulation
        .force("link")
        .links(graph.links);

    function ticked() {
      link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      //constrains the nodes to be within a box
      node
          .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(innerWidth - radius, d.x)); })
          .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(innerHeight - radius, d.y)); });
    }

}

}

buildChart('#network')