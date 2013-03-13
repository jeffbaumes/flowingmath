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

function actor(spec, my) {
    "use strict";

    var that,
        pos,
        parent;

    my = my || {};
    my.width = my.width || function () { return 0; };
    my.height = my.height || function () { return 0; };

    that = {};

    parent = spec.parent || d3.select("svg");
    pos = spec.pos || [0, 0];
    my.element = parent.append("g")
        .attr("transform", "translate(" + pos[0] + "," + pos[1] + ")");

    that.pos = function (p) {
        if (p === undefined) {
            return pos;
        }
        if (p[0] === pos[0] && p[1] === pos[1]) {
            return;
        }
        pos = p;

        my.element.transition().duration(500)
            .attr("transform", "translate(" + pos[0] + "," + pos[1] + ")");
    };

    return that;
}

function number(spec, my) {
    "use strict";

    var that,
        value,
        mode,
        base,
        modes;

    my = my || {};

    my.size = function () {
        return [value * 50, 50];
    };

    that = actor(spec, my);

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
        if (value < 1000) {
            return ones[digits[2]] + "-hundred " + (digits[1] === 0 ? "" : tens[digits[1]]) + (digits[0] === 0 ? "" : "-" + ones[digits[0]]);
        }
        return "big number";
    }

    value = spec.value || 0;
    mode = spec.mode || "boxes";
    base = spec.base || 10;
    modes = {};
    modes.boxes = my.element.append("g").style("opacity", 0);
    modes.boxes.selectAll("g.boxes").data(d3.range(value))
        .enter().append("g")
        .attr("class", "boxes")
        .style("opacity", "inherit")
        .attr("transform", function (d) { return "translate(" + 50 * (d - (value - 1) / 2) + ", 0)"; })
        .append("rect")
        .attr("class", "wiggle")
        .attr("x", -20)
        .attr("y", -20)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("width", 40)
        .attr("height", 40)
        .style("opacity", "inherit");
    modes.numeral = my.element.append("text")
        .attr("class", "numeral")
        .text(numeralText())
        .style("opacity", 0);
    modes.words = my.element.append("text")
        .attr("class", "words")
        .text(wordsText())
        .style("opacity", 0);

    modes.boxes.transition().duration(1000)
        .style("opacity", 1);

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
        var one, two;

        d3.select("#content").selectAll("*").remove();
        one = number({value: 1, parent: d3.select("#content"), pos: [200, 200]});
        two = number({value: 2, parent: d3.select("#content"), pos: [100, 200]});

        $("#mode").change(function () { one.mode($(this).val()); });
        $("#move").click(function () { one.pos([100 * Math.random(), 100 * Math.random()]); });
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