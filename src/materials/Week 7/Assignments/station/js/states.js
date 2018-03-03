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

    // create inner group elem
    var g = svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // append all of your chart elements to g

// read in our data
    d3.json('data/us-states.json', function(error, geojson) {
        if (error) {
            console.error('failed to read data');
            return;
        }
        console.log('raw_geojson', geojson);

        d3.csv('data/NSRDB_StationsMeta.csv', function(error, stations){
            if (error) {
                console.error('failed to read data');
                return;
            }
            console.log('raw_stations', stations);

        clean_stations = dm(stations);
        console.log('clean_stations', clean_stations);
        draw(geojson, clean_stations);
        //addLegend();

        });

    });

     function dm(stations){

        stations.forEach(function(d){
            d.latitude = (+d.latitude);
            d.longitude = (+d.longitude);
            d.elevation = +d['NSRDB_ELEV (m)'];
            if(d.elevation <= 0){
                return d.elevation = 1;
            }
        })
        return stations;
    }


    function draw(geojson, stations) {

        var color = d3
            .scaleOrdinal(d3.schemeCategory20);

        var logElevation = d3
            .scaleLog()
            .domain(
              stations.map(function(d) {
                return d.elevation;
              })
            )
            .range([9, 8,7,6, 5, 4, 3, 2]);

        var Proj = d3
            .geoAlbersUsa()
            .translate([innerWidth / 2, innerHeight / 2]);

        var geoPath = d3
            .geoPath()
            .projection(Proj);

            console.log(d3.extent(stations, function(d) {
                    return d.elevation;
                }));

        //   //longitude, latitude   
        // var aa = [-177.383, 28.2];
        // var bb = [-122.389809, 37.72728];

        // //aa returns null, but bb does not
        // console.log('Proj_2_pix', Proj(aa), Proj(bb));
        // console.log('null', Proj(aa) !== null);

        // var new1 = []
        // stations.forEach(function(d){
        //     new1.push([d.longitude, d.latitude]);
        // });
        // console.log('new1', new1);
        // console.log('Proj_test0', Proj(new1[0]));


        // states
        g.selectAll("path")
          .data(geojson.features)
          .enter()
          .append("path")
          .attr("d", geoPath)
          .attr("class", "feature")
          .style("fill", "black")
          .style('stroke', 'white')
          .style('stroke-width', 0.5);

         g.selectAll("circle")
            .data(stations)
            .enter()
            .filter(function(d){
             return Proj([d.longitude, d.latitude]) !== null;
            })
            .append("circle")
            .attr("cx", function (d) { return Proj([d.longitude, d.latitude])[0]; })
            .attr("cy", function (d) { return Proj([d.longitude, d.latitude])[1]; })
            .attr("r", function(d){console.log(logElevation(d.elevation)); return logElevation(d.elevation); })
            .attr('fill', function(d) { return color(d.CLASS); });

        //console.log(logElevation(elevation[0]));
          // title
        g
            .append('text')
            .attr('class', 'title')
            .attr('x', innerWidth / 2)
            .attr('y', -30)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .text('NSRDB Stations in the US')
            .style("font", "24px times");


        //Legend 1
        var radius1 = 10;
        var y1 = 40;
        var x1 = 40;
        var spacing1 = 27;
        var w1 = 100;
        var h1 = 500;

        var legend1 = d3
                .select(containerId)
                .append('svg')
                .attr('height', h1)
                .attr('width', w1)
                .attr('transform', 'translate(' + 5 + ',' + 5 + ')');

        legend1.append('text')
                .attr('class', 'title')
                .attr('x', w1 / 2)
                .attr('y', 20)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'baseline')
                .text('Class')
                .style("font", "16px times");

        var g2 = legend1
                .append("g")
                .selectAll("g")
                .data(color.domain())
                .enter()
                .append('g')
                .attr('class', 'dots');

            g2.append('circle')
                  .attr('r', radius1)
                  .attr('cx', x1)
                  .attr('cy', function(d, i){
                    return i * spacing1 + y1;
                    })
                  .style('fill', color)
                  .style('stroke', color);

            g2.append('text')
                .attr('x', x1 + 20)
                .attr('y', function(d, i){
                    return i * spacing1 + y1 + radius1/2;
                    })
                .text(function(d) { return d; });


        //Legend 2
        var radius2 = 10;
        var y2 = 40;
        var x2 = 40;
        var spacing2 = 27;
        var w2 = 100;
        var h2 = 500;

        var legend2 = d3
                .select(containerId)
                .append('svg')
                .attr('height', h2)
                .attr('width', w2)
                .attr('transform', 'translate(' + 5 + ',' + 5 + ')');

        legend2.append('text')
                .attr('class', 'title')
                .attr('x', w2 / 2)
                .attr('y', 20)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'baseline')
                .text('Elevation')
                .style("font", "16px times");

        var g2 = legend2
                .append("g")
                .selectAll("g")
                .data(logElevation.domain())
                .enter()
                .append('g')
                .attr('class', 'dots');

            g2.append('circle')
                  .attr('r', logElevation)
                  .attr('cx', x2)
                  .attr('cy', function(d, i){
                    return i * spacing2 + y2;
                    });

            g2.append('text')
                .attr('x', x2 + 20)
                .attr('y', function(d, i){
                    return i * spacing2 + y2 + radius2/2;
                    })
                .text(function(d) { return d; });
        }

  
}

buildChart('#states')