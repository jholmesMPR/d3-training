function buildChart(containerId) {
var width = 1500;
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
    .attr('width', width)
    .attr("align","center");

var g = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody().strength(-100))
    .force("collide", d3.forceCollide().radius(3))
    .force("center", d3.forceCenter(innerWidth / 2, innerHeight / 2));

d3.json("data/mpr.json", function(error, graph) {
   if (error) {
          console.error('failed to read data');
          return;
      }
      initialDivision = "Health"
      drawNetwork(graph, initialDivision);
      //additional();
    });

  function drawNetwork(graph, initialDivision){
    // dimensions
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
            return color(d.level);
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
        if (d.x > width) {
            d.x = width
        };
        if (d.y > height) {
            d.y = height
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
        link.style("stroke-opacity", 1);
        link.style("stroke", "#ddd");
    }

    // function searchNode() {
    //   //find the node
    //   var selectedVal = document.getElementById('search').value;
    //   //node = svg.selectAll(".node");
    //   if (selectedVal == "none") {
    //       node.style("stroke", "white").style("stroke-width", "1");
    //   } else {
    //       var selected = node.filter(function (d, i) {
    //           return d.id != selectedVal;
    //       });
    //       selected.style("opacity", "0");
    //       //var link = svg.selectAll(".link")
    //       link.style("opacity", "0");
    //       d3.selectAll(".node, .link").transition()
    //           .duration(5000)
    //           .style("opacity", 1);
    //   }
    // }

    }


    function additional(){
      var choices = ["Health", "Human Serivces", "International", "Admin"];

     // Create a dropdown
      var Menu = d3.select("#dropdown")

      Menu
      .append("select")
      .selectAll("option")
          .data(choices)
          .enter()
          .append("option")
          .attr("value", function(d){
              return d;
          })
          .text(function(d){
              return d;
          })
          ;
    }

}

buildChart('#network')