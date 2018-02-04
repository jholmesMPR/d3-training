
function buildChart(containerId) {
    
    // size globals
    var width = 2000;
    var height = 2000;

    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 60
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
            d.century = +d.year.substring(0, 2);
            d.decade = +d.year.substring(2, 3);
            if(d.century == 18) {
                if(d.decade == 8) {
                    d.decade = -2
                }
                if(d.decade == 9){
                    d.decade = -1
                }
            if(d.century == 20){
                if(d.decade == 0)
                    d.decade = 10
                }
                if(d.decade == 1)
                    d.decade = 11
            }
        });

        console.log('clean', data);

       // barOuterPad = .2;
      //  barPad = .1;

        // scales
        var y = d3  //y is the y-scale
            .scaleBand() //used to map categorical variables
            .domain(
                data.map(function(d) {
                    return d.year;
                })
            )
            .range([innerHeight, 0])
            .padding(0.01);

         var x = d3  //x is the x-scale
            .scaleLinear()
            .domain([
                d3.min(data, function(d) {
                    return d.temp;
                }),
                d3.max(data, function(d) {
                    return d.temp;
                })
            ])
            .range([0, innerWidth]);
            //.padding(0.1);

        var color = d3.scaleOrdinal(d3.schemeCategory20);

        // axes
        var xAxis = d3.axisTop(x); //changes if the ticks are on the top or botton of the x-axis

        g
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(,' + height + innerHeight + ')')
            .call(xAxis);


        var yAxis = d3.axisLeft(y); //changes if the ticks are to the left or to the right of the y-axis

        g
            .append('g')
            .attr('class', 'y-axis')
            .call(yAxis);

        // bars
        //var colorScale = d3.scale.category10();

        g
            .selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', function(d) { return x(Math.min(0, d.temp)); })
            .attr('y', function(d) {
                return y(d.year) ;
            })
            .attr('fill', function(d, i) { return color(d.decade) })
            .attr('height', 5)
            .attr('width', function(d) {
                return Math.abs(x(d.temp) - x(0)); 
             });

        
       // axis labels
        // g
        //     .append('text')
        //     .attr('class', 'x-axis-label')
        //     .attr('x', innerWidth / 2)
        //     .attr('y', innerHeight + 15)
        //     .attr('text-anchor', 'middle')
        //     .attr('dominant-baseline', 'hanging')
        //     .text('Temperature Change')
        //     .style("font", "20px times");


        g
            .append('text')
            .attr('class', 'y-axis-label')
            .attr('x', 0)
            .attr('y', innerHeight / 2 - 10)
            .attr('transform', 'rotate(-90,-30,' + innerHeight / 2 + ')')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .text('Year')
            .style("font", "24px times");

        // title
        g
            .append('text')
            .attr('class', 'title')
            .attr('x', innerWidth / 2)
            .attr('y', -30)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .text('Average Temperature Change from 1880 - 2016 (Celcius)')
            .style("font", "24px times");


    //color bars

    });

}

buildChart('#bar-chart')