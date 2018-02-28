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
        })

        return stations;
    }


    function draw(geojson, stations) {

        var Proj = d3
            .geoAlbersUsa()
            .translate([innerWidth / 2, innerHeight / 2]);

        var geoPath = d3
            .geoPath()
            .projection(Proj);

          //longitude, latitude   
        var aa = [-177.383, 28.2];
        var bb = [-122.389809, 37.72728];

        //aa returns null, but bb does not
        console.log('Proj_2_pix', Proj(aa), Proj(bb));
        console.log('null', Proj(aa) !== null);

        var new1 = []

        stations.forEach(function(d){
            new1.push([d.longitude, d.latitude]);
        });


        console.log('new1', new1);
        console.log('Proj_test0', Proj(new1[0]));


        // states
        g.selectAll("path")
          .data(geojson.features).enter()
          .append("path")
          .attr("d", geoPath)
          .attr("class", "feature")
          .style("fill", "black")
          .style('stroke', 'white')
          .style('stroke-width', 0.5);

         g.selectAll("circle")
            .data(stations).enter()
            .filter(function(d){
             return Proj([d.longitude, d.latitude]) !== null;
            })
            .append("circle")
            .attr("cx", function (d) { return Proj([d.longitude, d.latitude])[0]; })
            .attr("cy", function (d) { return Proj([d.longitude, d.latitude])[1]; })
            .attr("r", "3px")
            .attr("fill", "red")

    }


    
}

buildChart('#states')