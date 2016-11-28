"use strict";
var Point_1 = require("./Point");
var Boundaries_1 = require("./Boundaries");
var Stroke = (function () {
    function Stroke(points) {
        var _this = this;
        this._points = [];
        this._boundaries = null;
        this._boundaries = new Boundaries_1.Boundaries();
        this._points = points.map(function (pointCoord) {
            var point = new Point_1.Point(pointCoord);
            _this._boundaries.include(point);
            return point;
        });
    }
    Stroke.prototype.append = function (point) {
        if (point instanceof Point_1.Point) {
            var lastpoint = this._points[this._points.length - 1];
            if (lastpoint && lastpoint.x === point.x && lastpoint.y === point.y)
                return this;
            this._boundaries.include(point);
            this._points.push(point.clone());
            return this;
        }
        return this.append(new Point_1.Point(point));
    };
    Stroke.prototype.ramerDouglasPeucker = function (points, epsilon) {
        var max_distance = 0, middle = -1, end = points.length - 1;
        for (var i = 1; i <= end - 1; i++) {
            var distance = points[i].distanceToLine([points[0], points[end]]);
            if (distance > max_distance) {
                middle = i;
                max_distance = distance;
            }
        }
        if (max_distance > epsilon) {
            var left = points.slice(0, middle + 1);
            var right = points.slice(middle);
            left = this.ramerDouglasPeucker(left, epsilon);
            right = this.ramerDouglasPeucker(right, epsilon);
            return left.slice(0, -1).concat(right);
        }
        return [points[0], points[end]];
    };
    Stroke.prototype.point = function (position) {
        return this._points[position] || null;
    };
    Stroke.prototype.points = function () {
        return this._points.map(function (p) { return p.clone(); });
    };
    Stroke.prototype.getPointCount = function () {
        return this._points.length;
    };
    Stroke.prototype.simplify = function (threshold) {
        var _this = this;
        if (threshold === void 0) { threshold = 5; }
        var unique = this._points.map(function (point, idx) {
            if (idx > 0 && point.x === _this._points[idx - 1].x && point.y === _this._points[idx - 1].y) {
                return null;
            }
            return point.clone();
        })
            .filter(function (p) { return !!p; });
        if (unique.length > 1)
            this._points = this.ramerDouglasPeucker(unique, threshold);
        return this;
    };
    Stroke.prototype.clone = function () {
        return new Stroke(this._points.map(function (p) {
            return p.toArray();
        }));
    };
    Stroke.prototype.toArray = function () {
        return this._points.map(function (p) {
            return p.toArray();
        });
    };
    Stroke.prototype.scale = function (time) {
        this._points.map(function (p) {
            p.x *= time;
            p.y *= time;
        });
        this._boundaries.scale(time);
        return this;
    };
    Stroke.prototype.translate = function (x, y) {
        this._points.map(function (p) {
            p.x += x;
            p.y += y;
        });
        this._boundaries.translate(x, y);
        return this;
    };
    Stroke.prototype.boundaries = function () {
        return this._boundaries.clone();
    };
    return Stroke;
}());
exports.Stroke = Stroke;
