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

d3.csv("assets/data/data.csv").then(d => {
    console.log(d)
}).catch(function(error) {
    console.log(error);
});