function buildGraph(containerId) {
    var width = 1350;
    var height = 1200;
    var radius = 6;

    var margin = {
            top: 75,
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


    function changeIt(){
    //get rid of everything and re-draw
        d3.selectAll(".node").remove()
        d3.selectAll(".labels").remove()
        d3.selectAll(".link").remove()
      //  d3.selectAll(".legend-title").remove()
      //  d3.selectAll(".dots").remove()
      //  d3.selectAll("svg text.legend-text").remove()

        var form = document.getElementById("dimensions")
        var form_val;
        for(var i=0; i<form.length; i++){
            if(form[i].checked){
            form_val = form[i].id;}
            }
        data = filterData(graph, form_val)
        console.log('Value', form_val);

        drawNetwork(data, form_val);    
    }
    
    var dataDim = d3.select("#dimensions");

    dataDim.on("change", changeIt);
  
    start = 'Health';
    data = filterData(graph, start);
    console.log('filter data', data);
    drawNetwork(data, start);
     drawLegend();


    });

    function filterData(graph, division){
        if(division == 'International'){
            var nodes = graph.nodes
            .filter(function(d){
                return d.id == "Jeremy Page" | d.id == "Mary Grider" | d.division == division | d.id == "Paul Decker"
                });
            console.log('nodes', nodes);

            var links = graph.links
            .filter(function(d){

               return d.id == "Jeremy Page" | d.id == "Mary Grider" | d.division == division | d.id == "Paul Decker" 
                });

        } else {
            var nodes = graph.nodes
             .filter(function(d){
                return  d.division == division | d.id == "Paul Decker"});
            
            var links = graph.links
             .filter(function(d){
                return d.division == division | d.id == "Paul Decker"});

        }   

        var graph_new = {'nodes': nodes, 'links':links}
          return graph_new;
        }
        


    function drawNetwork(graph, division){
       var color = d3.scaleOrdinal() // D3 Version 4
                .domain(['A', 'B', 'C', 'D', 'E', 'O'])
                .range(['#1E0576', '#771493' , '#e70033', '#0063be', '#009a3d', '#f7941e']);



       var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody().strength(-15))
        .force("collide", d3.forceCollide().radius(17))
        .force("center", d3.forceCenter(innerWidth / 2, innerHeight / 2));

        // set the nodes
        var nodes = graph.nodes
         // .filter(function(d) { return (d.division == initialDivision |
         //                              d.id == "Paul Decker") //have to pull in Paul from other divisions because otherwise node is missing
                                      
         //                          });
         ;
        // links between nodes
        var links = graph.links
         // .filter(function(d) { return (d.division == initialDivision |
         //                              d.id == "Paul Decker")
         //                             // & d.start_year <= 2007
         //                          });
         ;


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
            .attr("r", 5)
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
           // .attr("transform", "rotate(325)")
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
              d.y = Math.max(radius, Math.min(innerHeight - radius, d.y)); 

            return "translate(" + d.x + "," + d.y + ")";
        }


        // build a dictionary of nodes that are linked
        var linkedByIndex = {};
        links.forEach(function(d) {
            linkedByIndex[d.source.index + "," + d.target.index] = 1;
        });

        console.log('linkedByIndex', linkedByIndex);

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
                    //console.log(isConnected(d, o));
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

    }

    function drawLegend(){
        var color = d3.scaleOrdinal() // D3 Version 4
                    .domain(['A', 'B', 'C', 'D', 'E', 'O'])
                    .range(['#1E0576', '#771493' , '#e70033', '#0063be', '#009a3d', '#f7941e']);


        var radius = 6;
        var y = 40;
        var x = 40;
        var spacing = 27;
        var w = 100;
        var h = height;

        var legend = d3
                .select(containerId)
                .append('svg')
                .attr('height', h)
                .attr('width', w)
                .attr('transform', 'translate(' + 5 + ',' + 5 + ')');

        legend.append('text')
                .attr('class', 'legend-title')
                .attr('x', w / 2)
                .attr('y', 20)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'baseline')
                .text('Level')
                .style("font", "16px times");

        var g2 = legend
                .append("g")
                .selectAll("g")
                .data(color.domain())
                .enter()
                .append('g')
                .attr('class', 'dots');

            g2.append('circle')
              //    .attr('class', 'legend-nodes')
                  .attr('r', radius)
                  .attr('cx', x)
                  .attr('cy', function(d, i){
                    return i * spacing + y;
                    })
                  .style('fill', color)
                  .style('stroke', color)
                  .attr('fill-opacity', 1);

            g2.append('text')
             //   .attr('class', 'legend-text')
                .attr('x', x + 20)
                .attr('y', function(d, i){
                    return i * spacing + y + radius/2;
                    })
                .text(function(d) { return d; });
    }

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
        startYear2 = dm2(data);
        console.log('summarized data2', startYear2);

        position = dmPosition(data);
        console.log('Position', position);
        
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

        //Years missing because there's no one left :(
        startYear.push({key:1979, value:0},
                       {key:1981, value:0},
                       {key:1983, value:0},
                       {key:1985, value:0},
                       {key:1986, value:0},
                       {key:1987, value:0})

        startYear.sort(function(x, y){
            return d3.ascending(x.key, y.key);
        });

        return startYear;
    }

    function dm2(data){
        //Add variable to summarize
        var startYear = d3.nest()
            .key(function(d) { return d.title; })
            .key(function(d) { return d.start_year; })
            .rollup(function(v) { return v.length; })
            .entries(data);

        // startYear.forEach(function(d){
        //    // d.key = +d.key;
        // })

        //Years missing because there's no one left :(
        // startYear.push({key:1979, value:0},
        //                {key:1981, value:0},
        //                {key:1983, value:0},
        //                {key:1985, value:0},
        //                {key:1986, value:0},
        //                {key:1987, value:0})

        // startYear.sort(function(x, y){
        //     return d3.ascending(x.key, y.key);
        // });

        return startYear;
    }

    function dmPosition(data){
        var position = d3.nest()
          .key(function(d) { return d.title; })
          .rollup(function(v) { return v.length; })
          .entries(data);

        position.sort(function(x, y){
            return d3.descending(x.value, y.value);
        });

        return position;
    }

    function drawBar(data){
        var width = 1200;
        var height = 450;

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

        var x = d3
            .scaleBand()
            .domain(
                data.map(function(d) {
                    return d.key;
                })
            )
            .range([0, innerWidth])
            .padding(0.1);

        var y = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(data, function(d) {
                    return d.value;
                })
            ])
            .range([innerHeight, 0]);


        var xAxis = d3.axisBottom(x);

        g
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + innerHeight + ')')
            .call(xAxis);

        var yAxis = d3.axisLeft(y).ticks(12);

        g
            .append('g')
            .attr('class', 'y-axis')
            .call(yAxis);

          // X-axis Label
        g
            .append('text')
            .attr('class', 'x-axis-label')
            .attr('x', innerWidth / 2)
            .attr('y', innerHeight + 30)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'hanging')
            .text('Start Year')
            .style("font", "18px Arial");

        //Y-axis Label
        g
            .append('text')
            .attr('class', 'y-axis-label')
            .attr('x', 0)
            .attr('y', innerHeight / 2 - 20)
            .attr('transform', 'rotate(-90,-30,' + innerHeight / 2  + ')')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .text('Count')
            .style("font", "18px Arial");

        // title
        // g
        //     .append('text')
        //     .attr('class', 'title')
        //     .attr('x', innerWidth / 2)
        //     .attr('y', -20)
        //     .attr('text-anchor', 'middle')
        //     .attr('dominant-baseline', 'baseline')
        //     .style("font", "24px Arial")
        //     .text('Mathematica Employees by Start Year');

        g
            .selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', function(d) {
                return x(d.key);
            })
            .attr('y', function(d) {
                return y(d.value);
            })
            .attr('width', x.bandwidth())
            .attr('height', function(d) {
                return innerHeight - y(d.value);
            })
            .attr('fill', d3.rgb(233, 28, 44))
            .attr('stroke', 'none');

        }


}

buildBar('#bar');

buildGraph('#network');
