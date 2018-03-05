
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
        //console.log('county12', cnty12);

        d3.csv('data/laucnty13.csv', function(error, cnty13) {
            if (error) {
                console.error('failed to read data');
                return;
            }
            //console.log('county13', cnty13);

            d3.csv('data/laucnty14.csv', function(error, cnty14) {
                if (error) {
                    console.error('failed to read data');
                    return;
                }
                //console.log('county14', cnty14);

                d3.csv('data/laucnty15.csv', function(error, cnty15) {
                    if (error) {
                        console.error('failed to read data');
                        return;
                    }
                    //console.log('county15', cnty15);

                    d3.csv('data/laucnty16.csv', function(error, cnty16) {
                        if (error) {
                            console.error('failed to read data');
                            return;
                        }
                        //console.log('county16', cnty16);


                        d3.json('data/us-counties.json', function(error, geojson) {
                            if (error) {
                                console.error('failed to read data');
                                return;
                            }
                            //console.log('geojson', geojson);

                            data = dm(cnty12, cnty13, cnty14, cnty15, cnty16, geojson);
                            console.log('data', data);

                            chloro(geojson);
                           
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
        console.log('counties', cntys);

        //return cntys;

        var g = [];
        geojson.features.forEach(function(f) {
            cntys.forEach(function(d){
                if(f.id == d.id){
                    unem = d.pctUE;
                    year = d.Year;
                    if (unem) {
                        f.properties.unem = unem;
                        f.properties.year = year;
                    }
                }
            });
        });

        //console.log('unem', g);

        console.log('geojson', geojson);
    }

    function chloro(geojson){

        var Proj = d3
            .geoAlbersUsa()
            .translate([innerWidth / 2, innerHeight / 2]);

        var geoPath = d3
            .geoPath()
            .projection(Proj);

        var colors = ["#f7fbff",  "#deebf7",  "#c6dbef",  "#9ecae1",  "#6baed6",  "#4292c6",  "#2171b5",  "#08519c",  "#08306b"];

        var colorize = d3.scaleThreshold()
            .domain([2,3, 4, 5, 6, 7, 8, 9, 10])
            .range(colors);

        //console.log(colorize.range());

        //var colorize = d3.scaleOrdinal(d3.schemeBlues[9]);


        g.selectAll("path")
          .data(geojson.features)
          .enter()
          .append("path")
          .attr("d", geoPath)
          .attr("class", "feature")
          .style("fill", "black")
          .style('stroke', 'white')
          .style('stroke-width', 0.5);

        // g.append("path")
        //   .datum(geojson.features)
        //   .attr("class", "states")
        //   .attr("d", geoPath);


        g.append("g")
            .attr("class", "counties")
            .selectAll("path")
            .data(geojson.features)
            .enter().append("path")
            .filter(function(d){
                return d.properties.year == '2015';
            })
              .attr("fill", function(d) { return colorize(d.properties.unem); })
              .attr("d", geoPath)
            //.append("title")
             // .text(function(d) { return d.rate + "%"; })
        ;
    }

    
}

buildChart('#counties')