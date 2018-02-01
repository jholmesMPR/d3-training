function computations(containerId) {

// read in our data
    d3.json('data/cars.json', function(error, data) {
        // handle read errors
        if (error) {
            console.error('failed to read data');
            return;
        }

        console.log('raw', data);
    });


     d3.json('data/pokemon.json', function(error, data) {
        // handle read errors
        if (error) {
            console.error('failed to read data');
            return;
        }

        console.log('raw', data);
    });

}

computations('#lodash')