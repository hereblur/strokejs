"use strict";
var Stroke_1 = require("./Stroke");
var Boundaries_1 = require("./Boundaries");
var nDollar = require("ndollar-js");
var Doodle = (function () {
    function Doodle(strokes) {
        var _this = this;
        this._strokes = [];
        this._boundaries = null;
        this._boundaries = new Boundaries_1.Boundaries();
        this._strokes = strokes.map(function (points) {
            var stroke = new Stroke_1.Stroke(points);
            _this._boundaries.include(stroke);
            return stroke;
        });
    }
    Doodle.prototype.simplify = function (threshold) {
        this._strokes.map(function (stroke) {
            return stroke.simplify(threshold);
        });
    };
    Doodle.prototype.stroke = function (position) {
        return this._strokes[position] || null;
    };
    Doodle.prototype.strokes = function () {
        return this._strokes.map(function (s) { return s.clone(); });
    };
    Doodle.prototype.getStrokeCount = function () {
        return this._strokes.length;
    };
    Doodle.prototype.compare = function (another) {
        if (this.getStrokeCount() !== another.getStrokeCount()) {
            return 0;
        }
        var me = this.strokes().map(function (stroke) {
            return stroke.points().map(function (point) {
                return new nDollar.Point(point.x, point.y);
            });
        });
        var you = another.strokes().map(function (stroke) {
            return stroke.points().map(function (point) {
                return new nDollar.Point(point.x, point.y);
            });
        });
        var recognizer = new nDollar.Recognizer();
        recognizer.AddGesture("correctDoodle", true, me);
        var result = recognizer.Recognize(you, true, true, true);
        if (result.Name !== "correctDoodle") {
            return 0;
        }
        return result.Score;
    };
    Doodle.prototype.append = function (stroke) {
        if (stroke instanceof Stroke_1.Stroke) {
            var lastpoint = this._strokes[this._strokes.length - 1];
            this._boundaries.include(stroke);
            this._strokes.push(stroke.clone());
            return this;
        }
        return this.append(new Stroke_1.Stroke(stroke));
    };
    Doodle.prototype.boundaries = function () {
        return this._boundaries.clone();
    };
    Doodle.prototype.scale = function (time) {
        this._strokes.map(function (stroke) {
            stroke.scale(time);
        });
        this._boundaries.scale(time);
        return this;
    };
    Doodle.prototype.translate = function (x, y) {
        this._strokes.map(function (stroke) {
            stroke.translate(x, y);
        });
        this._boundaries.translate(x, y);
        return this;
    };
    Doodle.prototype.clone = function () {
        return new Doodle(this._strokes.map(function (s) {
            return s.toArray();
        }));
    };
    Doodle.prototype.toArray = function () {
        return this._strokes.map(function (stroke) {
            return stroke.points().map(function (p) {
                return p.toArray();
            });
        });
    };
    return Doodle;
}());
exports.Doodle = Doodle;
