
function buildChart(containerId) {
  // size globals
    var width = 960;
    var height = 500;

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
    d3.json('data/climate.json', function(error, data) {
        // handle read errors
        if (error) {
            console.error('failed to read data');
            return;
        }

        console.log('raw', data);


        // coerce data to numeric
        data.forEach(function(d) {
            d.temp = +d.temp; //temp is a variable in the data 'climate'
        });

        // coerce data to numeric
                var parseTime = d3.timeParse('%Y');

                data.forEach(function(d) {
                    d.W = +d.W;
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
                0,
                d3.max(data, function(d) {
                    return d.W;
                }) + 5
            ])
            .range([innerHeight, 0]);

        console.log(y.domain(), y.range());

    });

}

buildChart('#line-chart')