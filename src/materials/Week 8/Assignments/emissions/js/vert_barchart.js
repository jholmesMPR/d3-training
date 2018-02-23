
function buildChart(containerId) {
  // size globals
    var width = 1000;
    var height = 500;

    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 65
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

    // read in our data
    d3.csv('data/air_quality.csv', function(error, data) {
        // handle read errors
        if (error) {
            console.error('failed to read data');
            return;
        }

        data.forEach(function(d){
            d.Emissions = Number(String(d.Emissions).replace(/,/, ''));
            if(d.Region == 'West'){
                d.Color = '#3366cc'
            }
            if(d.Region == 'South'){
                d.Color = '#dc3912'
            }
            if(d.Region == 'Northeast'){
                d.Color = '#ff9900'
            }
            if(d.Region == 'Midwest'){
                d.Color = '#109618'
            }
        })

        console.log('raw', data);

        data.sort(function(x, y){
            return d3.ascending(x.Emissions, y.Emissions);
        })

        console.log('asc', data);

        data.sort(function(x, y){
            return d3.descending(x.Emissions, y.Emissions);
        })

        console.log('desc', data);

         data.sort(function(x, y){
            return d3.ascending(x.State, y.State);
        })

        console.log('state', data);

        var groups = g
            .selectAll('.states')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'states');


        var x = d3
            .scaleBand()
            .domain(
                data.map(function(d) {
                    return d.State;
                })
            )
            .range([0, innerWidth])
            .padding(0.1);

        console.log(x.domain(), x.range());

        var y = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(data, function(d) {
                    return d.Emissions;
                })
            ])
            .range([innerHeight, 0]);


        var xAxis = d3.axisBottom(x);

        g
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + innerHeight + ')')
            .call(xAxis);

        var yAxis = d3.axisLeft(y).ticks(12);

        g
            .append('g')
            .attr('class', 'y-axis')
            .call(yAxis);


        // X-axis Label
        g
            .append('text')
            .attr('class', 'x-axis-label')
            .attr('x', innerWidth / 2)
            .attr('y', innerHeight + 30)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'hanging')
            .text('State')
            .style("font", "18px times");

        //Y-axis Label
        g
            .append('text')
            .attr('class', 'y-axis-label')
            .attr('x', 0)
            .attr('y', innerHeight / 2 - 20)
            .attr('transform', 'rotate(-90,-30,' + innerHeight / 2  + ')')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .text('Emissions')
            .style("font", "18px times");

        // title
        g
            .append('text')
            .attr('class', 'title')
            .attr('x', innerWidth / 2)
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .style("font", "24px times")
            .text('Emissions by State');

        
        // bars
        g
            .selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', function(d) {
                return x(d.State);
            })
            .attr('y', function(d) {
                return y(d.Emissions);
            })
            .attr('width', x.bandwidth())
            .attr('height', function(d) {
                return innerHeight - y(d.Emissions);
            })
            .attr('fill', function(d){
                return d.Color;
            })
            .attr('stroke', 'none')
            .attr("ry", 2);

        //Radio Buttons
        var w = 1000;
        var h = 50;

        var svg= d3
            .select("body")
            .append("svg")
            .attr("width",w)
            .attr("height",h)

        //backdrop of color
        var background = svg
            .append("rect")
            .attr("id", "backgroundRect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("x", 0)
            .attr("y", 0)
            .attr("fill", "#ffffff")

        var allButtons= svg
            .append("g")
            .attr("id", "allButtons") 

        //button labels
        var labels= ['Sort by State','Sort by Emissions Ascending','Sort by Emissions Descending'];


        //colors for different button states 
        var defaultColor= "#7777BB"
        var hoverColor= "#0000ff"
        var pressedColor= "#000077"

        //groups for each button (which will hold a rect and text)
        var buttonGroups= allButtons
            .selectAll("g.button")
            .data(labels)
            .enter()
            .append("g")
            .attr("class","button")
            .style("cursor","pointer")
            .on("click",function(d,i) {
                updateButtonColors(d3.select(this), d3.select(this.parentNode))
                d3
                .select("#numberToggle")
                .text(i+1)
            })
            .on("mouseover", function() {
                if (d3.select(this).select("rect").attr("fill") != pressedColor) {
                    d3.select(this)
                        .select("rect")
                        .attr("fill",hoverColor);
                }
            })
            .on("mouseout", function() {
                if (d3.select(this).select("rect").attr("fill") != pressedColor) {
                    d3.select(this)
                        .select("rect")
                        .attr("fill",defaultColor);
                }
            })


        //groups for each button (which will hold a rect and text)
        var buttonGroups= allButtons
            .selectAll("g.button")
            .data(labels)
            .enter()
            .append("g")
            .attr("class","button")
            .style("cursor","pointer")

        var bWidth = 225; //button width
        var bHeight = 25; //button height
        var bSpace = 25; //space between buttons
        var x0 = 125; //x offset
        var y0 = 10; //y offset

        //adding a rect to each button group
        buttonGroups.append("rect")
            .attr("class", "buttonRect")
            .attr("width", bWidth)
            .attr("height", bHeight)
            .attr("x", function(d, i) {
                return x0 + (bWidth + bSpace)*i;
            })
            .attr("y", y0)
            .attr("rx", 3) 
            .attr("ry", 3)
            .attr("fill", "blue")

        //adding text to each button group, centered within the button rect
        buttonGroups.append("text")
            .attr("class","buttonText")
            .attr("font-family","FontAwesome")
            .attr("x", function(d, i) {
                return x0 + (bWidth + bSpace)*i + bWidth/2;
            })
            .attr("y", y0 + bHeight/2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .attr("fill", "white")
            .text(function(d) {return d;})
            
        function updateButtonColors(button, parent) {
                parent.selectAll("rect")
                        .attr("fill",defaultColor)

                button.select("rect")
                        .attr("fill",pressedColor)
            }

    });

}

buildChart('#vert-bar-chart')