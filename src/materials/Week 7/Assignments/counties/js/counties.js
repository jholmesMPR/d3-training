
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

    d3.csv('data/laucnty12.csv', function(error, cnty12) {
        if (error) {
            console.error('failed to read data');
            return;
        }
        console.log('county12', cnty12);

        d3.csv('data/laucnty13.csv', function(error, cnty13) {
            if (error) {
                console.error('failed to read data');
                return;
            }
            console.log('county13', cnty13);

            d3.csv('data/laucnty14.csv', function(error, cnty14) {
                if (error) {
                    console.error('failed to read data');
                    return;
                }
                console.log('county14', cnty14);

                d3.csv('data/laucnty15.csv', function(error, cnty15) {
                    if (error) {
                        console.error('failed to read data');
                        return;
                    }
                    console.log('county15', cnty15);

                    d3.csv('data/laucnty16.csv', function(error, cnty16) {
                        if (error) {
                            console.error('failed to read data');
                            return;
                        }
                        console.log('county16', cnty16);


                        d3.json('data/us-counties.json', function(error, geojson) {
                            if (error) {
                                console.error('failed to read data');
                                return;
                            }
                            console.log('geojson', geojson);

                            data = dm(cnty12, cnty13, cnty14, cnty15, cnty16, geojson);
                            console.log('data', data);

                            chloro(data);
                           
                        });
                    });
                });
            });
        });
    });

    //function dm performs necessary data management steps for the data
    function dm(cnty12, cnty13, cnty14, cnty15, cnty16, geojson){

        //Appends data together
        cntys = cnty12.concat(cnty13, cnty14, cnty15, cnty16);

        //Create New Variables
        cntys.forEach(function(d){
            d.id = +d.StateCode.concat(d.CountyCode);
            d.pctUE = +d.Percent;
        });
        //console.log('counties', cntys);

        var o = [];
        geojson.features.forEach(function(v) {
          cntys.forEach(function(w) {
            if (v.id === w.id) {
              o.push([v, w]);
            }
          });
        });

        //console.log('merge', o);
    }

    // function chloro(cnty, geojson){
            
    //     var color = d3.scaleThreshold()
    //         .domain(d3.extent(cnty, function(d) {
    //                 return d.pctUE;
    //             });
    //         )
    //         .range(d3.schemeBlues[9]);

    //     var path = d3.geoPath();

        
    //     g.append("g")
    //       .attr("class", "counties")
    //      .selectAll("path")
    //      .data(geojson.features)
    //      .enter()
    //      .append("path")
    //      // .attr("fill", function(d) { return color(d.rate = unemployment.get(d.id)); })
    //       .attr("d", path)
    //     .append("title")
    //     .text("Title");
    //      // .text(function(d) { return d.rate + "%"; });

    //   // svg.append("path")
    //   //     .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
    //   //     .attr("class", "states")
    //   //     .attr("d", path);

    // }

    
}

buildChart('#counties')