// @TODO: YOUR CODE HERE!
var svgWidth = 900;
var svgHeight = 900;

var margin = {
    top: 20,
    bottom: 60, 
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

d3.csv("assets/data/data.csv").then(data => {
    console.log(data);
    data.forEach( d => {
    d.poverty =+ d.poverty;
    });
    var xScalePoverty = d3.scaleLinear()
    .domain([d3.min(data, d=> d.poverty), d3.max(data, d=>d.poverty)])
    .range([0, chartWidth]);

    var yScaleObesity = d3.scaleLinear()
        .domain([d3.min(data, d=> d.obesity), d3.max(data, d=> d.obesity)])
        .range([chartHeight, 0]);

    var bottomAxis = d3.axisBottom(xScalePoverty);
    var leftAxis = d3.axisLeft(yScaleObesity);
    
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);
    chartGroup.append("g")
        .call(leftAxis);

}).catch(function(error) {
    console.log(error);
});