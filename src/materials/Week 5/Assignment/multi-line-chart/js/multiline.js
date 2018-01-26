
function buildChart(containerId) {
  // size globals
    var width = 1000;
    var height = 750;

    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 100
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

        var yAxis = d3.axisLeft(y).ticks(10);

        g
            .append('g')
            .attr('class', 'y-axis')
            .call(yAxis);

        // axis labels
        g
            .append('text')
            .attr('class', 'x-axis-label')
            .attr('x', innerWidth / 2)
            .attr('y', innerHeight + 35)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'hanging')
            .text('Year')
            .style("font", "16px times");

        g
            .append('text')
            .attr('class', 'y-axis-label')
            .attr('x', 0)
            .attr('y', innerHeight / 2 - 50)
            .attr('transform', 'rotate(-90,-30,' + innerHeight / 2 + ')')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .text('Population')
            .style("font", "16px times");

        // title
        g
            .append('text')
            .attr('class', 'title')
            .attr('x', innerWidth / 2 )
            .attr('y', 0)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .text('Comparing the populations of China and India 1960 - 2017')
            .style("font", "20px times");
    });

}

buildChart('#multi-line')