// @TODO: YOUR CODE HERE!
var svgWidth = 900;
var svgHeight = 900;

var margin = {
    top: 20,
    bottom: 100, 
    left: 80,
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
var clickedYAxis = "obesity";

function xScale(censusData, clickedXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d=> d[clickedXAxis])*.9, d3.max(censusData, d=>d[clickedXAxis])])
        .range([0, chartWidth]);
    return xLinearScale;
}
function yScale(censusData, clickedYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d=> d[clickedYAxis])*.8, d3.max(censusData, d=>d[clickedYAxis])])
        .range([chartHeight, 0]);
    return yLinearScale;
}


function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
}

function renderCircles(circlesGroup, newXScale, clickedXAxis, newYScale, clickedYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d=> newXScale(d[clickedXAxis]))
        .attr("cy", d=>newYScale(d[clickedYAxis]))
        .text("hi");
    return circlesGroup;
}

function updateToolTIp(clickedXAxis, clickedYAxis, circlesGroup) {
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
    var Ylabel;
    if(clickedYAxis === "obesity") {
        Ylabel = "Obesity %";
    }
    else if( clickedYAxis === "smokes") {
        Ylabel = "Smokes %";
    }
    else if(clickedYAxis === "healthcare") {
        Ylabel = "Healthcare %";
    }
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80,-60])
        .html(function(d) {
            return (`${d.state}<br>${label}: ${d[clickedXAxis]}<br>${Ylabel}: ${d[clickedYAxis]}`);
        });
    
    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
        .on("mouseout", function(data, index) {
            toolTip.hide(data, this);
        });
    return circlesGroup;
}

function textCircles(circlesText, newXScale, clickedXAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("dx", d=> newXScale(d[clickedXAxis]));
    return circlesText;
}

function YtextCircles(circlesGroup, newYScale, clickedYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("dy", d=> newYScale(d[clickedYAxis]));
        return circlesText;
}

d3.csv("assets/data/data.csv").then(censusData => {
    console.log(censusData);
    censusData.forEach( d => {
    d.poverty =+ d.poverty;
    d.age =+ d.age;
    d.income =+ d.income;
    d.obesity =+ d.obesity;
    d.smokes =+ d.smokes;
    d.healthcare =+ d.healthcare;
    });

    //create axes
    var xLinearScale = xScale(censusData, clickedXAxis);
    var yLinearScale = yScale(censusData, clickedYAxis);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    
    var xAxis = chartGroup.append("g")
        // .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);
    var yAxis = chartGroup.append("g")
        .attr("transform", `translate(0, 0)`)
        .call(leftAxis);

    //create data points
    var circlesGroup = chartGroup.selectAll("g")
        .data(censusData)
        .enter()
        .append("g");
    
    var  appendedCircles = circlesGroup
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d=>xLinearScale(d[clickedXAxis]))
        .attr("cy", d=>yLinearScale(d[clickedYAxis]))
        .attr("r", 20)
        .attr("fill", "blue")
        .attr("opacity", ".5");
    
    var circlesText = circlesGroup.append("text")
        .text(d => d.abbr)
        .classed("stateText", true)
        .attr("dx", d => xLinearScale(d[clickedXAxis]))
        .attr("dy", d => yLinearScale(d[clickedYAxis])+1);

    //create x and y labels
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth/2}, ${chartHeight +20})`);
    var ylabelsGroup = chartGroup.append("g");

    var obesityLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (chartHeight/2))
        .attr("y", 10 - margin.left)
        .attr("value", "obesity")
        .text("Obesity %");
    var smokeLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (chartHeight/2))
        .attr("y", 30- margin.left )
        .attr("value", "smokes")
        .text("Smokes  %");
    var healthcareLabel  = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (chartHeight/2))
        .attr("y", 50 - margin.left)
        .attr("value", "healthcare")
        .text("Healthcare %");
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
    
    var circlesGroup = updateToolTIp(clickedXAxis, clickedYAxis, circlesGroup);

    labelsGroup.selectAll("text")
        .on("click", function() {
            var value = d3.select(this).attr("value");
            if(value !== clickedXAxis) {
                clickedXAxis = value;
                xLinearScale = xScale(censusData, clickedXAxis);
                xAxis = renderAxes(xLinearScale, xAxis);
                circlesText = textCircles(circlesText, xLinearScale, clickedXAxis);
                appendedCircles = renderCircles(appendedCircles, xLinearScale, clickedXAxis);
                circlesGroup = updateToolTIp(clickedXAxis ,clickedYAxis, circlesGroup);

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
                else {
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
            }
        });
    ylabelsGroup.selectAll("text")
    .on("click", function() {
        var yvalue = d3.select(this).attr("value");
        if(yvalue !== clickedYAxis) {
            clickedYAxis = yvalue;
            yLinearScale = yScale(censusData, clickedYAxis);
            yAxis = renderYAxes(yLinearScale, yAxis);
            circlesText = YtextCircles(circlesText, yLinearScale, clickedYAxis);
            appendedCircles = renderCircles(appendedCircles, yLinearScale, clickedYAxis);
            circlesGroup = updateToolTIp(clickedXAxis ,clickedYAxis, circlesGroup);

             if(clickedYAxis === "smokes") {
                smokeLabel
                    .classed("active", true)
                    .classed("inactive", false);
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                    healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if(clickedYAxis === "healhcare") {
                healthcareLabel
                    .classed("active", true)
                    .classed("inactive", false);
                smokeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
            }
        }
    });
}).catch(function(error) {
    console.log(error);
});
