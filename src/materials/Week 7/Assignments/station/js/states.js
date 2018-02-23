
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
    d3.json('data/us-states.json', function(error, usstates) {
        if (error) {
            console.error('failed to read data');
            return;
        }
        console.log('raw_states', usstates);

        d3.csv('data/NSRDB_StationsMeta.csv', function(error, stations){
            if (error) {
                console.error('failed to read data');
                return;
            }
            console.log('raw_stations', stations);

            draw(geojson, countries, cities);
        });

    });

   function draw(geojson, countries, cities) {
        // geojson.features.forEach(function(f) {
        //     var pop = countries[f.properties.name];
        //     if (pop) {
        //         f.properties.pop = pop;
        //     }
        // });

        var opacityScale = d3
            .scaleLinear()
            .domain([0, 1.5e9])
            .range([0, 1]);

        var Proj = d3
            .geoAlbersUsa()
            .scale(130)
            .center([0, 30])
            .translate([innerWidth / 2, innerHeight / 2]);

        var geoPath = d3.geoPath().projection(Proj);

        // g
        //     .selectAll('path')
        //     .data(geojson.features)
        //     .enter()
        //     .append('path')
        //     .attr('d', geoPath)
        //     .style('fill', function(d) {
        //         if (d.properties.pop) {
        //             return 'red';
        //         } else {
        //             return 'grey';
        //         }
        //     })
        //     .style('stroke', 'black')
        //     .style('stroke-width', 0.5)
        //     .attr('fill-opacity', function(d) {
        //         if (d.properties.pop) {
        //             return opacityScale(d.properties.pop);
        //         } else {
        //             return 1;
        //         }
        //     });

        // g
        //     .selectAll('circle')
        //     .data(cities)
        //     .enter()
        //     .append('circle')
        //     .attr('cx', function(d) {
        //         return mercatorProj(d.loc)[0];
        //     })
        //     .attr('cy', function(d) {
        //         return mercatorProj(d.loc)[1];
        //     })
        //     .attr('r', 1.5)
        //     .attr('fill', 'black')
        //     .attr('stroke', 'none');
    }
}

buildChart('#states')