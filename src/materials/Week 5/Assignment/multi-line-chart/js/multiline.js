
function buildChart(containerId) {
  // size globals
    var width = 1000;
    var height = 750;

    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    };

    // calculate dimensions without margins
    var innerWidth = width - margin.left - margin.right;
    var innerHeight = height - margin.top - margin.bottom;

    // create svg element
    var svg = d3
        .select(containerId)
        .append('svg')
        .attr('height', height)
        .attr('width', width);

    // create inner group element
    var g = svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	// append all of your chart elements to g

// read in our data
    d3.json('data/population.json', function(error, data) {
        // handle read errors
        if (error) {
            console.error('failed to read data');
            return;
        }
        console.log('raw', data);

        var parseTime = d3.timeParse('%Y');

        data.forEach(function(d) {
            d.yearN = +d.year.substring(8,12);
            d.date = parseTime((+d.yearN).toString());
    });

    var x = d3
            .scaleTime()
            .domain(
                d3.extent(data, function(d) {
                    return d.date;
                })
            )
            .range([0, innerWidth]);

        console.log(x.domain(), x.range());

        var y = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(data, function(d) {
                    return d.pop;
                }) 
            ])
            .range([innerHeight, 0]);

    // axes
        var xAxis = d3.axisBottom(x).ticks(d3.timeYear.every(1));
   
        g
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + innerHeight + ')')
            .call(xAxis)
          .selectAll("text")    
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-90)");

            //.attr('transform', 'rotate(-90,-30,' + innerHeight / 2 + ')');

        var yAxis = d3.axisLeft(y).ticks(10);

        g
            .append('g')
            .attr('class', 'y-axis')
            .call(yAxis);


    });

}

buildChart('#multi-line')