"use strict";
var Point_1 = require("./Point");
var Doodle_1 = require("./Doodle");
var Stroke_1 = require("./Stroke");
var Boundaries = (function () {
    function Boundaries() {
        this.left = Number.MAX_SAFE_INTEGER;
        this.top = Number.MAX_SAFE_INTEGER;
        this.right = 0;
        this.bottom = 0;
    }
    Boundaries.prototype.include = function (obj) {
        if (obj instanceof Point_1.Point) {
            this.left = Math.min(obj.x, this.left);
            this.top = Math.min(obj.y, this.top);
            this.right = Math.max(obj.x, this.right);
            this.bottom = Math.max(obj.y, this.bottom);
            return this;
        }
        else if (obj instanceof Boundaries) {
            this.left = Math.min(obj.left, this.left);
            this.top = Math.min(obj.top, this.top);
            this.right = Math.max(obj.right, this.right);
            this.bottom = Math.max(obj.bottom, this.bottom);
            return this;
        }
        if (obj instanceof Stroke_1.Stroke || obj instanceof Doodle_1.Doodle) {
            return this.include(obj.boundaries());
        }
        throw new TypeError("Not support finding boundaries of this object: " + typeof obj);
    };
    Boundaries.prototype.scale = function (time) {
        this.left *= time;
        this.top *= time;
        this.right *= time;
        this.bottom *= time;
        return this;
    };
    Boundaries.prototype.width = function () {
        return this.right - this.left;
    };
    Boundaries.prototype.height = function () {
        return this.bottom - this.top;
    };
    Boundaries.prototype.translate = function (x, y) {
        this.left += x;
        this.top += y;
        this.right += x;
        this.bottom += y;
        return this;
    };
    Boundaries.prototype.clone = function () {
        var b = new Boundaries();
        b.include(this);
        return b;
    };
    return Boundaries;
}());
exports.Boundaries = Boundaries;
