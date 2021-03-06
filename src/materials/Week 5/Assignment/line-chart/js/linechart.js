
function buildChart(containerId) {
  // size globals
    var width = 1500;
    var height = 750;

    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 75
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
    d3.json('data/climate.json', function(error, data) {
        // handle read errors
        if (error) {
            console.error('failed to read data');
            return;
        }

        console.log('raw', data);


        // coerce data to numeric
        data.forEach(function(d) {
            d.temp = +d.temp; 
        });

        //coerce data to numeric
        var parseTime = d3.timeParse('%Y');

        data.forEach(function(d) {
            d.yearID = +d.year;
            d.date = parseTime((+d.yearID).toString());
        });

        console.log('clean', data);

        // scales
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
                d3.min(data, function(d) {
                    return d.temp;
                }),
                d3.max(data, function(d) {
                    return d.temp;
                }) 
            ])
            .range([innerHeight, 0]);

        console.log(y.domain(), y.range());

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

        // axis labels
        g
            .append('text')
            .attr('class', 'x-axis-label')
            .attr('x', innerWidth / 2)
            .attr('y', innerHeight + 30)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'hanging')
            .text('Year')
            .style("font", "16px times");

        g
            .append('text')
            .attr('class', 'y-axis-label')
            .attr('x', 0)
            .attr('y', innerHeight / 2 - 25)
            .attr('transform', 'rotate(-90,-30,' + innerHeight / 2 + ')')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .text('Temperature Change')
            .style("font", "16px times");

        // title
        g
            .append('text')
            .attr('class', 'title')
            .attr('x', innerWidth / 2)
            .attr('y', -15)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .text('Average Temperature Change from 1880 - 2016 (Celcius)')
            .style("font", "20px times");


        // line generator
        var line = d3
            .line()
            .x(function(d) {
                return x(d.date);
            })
            .y(function(d) {
                return y(d.temp);
            });

        g
            .append('path')
            .datum(data)
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', 'red')
            .attr('stroke-width', 1.2)
            .attr('d', line);

        // add points
        g
            .selectAll('.point')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'point')
            .attr('fill', 'red')
            .attr('stroke', 'none')
            .attr('cx', function(d) {
                return x(d.date);
            })
            .attr('cy', function(d) {
                return y(d.temp);
            })
            .attr('r', 3);

    });

}

buildChart('#line-chart')