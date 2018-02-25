
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

                    cntys = cnty12.concat(cnty13, cnty14, cnty15, cnty16)

                    console.log('counties', cntys);

                    });
                });
            });
        });
    });

}

buildChart('#counties')