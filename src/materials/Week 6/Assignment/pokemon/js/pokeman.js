
function buildChart(containerId) {
  // set the dimensions and margins of the graph
var margin = {
    top: 50, 
    right: 50, 
    bottom: 50, 
    left: 45}

var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

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
    d3.json('data/pokemon.json', function(error, data) {
        // handle read errors
        if (error) {
            console.error('failed to read data');
            return;
        }
       // console.log('raw', data);

     //A
        data.forEach(function(d){
            d.height_n = d.height.replace(/ m/, '');
            d.weight_n = d.weight.replace(/ kg/,'');
            d.egg_n = d.egg.replace(/ km/,'');
            d.height_n = Number(d.height_n)*3.28084;
            d.weight_n = Number(d.weight_n)*2.20462;
            d.egg_n = Number(d.egg_n)*2.20462;

        })

        console.log('clean', data);

        var average_hw = d3.nest()
          .key(function(d) { return d.name; })
          .rollup(function(v) { return {
            avg_height: d3.mean(v, function(d) { return d.height_n; }),
            avg_weight: d3.mean(v, function(d) { return d.weight_n; })
          }; })
          .entries(data);
        console.log(JSON.stringify(average_hw));
    //B

    data.forEach(function(d){
        if(d.weaknesses.includes("Psychic"))
          {d.Psychic = 1}
        else{
          d.Psychic = 0
        }
    })

    var egg_value = d3.nest()
          .rollup(function(v) { return {
            egg_sum: d3.sum(v, function(d) { 
                if(d.Psychic == 1){

                if (isNaN(d.egg_n)) {
                    return d.egg_n = -1;
                }else{
                    return d.egg_n; }
                  }

                })
              }; 
            })
              .entries(data);
    console.log(JSON.stringify(egg_value));

    //C
 
    var lookup = {};
    var result = [];

    //create list of unique types
    data.forEach(function(d){
      var subset = d.type;
      for (i = 0; i < subset.length; i++) { 
        var t = subset[i];
        if (!(t in lookup)) {
          lookup[t] = 1;
          result.push(t);
        }}
    }); 


    // data.forEach(function(d){
    //   d.num_weakness = d.weaknesses.length; //create var for # of weaknesses
    //     })
  
    console.log('unique types:', lookup)

    //D
      //Look at distributions
        var weight_stats = d3.nest()
          .rollup(function(v) { return {
            min_weight: d3.min(v, function(d) { return d.weight_n; }),
            max_weight: d3.max(v, function(d) { return d.weight_n; }),
            avg_weight: d3.mean(v, function(d) { return d.weight_n; }),
            p0: d3.quantile(v.map(function(d) { return d.weight_n;}).sort(d3.ascending),0),
            p25: d3.quantile(v.map(function(d) { return d.weight_n;}).sort(d3.ascending),.25),
            p50: d3.quantile(v.map(function(d) { return d.weight_n;}).sort(d3.ascending),.5),
            p75: d3.quantile(v.map(function(d) { return d.weight_n;}).sort(d3.ascending),.75),
            p100: d3.quantile(v.map(function(d) { return d.weight_n;}).sort(d3.ascending),100)
         
          }; })
          .entries(data);
        console.log(JSON.stringify(weight_stats));

      //Create Quantile Scale 
        var quantile_scale = d3
          .scaleQuantile()
          .domain(
            data.map(function(d) {
              return d.weight_n;
            })
          )
          .range(["1","2","3","4","5"]);

        //Apply quantile and other data management steps
        data.forEach(function(d){
            d.spawn_time_min = +d.spawn_time.substring(3,5);
            d.spawn_time_hour = +d.spawn_time.substring(0,2);
            d.spawn_time_total = d.spawn_time_hour*60 + d.spawn_time_min;
            d.quantile_group = quantile_scale(d.weight_n);
          })
     
        //Summarize Data 
        var avg_span = d3.nest()
          .key(function(d) { return d.quantile_group; })
          .rollup(function(v) { return {
              mean_time: d3.mean(v, function(d) { return d.spawn_time_total; })
            };
          })
          .entries(data);
          console.log(JSON.stringify(avg_span));
   });

}
buildChart('#pokemon')