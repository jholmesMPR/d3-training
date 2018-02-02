function computations(containerId) {

 //Part 1
    d3.json('data/cars.json', function(error, data) {
        // handle read errors
        if (error) {
            console.error('failed to read data');
            return;
        }

   		data.forEach(function(d) {
            d.make_is_common = +d.make_is_common; 
            d.count = 1;
        });
        console.log('raw', data);

        //A	
        var output = _.sumBy(data, 'make_is_common');

      	console.log('sum_makes', output);

        //B
		var output =
		  _(data)
		    .groupBy('make_country')
		    .map((objs, key) => ({
		        'make_country': key,
		        'total': _.sumBy(objs, 'count') }))
		    .value();

		console.log('make_per_country', output);

		//C
		var output =
		  _(data)
		    .groupBy('make_country', 'make_is_common')
		    .map((objs, key1, key2) => ({
		        'make_country': key1,
		        'make_is_common':key2,
		        'total': _.sumBy(objs, 'count') 
		    }))
		    .value();

		console.log('make_per_country_common', output);
    });

//Part 2
     d3.json('data/pokemon.json', function(error, data) {
        // handle read errors
        if (error) {
            console.error('failed to read data');
            return;
        }

        // Data Management Steps
        data.forEach(function(d){
            d.height_n = d.height.replace(/ m/, '');
            d.weight_n = d.weight.replace(/ kg/,'');
            d.egg_n = d.egg.replace(/ km/,'');
            d.height_n = Number(d.height_n)*3.28084;
            d.weight_n = Number(d.weight_n)*2.20462;
            d.egg_n = Number(d.egg_n)*0.621371;

        })

        //A

        var mean_wt = _.meanBy(data, 'weight_n'),
        	round_wt = _.round(mean_wt, 2);
        var mean_ht = _.meanBy(data, 'height_n'),
        	round_ht = _.round(mean_ht, 2);;

      	console.log('mean_wt', round_wt);
      	console.log('mean_ht', round_ht);

        //B
        var egg_sum = _.sum(data, 'egg_n'),
        	round_egg = _.round(egg_sum, 2);
        console.log('egg_dist', round_egg);


        //C

        //D
    });

}

computations('#lodash')