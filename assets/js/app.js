// @TODO: YOUR CODE HERE!
var svgWidth = 900;
var svgHeight = 900;

var margin = {
    top: 20,
    bottom: 100, 
    left: 25,
    right: 30
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var clickedXAxis = "poverty";

function xScale(censusData, clickedXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d=> d[clickedXAxis]), d3.max(censusData, d=>d[clickedXAxis])])
        .range([0, chartWidth]);
    return xLinearScale;
}

function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}

function renderCircles(circlesGroup, newXScale, clickedXAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d=> newXScale(d[clickedXAxis]));
    return circlesGroup;
}

function updateToolTIp(clickedXAxis, circlesGroup) {
    var label;
    if(clickedXAxis === "poverty") {
        label = "Poverty %";
    }
    else if(clickedXAxis === "age") {
        label = "Age (Median)";
    }
    else if(clickedXAxis === "income") {
        label = "Household Income (Median)";
    }
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80,-60])
        .html(function(d) {
            return (`${d.something}<br>${label} ${d[clickedXAxis]}`);
        });
    
    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    return circlesGroup;
}


d3.csv("assets/data/data.csv").then(censusData => {
    console.log(censusData);
    censusData.forEach( d => {
    d.poverty =+ d.poverty;
    d.age =+ d.age;
    d.income =+ d.income;
    d.obesity =+ d.obesity;
    });
    var xLinearScale = xScale(censusData, clickedXAxis);

    var yScaleObesity = d3.scaleLinear()
        .domain([d3.min(censusData, d=> d.obesity), d3.max(censusData, d=> d.obesity)])
        .range([chartHeight, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yScaleObesity);
    
    var xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);
    chartGroup.append("g")
        .call(leftAxis);
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d=>xLinearScale(d[clickedXAxis]))
        .attr("cy", d=>yScaleObesity(d.obesity))
        .attr("r", 20)
        .attr("fill", "blue")
        .attr("opacity", ".5");
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth/2}, ${chartHeight +20})`);
    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .text("Average Poverty %");
    var ageLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .text("Median Age");
    var incomeLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .text("Median Household Income");
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0-margin.left)
        .attr("x", 0-(chartHeight/2))
        .attr("dy", "lem")
        .text("Obesity %");
    
    var circlesGroup = updateToolTIp(clickedXAxis, circlesGroup);

    labelsGroup.selectAll("text")
        .on("click", function() {
            var value = d3.select(this).attr("value");
            if(value !== clickedXAxis) {
                clickedXAxis = value;
                xLinearScale = xScale(censusData, clickedXAxis);
                xAxis = renderAxes(xLinearScale, xAxis);
                circlesGroup = renderCircles(circlesGroup, xLinearScale, clickedXAxis);
                circlesGroup = updateToolTIp(clickedXAxis, circlesGroup);

                if(clickedXAxis === "age") {
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if(clickedXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if(clickedXAxis === "income") {
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
            }
        });
}).catch(function(error) {
    console.log(error);
});
