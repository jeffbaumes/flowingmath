
$(function () {
    d3.json("1.json", function (error, data) {
        var waypoints = data;
        var actors = d3.select("#content").selectAll(".actor").data(waypoints);
        actors.enter().append("g")
        .attr("class", "actor")
        .attr("transform","translate(" + 100 + "," + 250 + ")")
        var rect = actors.append("rect")
        .attr("width", 100)
        .attr("height", 100)
        .attr("x", -50)
        .attr("y", -50)
        .style("opacity", 0);
        actors.transition().duration(5000)
        .attr("transform","translate(" + 250 + "," + 250 + ")")
        rect.transition().duration(5000)
        .style("opacity", 1);
        
        d3.timer(function (t) {
            rect.attr("transform", "rotate(" + t/20 + ")");
        });
    });
});