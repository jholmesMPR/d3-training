
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


        var newdata = data.filter(
                    function (d){
                         return d.pop != null;
            });

        newdata.forEach(function(d) {
            d.yearN = +d.year.substring(8,12);
            d.date = parseTime((+d.yearN).toString());
            d.pop = Number(d.pop)

    });

    console.log('new_clean', newdata);

    var x = d3
            .scaleTime()
            .domain(
                d3.extent(newdata, function(d) {
                    return d.date;
                })
            )
            .range([0, innerWidth]);

        console.log(x.domain(), x.range());

    var y = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(newdata, function(d) {
                    return d.pop;
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
            .attr('x', innerWidth / 2)
            .attr('y', 0 - 10)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .text('Comparing the populations of China and India 1960 - 2017')
            .style("font", "20px times");

        var countries = ['China', 'India'];
        var colors = ['red', 'orange'];

        var colorScale = d3
            .scaleOrdinal()
            .domain(countries)
            .range(colors);

        var groups = g
            .selectAll('.countries')
            .data(countries)
            .enter()
            .append('g')
            .attr('class', 'countries');
        
        var line = d3
            .line()
            .x(function(d) {
                return x(d.date);
            })
            .y(function(d) {
                return y(d.pop);
            });

        groups
            .append('path')
            .datum(function(d) {
                return newdata.filter(function(r) {
                    return r.country === d;
                });
            })
            .attr('class', 'win-line')
            .attr('fill', 'none')
            .attr('stroke', function(d) {
                return colorScale(d[0].country);
            })
            .attr('stroke-width', 1.5)
            .attr('d', line);

         groups
            .selectAll('.point')
            .data(function(d) {
                return newdata.filter(function(r) {
                    return r.country === d;
                });
            })
            .enter()
            .append('circle')
            .attr('class', 'point')
            .attr('fill', function(d) {
                return colorScale(d.country);
            })
            .attr('stroke', 'none')
            .attr('cx', function(d) {
                return x(d.date);
            })
            .attr('cy', function(d) {
                return y(d.pop);
            })
            .attr('r', 3);

    });

}

buildChart('#multi-line')