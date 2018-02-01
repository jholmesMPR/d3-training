
function computations(containerId) {

// read in our data
    d3.json('data/cars.json', function(error, data) {
        // handle read errors
        if (error) {
            console.error('failed to read data');
            return;
        }

        console.log('raw', data);

        //A
        data.forEach(function(d) {
            d.make_is_common = +d.make_is_common; 
        });

       console.log('clean', data);

       var sum_common_make = 
       data.reduce(
           function(s, d) {
           return s + d.make_is_common;
       }, 0);

        console.log(sum_common_make);

        //B
 
      var makes_per_country = d3.nest()
        .key(function(d) { return d.make_country; })
        .rollup(function(v) { return v.length; })
        .entries(data);
        console.log(JSON.stringify(makes_per_country));

        //C

    var makes_per_country_make = d3.nest()
      .key(function(d) { return d.make_country; })
      .key(function(d) { return d.make_is_common; })
      .rollup(function(v) { return v.length; })
      .object(data);
      console.log(JSON.stringify(makes_per_country_make));

    });

}

computations('#cars')