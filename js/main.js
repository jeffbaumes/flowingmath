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

function number(spec) {
    "use strict";

    var that,
        value,
        mode,
        base,
        pos,
        parent,
        element,
        modes;

    function numeralText() {
        return value;
    }

    function wordsText() {
        var ones,
            tens,
            val,
            digits;
        ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
            "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
        tens = ["", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
        val = value;
        digits = [];
        while (val > 10) {
            digits.push(value % 10);
            val = Math.floor(val / 10);
        }
        digits.push(val);
        if (value === 0) {
            return "zero";
        }
        if (value < 20) {
            return ones[value];
        }
        if (value < 100) {
            return tens[digits[1]] + (digits[0] === 0 ? "" : "-" + ones[digits[0]]);
        }
        return "big number";
    }

    value = spec.value || 0;
    mode = spec.mode || "boxes";
    base = spec.base || 10;
    pos = spec.pos || [100, 100];
    parent = spec.parent || d3.select("svg");
    element = parent.append("g")
        .attr("transform", "translate(" + pos[0] + "," + pos[1] + ")");
    modes = {};
    modes.boxes = element.append("g").style("opacity", 0);
    modes.boxes.selectAll("g.boxes").data(d3.range(value))
        .enter().append("g")
        .attr("class", "boxes")
        .style("opacity", "inherit")
        .attr("transform", function (d) { return "translate(" + 50 * (d - (value - 1) / 2) + ", 0)"; })
        .append("rect")
        //.attr("class", "wiggle")
        .attr("x", -20)
        .attr("y", -20)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("width", 40)
        .attr("height", 40)
        .style("opacity", "inherit");
    modes.numeral = element.append("text")
        .attr("class", "numeral")
        .text(numeralText())
        .style("opacity", 0);
    modes.words = element.append("text")
        .attr("class", "words")
        .text(wordsText())
        .style("opacity", 0);

    modes.boxes.transition().duration(4000)
        .style("opacity", 1);

    that = {};

    that.mode = function (m) {
        if (m === undefined) {
            return mode;
        }
        if (m === mode) {
            return;
        }
        modes[mode].transition().duration(1000)
            .style("opacity", 0);
        modes[m].transition().duration(1000)
            .style("opacity", 1);
        mode = m;
    };

    return that;
}

function goto(id, name) {
    "use strict";

    console.log("goto: " + id + ", " + name);
    d3.selectAll(".nav li").classed("active", function () { return d3.select(this).attr("id") === name; });
    if (name === "numbers-intro") {
        var one;

        d3.select("#content").selectAll("*").remove();
        one = number({value: 99, parent: d3.select("#content"), pos: [200, 200]});

        $("#mode").change(function () { one.mode($(this).val()); });
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
    d3.timer(function (t) {
        d3.selectAll(".wiggle").attr("transform", "rotate(" + 5 * Math.cos(Math.PI / 180 * t / 5) + ")");
    });
});