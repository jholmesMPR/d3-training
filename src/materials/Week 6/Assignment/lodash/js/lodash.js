function computations(containerId) {

 //Part 1
    d3.json('data/cars.json', function(error, data) {
        // handle read errors
      if (error) {
          console.error('failed to read data');
          return;
      }

      //console.log('raw', data);

      //Data Management Steps
  		data.forEach(function(d) {
          d.make_is_common = +d.make_is_common; 
          d.count = 1;
      });
      
      //console.log('clean', data);

      //A	
      var output = _.sumBy(data, 'make_is_common');
    	console.log('Number of Makes', output);

      //B
  		var output =
  		  _(data)
  		    .groupBy('make_country')
  		    .map((objs, key1) => ({             
              'make_country': key1,
              'total': _.sumBy(objs, 'count') 
            }) 
          )
  		    .value();

  		console.log('Number of Makes per Country', output);

		//C
  		var output =
        _(data)
          .groupBy(function(d) {
            return d.make_is_common + "-" + d.make_country;
          })
          .map((objs, key) => ({  
              'make_is_common_by_country':key,           
              'total': _.sumBy(objs, 'count') 
          }))
          .value();

      console.log('Number of Makes per Country (Common)', output);

  });

//Part 2
     d3.json('data/pokemon.json', function(error, data) {

        // handle read errors
        if (error) {
            console.error('failed to read data');
            return;
        }

        //console.log('raw', data);

        // Data Management Steps
        data.forEach(function(d){
            d.height_n = d.height.replace(/ m/, '');
            d.weight_n = d.weight.replace(/ kg/,'');
            d.egg_n = d.egg.replace(/ km/,'');
            d.height_n = Number(d.height_n)*3.28084;
            d.weight_n = Number(d.weight_n)*2.20462;
            d.egg_n = Number(d.egg_n)*0.621371;
            d.spawn_time_min = +d.spawn_time.substring(3,5);
            d.spawn_time_hour = +d.spawn_time.substring(0,2);
            d.spawn_time_total = d.spawn_time_hour*60 + d.spawn_time_min;
        })

        //console.log('clean', data);

        //A

        var mean_wt = _.meanBy(data, 'weight_n'),
        	round_wt = _.round(mean_wt, 2);
        var mean_ht = _.meanBy(data, 'height_n'),
        	round_ht = _.round(mean_ht, 2);;

      	console.log('Mean weight (lb):', round_wt);
      	console.log('Mean height (ft)', round_ht);

        //B

        // Make all NaN values equal to -1
         data.forEach(function(d){
           d.egg_n = d.egg_n || -1;
   		    });

        // Filter data to just include Psychic weaknesses
         var test = 
         _(data)
         .filter( function(o) 
          { return ! o.weaknesses.includes("Psychic"); })
         .value();

        // Sum the egg variable
        var egg_sum = 
         _(test)
         .sumBy('egg_n');
         console.log('Sum of Egg Dist (ft)', egg_sum);

      //C
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

      var summarize =
      _(result)
        .groupBy('type')
        .map((objs, key) => ({  
            'type':key,           
            'num_weakness': _.meanBy(objs, 'num_weakness') 
          }) 
        )
        .orderBy('num_weakness', 'desc')
        .value();

      console.log('Sorted array of Avg. Weaknesses', summarize);
      
      //Maximum
      var max =  
      _(summarize)
      .maxBy('num_weakness');
          
      console.log('Most Weaknesses on Avg.', max);

       //D

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

        //Summarize by quantile scale group
        var noNa = 
         _(data)
         .filter( function(o) 
          { return ! isNaN(o.spawn_time_total); })
         .value();

        var avg_span =
              _(noNa)
               .groupBy('quantile_group') 
               .map((objs, key) => ({
                    'quantile_scale': key,
                    'total': _.meanBy(objs, 'spawn_time_total') }))
               .value();

        console.log('Average Span by Weight Group', avg_span);

    });

}

computations('#lodash')