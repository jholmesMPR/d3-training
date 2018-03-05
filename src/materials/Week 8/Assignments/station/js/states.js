function buildChart(containerId) {
  // size globals
    var width = 960;
    var height = 600;

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
              d3.extent(stations, function(d){
                return d.elevation;
              })
            )
            .range([2, 15]); //Will always have a continiuous output range because that's how the scale is set up

        var o = .8;

        stations.forEach(function(d){
          d.logElev = logElevation(d.elevation);
          if(d.logElev >= 2 & d.logElev < 3){
            d.logGroup = 2.5;
          }
          if(d.logElev >= 3 & d.logElev < 4){
            d.logGroup = 3.5;
          }
          if(d.logElev >= 4 & d.logElev < 5){
            d.logGroup = 4.5;
          }
          if(d.logElev >= 5 & d.logElev < 6){
            d.logGroup = 5.5;
          }
          if(d.logElev >= 6 & d.logElev < 7){
            d.logGroup = 6.5;
          }
          if(d.logElev >= 7 & d.logElev < 8){
            d.logGroup = 7.5;
          }
          if(d.logElev >= 8 & d.logElev < 9){
            d.logGroup = 8.5;
          }
          if(d.logElev >= 9 & d.logElev < 10){
            d.logGroup = 9.5;
          }
          if(d.logElev >= 10 & d.logElev < 11){
            d.logGroup = 10.5;
          }
          if(d.logElev >= 11 & d.logElev < 12){
            d.logGroup = 11.5;
          }
          if(d.logElev >= 12 & d.logElev < 13){
            d.logGroup = 12.5;
          }
          if(d.logElev >= 13 & d.logElev < 14){
            d.logGroup = 13.5;
          }
          if(d.logElev >= 14 & d.logElev <= 15){
            d.logGroup = 14.5;
          }
        });

        var f = d3.format(".1f");

        var elevation = d3.nest()
            .key(function(d) { return d.logGroup; })
            .rollup(function(v) { 
            return {
                count: v.length,
                min: f(d3.min(v, function(d) { return d.elevation; })),
                max: f(d3.mean(v, function(d) { return d.elevation; }))
              }; 
            })
            .entries(stations);

        elevation.forEach(function(d){
            d.value.range = d.value.min.concat(' - ', d.value.max, ' ft.');
            d.key = +d.key;
        });

        elevation.sort(function(x, y){
            return d3.ascending(x.key, y.key);
        });

        console.log('Elevation', elevation);

        var Proj = d3
            .geoAlbersUsa()
            .translate([innerWidth / 2, innerHeight / 2]);

        var geoPath = d3
            .geoPath()
            .projection(Proj);

            // console.log(d3.extent(stations, function(d) {
            //         return d.elevation;
            //     }));

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
            .attr("r", function(d){ return d.logElev; })
            .attr('fill', function(d) { return color(d.CLASS); })
            .attr('fill-opacity', o);

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
        var h1 = height;

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
                  .style('stroke', color)
                  .attr('fill-opacity', o);

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
        var spacing2 = 30;
        var w2 = 160;
        var h2 = height;

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
                .data(elevation)
                .enter()
                .append('g')
                .attr('class', 'dots');

            g2.append('circle')
                  .attr('r', function(d){ return d.key;})
                  .attr('cx', x2)
                  .attr('cy', function(d, i){
                    return i * spacing2 + y2;
                    })
                  .attr('fill-opacity', o);

            g2.append('text')
                .attr('x', x2 + 20)
                .attr('y', function(d, i){
                    return i * spacing2 + y2 + radius2/2;
                    })
                .text(function(d) { return d.value.range; });
        }
}

buildChart('#states')