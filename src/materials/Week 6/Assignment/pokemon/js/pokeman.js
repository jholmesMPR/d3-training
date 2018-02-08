
function buildChart(containerId) {

// read in our data
  d3.json('data/pokemon.json', function(error, data) {
      // handle read errors
      if (error) {
          console.error('failed to read data');
          return;
      }

    // console.log('raw', data);

    //Data Management Steps
    data.forEach(function(d){
        d.height_n = d.height.replace(/ m/, '');
        d.weight_n = d.weight.replace(/ kg/,'');
        d.egg_n = d.egg.replace(/ km/,'');
        d.height_n = Number(d.height_n)*3.28084;
        d.weight_n = Number(d.weight_n)*2.20462;
        d.egg_n = Number(d.egg_n)*2.20462;
        if(d.weaknesses.includes("Psychic")){
          d.Psychic = 1;}
        else{
          d.Psychic = 0; 
        };
        d.spawn_time_min = +d.spawn_time.substring(3,5);
        d.spawn_time_hour = +d.spawn_time.substring(0,2);
        d.spawn_time_total = d.spawn_time_hour*60 + d.spawn_time_min;
    })

    //console.log('clean', data);

   //A
    var wt = d3
          .mean(data, function(d) {
                    return d.weight_n;
                });

    var ht = d3
          .mean(data, function(d) {
                    return d.height_n;
                });

    console.log('Mean weight (lb):', wt);
    console.log('Mean height (ft):', ht);

  //B

  var egg_value = d3.nest()
      .rollup(function(v) { return {
        egg_sum: d3.sum(v, function(d) { 
            if(d.Psychic == 1){

              if (isNaN(d.egg_n)) {
                  return d.egg_n = -1;
              }else{
                  return d.egg_n; 
              }
            }
          })
        }; 
      })
      .entries(data);

  console.log('Sum of Egg Dist (ft):', egg_value);

  //C
  //Generate new json list called result to summarize
  var result = [];

  data.forEach(function(d){
    var subset = d.type;
    var pokemon = d.name;
    var num_weakness = d.weaknesses.length; 
    for (i = 0; i < subset.length; i++) { 
      var type = subset[i];
      result.push({pokemon, type,num_weakness});
    }
  }); 
  //console.log('result:', result);

  // Summarize result
  var avg_weakness_by_type = d3.nest()
    .key(function(d) { return d.type; })
    .rollup(function(v) { return d3.mean(v, function(d) { return d.num_weakness; }); })
    .entries(result);

   avg_weakness_by_type.sort(function(x, y){
    return d3.descending(x.value, y.value);
   });
  console.log('Sorted array of Avg. Weaknesses:', avg_weakness_by_type);

  // Max of the list
  var max = d3
          .max(avg_weakness_by_type, function(d) {
                    return d.value;
                });

  console.log('Most Weaknesses on Avg.:', max);

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
      console.log('Weight Summary:', weight_stats);

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
      
      console.log('Average Span by Weight Group:', avg_span);
   
   });

}
buildChart('#pokemon')