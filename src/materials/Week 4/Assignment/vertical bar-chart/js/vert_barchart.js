
function buildChart(containerId) {
  // size globals
    var width = 1000;
    var height = 500;

    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 65
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
    d3.csv('data/air_quality.csv', function(error, data) {
        // handle read errors
        if (error) {
            console.error('failed to read data');
            return;
        }

        data.forEach(function(d){
            d.Emissions = Number(String(d.Emissions).replace(/,/, ''));
            if(d.Region == 'West'){
                d.Color = '#3366cc'
            }
            if(d.Region == 'South'){
                d.Color = '#dc3912'
            }
            if(d.Region == 'Northeast'){
                d.Color = '#ff9900'
            }
            if(d.Region == 'Midwest'){
                d.Color = '#109618'
            }
        })

        console.log('raw', data);

        var groups = g
            .selectAll('.states')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'states');


        var x = d3
            .scaleBand()
            .domain(
                data.map(function(d) {
                    return d.State;
                })
            )
            .range([0, innerWidth])
            .padding(0.1);

        console.log(x.domain(), x.range());

        var y = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(data, function(d) {
                    return d.Emissions;
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
            .text('State')
            .style("font", "18px times");

        //Y-axis Label
        g
            .append('text')
            .attr('class', 'y-axis-label')
            .attr('x', 0)
            .attr('y', innerHeight / 2 - 20)
            .attr('transform', 'rotate(-90,-30,' + innerHeight / 2  + ')')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .text('Emissions')
            .style("font", "18px times");

        // title
        g
            .append('text')
            .attr('class', 'title')
            .attr('x', innerWidth / 2)
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .style("font", "24px times")
            .text('Emissions by State');

        
        // bars
        g
            .selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', function(d) {
                return x(d.State);
            })
            .attr('y', function(d) {
                return y(d.Emissions);
            })
            .attr('width', x.bandwidth())
            .attr('height', function(d) {
                return innerHeight - y(d.Emissions);
            })
            .attr('fill', function(d){
                return d.Color;
            })
            .attr('stroke', 'none')
            .attr("ry", 2);

    });

}

buildChart('#vert-bar-chart')