function buildChart(containerId) {

    var years = ['2012', '2013', '2014', '2015', '2016'];


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

                            cntys = dm1(cnty12, cnty13, cnty14, cnty15, cnty16);
                            console.log('Counties', cntys);

                            years.forEach(function(d, i){

                                var YEAR = years[i];

                                console.log('YEAR', YEAR);

                                geojson2 = dm2(cntys, geojson, YEAR);
                                console.log('geojson', geojson2);

                                chloro(geojson2, YEAR);

                            });
                        });
                    });
                });
            });
        });
    });


    function dm1(cnty12, cnty13, cnty14, cnty15, cnty16){
        //Appends data together
        cntys = cnty12.concat(cnty13, cnty14, cnty15, cnty16);

        //Create New Variables
        cntys.forEach(function(d){
            d.id = +d.StateCode.concat(d.CountyCode);
            d.pctUE = +d.Percent;
        });

        return cntys;
    }

    function dm2(cntys, geojson, YEAR){
        subset = cntys.filter(function(e){
                    return e.Year == YEAR;
                });

        console.log('subset', subset);

        geojson.features.forEach(function(f) {
            subset.forEach(function(d) {

                if((f.id == d.id)){
                    unem = d.pctUE;
                    if (unem) {
                        f.properties.unem = unem;
                    }
                }
            });
        });

        return geojson;
    }

    function chloro(geojson, YEAR){

        var width = 850;
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

        var g = svg
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


        var Proj = d3
            .geoAlbersUsa()
            .translate([innerWidth / 2, innerHeight / 2]);

        var geoPath = d3
            .geoPath()
            .projection(Proj);

        var colors = ["#f7fbff",  "#deebf7",  "#c6dbef",  "#9ecae1",  "#6baed6",  "#4292c6",  "#2171b5",  "#08519c",  "#08306b"];

        var colorize = d3.scaleThreshold()
            .domain([2, 3, 4, 5, 6, 7, 8, 9, 10])
            .range(colors);


        var x = d3.scaleLinear()
            .domain([1, 10])
            .rangeRound([600, 860]);

        g.selectAll("path")
          .data(geojson.features)
          .enter()
          .append("path")
          .attr("d", geoPath)
          .attr("class", "feature")
          .style("fill", "black")
          .style('stroke', 'white')
          .style('stroke-width', 0.5);


        g.append("g")
            .attr("class", "counties")
            .selectAll("path")
            .data(geojson.features)
            .enter().append("path")
            // .filter(function(d){
            //     return d.properties.year == '2015';
            // })
              .attr("fill", function(d) { return colorize(d.properties.unem); })
              .attr("d", geoPath);
          
         g
            .append('text')
            .attr('class', 'title')
            .attr('x', innerWidth / 2)
            .attr('y', -30)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .text(YEAR.concat(' Unemployement Rates'))
            .style("font", "24px times");

        if(YEAR == "2014"){
            g.selectAll("rect")
              .data(colorize.range().map(function(d) {
                  d = colorize.invertExtent(d);
                  if (d[0] == null) d[0] = x.domain()[0];
                  if (d[1] == null) d[1] = x.domain()[1];
                  return d;
                }))
              .enter().append("rect")
                .attr("height", 8)
                .attr("x", function(d) { return x(d[0]); })
                .attr("width", function(d) { return x(d[1]) - x(d[0]); })
                .attr("fill", function(d) { return colorize(d[0]); });

            g.append("text")
                .attr("class", "caption")
                .attr("x", x.range()[0])
                .attr("y", -6)
                .attr("fill", "#000")
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text("Unemployment rate");

            g.call(d3.axisBottom(x)
                .tickSize(13)
                .tickFormat(function(x, i) { return i ? x : x + "%"; })
                .tickValues(colorize.domain()))
              .select(".domain")
                .remove();

            // var y1 = 40;
            // var x1 = 40;
            // var spacing1 = 27;
            // var w1 = 100;
            // var h1 = height;

            // var legend1 = d3
            //         .select(containerId)
            //         .append('svg')
            //         .attr('height', h1)
            //         .attr('width', w1)
            //         .attr('transform', 'translate(' + 5 + ',' + 5 + ')');

            // legend1.append('text')
            //         .attr('class', 'title')
            //         .attr('x', w1 / 2)
            //         .attr('y', 20)
            //         .attr('text-anchor', 'middle')
            //         .attr('dominant-baseline', 'baseline')
            //         .text('Class')
            //         .style("font", "16px times");

            // var g2 = legend1
            //         .append("g")
            //         .selectAll("g")
            //         .data(color.domain())
            //         .enter()
            //         .append('g')
            //         .attr('class', 'dots');

            //     g2.append('rect')
            //           .attr('x', x1)
            //           .attr('y', function(d, i){
            //             return i * spacing1 + y1;
            //             })
            //           .style('fill', color)
            //           .style('stroke', color)
            //           .attr('fill-opacity', o);

            //     g2.append('text')
            //         .attr('x', x1 + 20)
            //         .attr('y', function(d, i){
            //             return i * spacing1 + y1 + radius1/2;
            //             })
            //         .text(function(d) { return d; });
            }

    }

}

// function buildChart(containerId, YEAR) {
//     // size globals
//     var width = 850;
//     var height = 500;

//     var margin = {
//         top: 50,
//         right: 50,
//         bottom: 50,
//         left: 50
//     };

//     // calculate dimensions without margins
//     var innerWidth = width - margin.left - margin.right;
//     var innerHeight = height - margin.top - margin.bottom;

//     // create svg element
//     var svg = d3
//         .select(containerId)
//         .append('svg')
//         .attr('height', height)
//         .attr('width', width);

//     // create inner group element
//     var g = svg
//         .append('g')
//         .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// 	// append all of your chart elements to g

//     d3.csv('data/laucnty12.csv', function(error, cnty12) {
//         if (error) {
//             console.error('failed to read data');
//             return;
//         }
//         //console.log('county12', cnty12);

//         d3.csv('data/laucnty13.csv', function(error, cnty13) {
//             if (error) {
//                 console.error('failed to read data');
//                 return;
//             }
//             //console.log('county13', cnty13);

//             d3.csv('data/laucnty14.csv', function(error, cnty14) {
//                 if (error) {
//                     console.error('failed to read data');
//                     return;
//                 }
//                 //console.log('county14', cnty14);

//                 d3.csv('data/laucnty15.csv', function(error, cnty15) {
//                     if (error) {
//                         console.error('failed to read data');
//                         return;
//                     }
//                     //console.log('county15', cnty15);

//                     d3.csv('data/laucnty16.csv', function(error, cnty16) {
//                         if (error) {
//                             console.error('failed to read data');
//                             return;
//                         }
//                         //console.log('county16', cnty16);


//                         d3.json('data/us-counties.json', function(error, geojson) {
//                             if (error) {
//                                 console.error('failed to read data');
//                                 return;
//                             }
//                             //console.log('geojson', geojson);

//                             data = dm(cnty12, cnty13, cnty14, cnty15, cnty16, geojson);
//                             console.log('data', data);

//                             chloro(geojson);
                           
//                         });
//                     });
//                 });
//             });
//         });
//     });

//     //function dm performs necessary data management steps for the data
//     function dm(cnty12, cnty13, cnty14, cnty15, cnty16, geojson){

//         //Appends data together
//         cntys = cnty12.concat(cnty13, cnty14, cnty15, cnty16);

//         //Create New Variables
//         cntys.forEach(function(d){
//             d.id = +d.StateCode.concat(d.CountyCode);
//             d.pctUE = +d.Percent;
//         });
//         console.log('counties', cntys);

//         geojson.features.forEach(function(f) {
//             cntys.forEach(function(d){
//                 if(f.id == d.id){
//                     unem = d.pctUE;
//                     year = YEAR;
//                     if (unem) {
//                         f.properties.unem = unem;
//                         f.properties.year = year;
//                     }
//                 }
//             });
//         });

//         console.log('geojson', geojson);
//     }

//     function chloro(geojson){

//         var Proj = d3
//             .geoAlbersUsa()
//             .translate([innerWidth / 2, innerHeight / 2]);

//         var geoPath = d3
//             .geoPath()
//             .projection(Proj);

//         var colors = ["#f7fbff",  "#deebf7",  "#c6dbef",  "#9ecae1",  "#6baed6",  "#4292c6",  "#2171b5",  "#08519c",  "#08306b"];

//         var colorize = d3.scaleThreshold()
//             .domain([2,3, 4, 5, 6, 7, 8, 9, 10])
//             .range(colors);

//         //console.log(colorize.range());

//         //var colorize = d3.scaleOrdinal(d3.schemeBlues[9]);


//         g.selectAll("path")
//           .data(geojson.features)
//           .enter()
//           .append("path")
//           .attr("d", geoPath)
//           .attr("class", "feature")
//           .style("fill", "black")
//           .style('stroke', 'white')
//           .style('stroke-width', 0.5);

//         // g.append("path")
//         //   .datum(geojson.features)
//         //   .attr("class", "states")
//         //   .attr("d", geoPath);


//         g.append("g")
//             .attr("class", "counties")
//             .selectAll("path")
//             .data(geojson.features)
//             .enter().append("path")
//             // .filter(function(d){
//             //     return d.properties.year == '2015';
//             // })
//               .attr("fill", function(d) { return colorize(d.properties.unem); })
//               .attr("d", geoPath)
//             //.append("title")
//              // .text(function(d) { return d.rate + "%"; })
//         ;
//     }
   
// }

buildChart('#counties')