/*jslint browser: true, unparam: true*/

/*globals console, d3, $, Backbone*/

var app;

function go(event, id) {
    "use strict";

    var uri = id === "home" ? "" : id;
    app.navigate(uri, {trigger: true});
    event.returnValue = false;
    if (event.preventDefault) {
        event.preventDefault();
    }
    if (event.stopPropagation) {
        event.stopPropagation();
    }
    return false;
}

function goto(id, name) {
    "use strict";

    console.log("goto: " + id + ", " + name);
    d3.selectAll(".nav li").classed("active", function () { return d3.select(this).attr("id") === name; });
    if (name === "numbers-intro") {
        d3.select("#content").selectAll("*").remove();

        var actors = d3.select("#content").append("g")
            .attr("class", "actor")
            .attr("transform", "translate(" + 100 + "," + 250 + ")");

        var rect = actors.append("rect")
            .attr("width", 100)
            .attr("height", 100)
            .attr("x", -50)
            .attr("y", -50)
            .style("opacity", 0);

        actors.transition().duration(5000)
            .attr("transform", "translate(" + 250 + "," + 250 + ")");

        rect.transition().duration(5000)
            .style("opacity", 1);

        d3.timer(function (t) {
            rect.attr("transform", "rotate(" + t / 40 + ")");
        });
    }
}

$(function () {
    "use strict";

    var Router = Backbone.Router.extend({
            routes: {
                "": "home",
                "lesson/:name": "lesson"
            },
            home: function () { goto("home"); },
            lesson: function (name) { goto("lesson", name); }
        });

    app = new Router();

    Backbone.history.start({
        root: "/"
    });
});