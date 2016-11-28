"use strict";
var Point = (function () {
    function Point(coord) {
        this.x = 0;
        this.y = 0;
        this.x = coord[0];
        this.y = coord[1];
    }
    Point.prototype.toArray = function () {
        return [this.x, this.y];
    };
    Point.prototype._isInsideLinePerpendicular = function (line) {
        var line1 = line[0];
        var line2 = line[1];
        var L2 = (((line2.x - line1.x) * (line2.x - line1.x)) + ((line2.y - line1.y) * (line2.y - line1.y)));
        if (L2 === 0)
            return false;
        var r = (((this.x - line1.x) * (line2.x - line1.x)) + ((this.y - line1.y) * (line2.y - line1.y))) / L2;
        return (0 <= r) && (r <= 1);
    };
    Point.prototype.distanceTo = function (point) {
        return Math.sqrt(Math.pow((this.x - point.x), 2) + Math.pow((this.y - point.y), 2));
    };
    Point.prototype.distanceToLine = function (line) {
        if (!this._isInsideLinePerpendicular(line)) {
            return Math.min(this.distanceTo(line[0]), this.distanceTo(line[1]));
        }
        var x = this.x;
        var y = this.y;
        var x1 = line[0].x;
        var y1 = line[0].y;
        var x2 = line[1].x;
        var y2 = line[1].y;
        var A = this.x - line[0].x;
        var B = this.y - line[0].y;
        var C = line[1].x - line[0].x;
        var D = line[1].y - line[0].y;
        var dot = A * C + B * D;
        var len_sq = C * C + D * D;
        var param = -1;
        if (len_sq !== 0)
            param = dot / len_sq;
        var xx, yy;
        if (param < 0) {
            xx = x1;
            yy = y1;
        }
        else if (param > 1) {
            xx = x2;
            yy = y2;
        }
        else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        var dx = x - xx;
        var dy = y - yy;
        return Math.sqrt(dx * dx + dy * dy);
    };
    Point.prototype.clone = function () {
        return new Point(this.toArray());
    };
    return Point;
}());
exports.Point = Point;
