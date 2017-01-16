(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.strokejs = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Point_1 = require("./Point");
var Doodle_1 = require("./Doodle");
var Stroke_1 = require("./Stroke");
var Boundaries = function () {
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
        } else if (obj instanceof Boundaries) {
            this.left = Math.min(obj.left, this.left);
            this.top = Math.min(obj.top, this.top);
            this.right = Math.max(obj.right, this.right);
            this.bottom = Math.max(obj.bottom, this.bottom);
            return this;
        }
        if (obj instanceof Stroke_1.Stroke || obj instanceof Doodle_1.Doodle) {
            return this.include(obj.boundaries());
        }
        throw new TypeError("Not support finding boundaries of this object: " + (typeof obj === "undefined" ? "undefined" : _typeof(obj)));
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
}();
exports.Boundaries = Boundaries;

},{"./Doodle":2,"./Point":3,"./Stroke":4}],2:[function(require,module,exports){
"use strict";

var Stroke_1 = require("./Stroke");
var Boundaries_1 = require("./Boundaries");
var nDollar = require("ndollar-js");
var Doodle = function () {
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
        return this._strokes.map(function (s) {
            return s.clone();
        });
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
}();
exports.Doodle = Doodle;

},{"./Boundaries":1,"./Stroke":4,"ndollar-js":6}],3:[function(require,module,exports){
"use strict";

var Point = function () {
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
        var L2 = (line2.x - line1.x) * (line2.x - line1.x) + (line2.y - line1.y) * (line2.y - line1.y);
        if (L2 === 0) return false;
        var r = ((this.x - line1.x) * (line2.x - line1.x) + (this.y - line1.y) * (line2.y - line1.y)) / L2;
        return 0 <= r && r <= 1;
    };
    Point.prototype.distanceTo = function (point) {
        return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2));
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
        if (len_sq !== 0) param = dot / len_sq;
        var xx, yy;
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
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
}();
exports.Point = Point;

},{}],4:[function(require,module,exports){
"use strict";

var Point_1 = require("./Point");
var Boundaries_1 = require("./Boundaries");
var Stroke = function () {
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
            if (lastpoint && lastpoint.x === point.x && lastpoint.y === point.y) return this;
            this._boundaries.include(point);
            this._points.push(point.clone());
            return this;
        }
        return this.append(new Point_1.Point(point));
    };
    Stroke.prototype.ramerDouglasPeucker = function (points, epsilon) {
        var max_distance = 0,
            middle = -1,
            end = points.length - 1;
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
        return this._points.map(function (p) {
            return p.clone();
        });
    };
    Stroke.prototype.getPointCount = function () {
        return this._points.length;
    };
    Stroke.prototype.simplify = function (threshold) {
        var _this = this;
        if (threshold === void 0) {
            threshold = 5;
        }
        var unique = this._points.map(function (point, idx) {
            if (idx > 0 && point.x === _this._points[idx - 1].x && point.y === _this._points[idx - 1].y) {
                return null;
            }
            return point.clone();
        }).filter(function (p) {
            return !!p;
        });
        if (unique.length > 1) this._points = this.ramerDouglasPeucker(unique, threshold);
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
}();
exports.Stroke = Stroke;

},{"./Boundaries":1,"./Point":3}],5:[function(require,module,exports){
"use strict";

var Point_1 = require("./Point");
exports.Point = Point_1.Point;
var Stroke_1 = require("./Stroke");
exports.Stroke = Stroke_1.Stroke;
var Doodle_1 = require("./Doodle");
exports.Doodle = Doodle_1.Doodle;

},{"./Doodle":2,"./Point":3,"./Stroke":4}],6:[function(require,module,exports){
"use strict";
var DistanceAtAngle = function (points, T, radians) {
    var newpoints = RotateBy(points, radians);
    return PathDistance(newpoints, T.Points);
};
var Centroid = function (points) {
    var x = 0.0, y = 0.0;
    for (var i = 0; i < points.length; i++) {
        x += points[i].X;
        y += points[i].Y;
    }
    x /= points.length;
    y /= points.length;
    return new Point(x, y);
};
var BoundingBox = function (points) {
    var minX = +Infinity, maxX = -Infinity, minY = +Infinity, maxY = -Infinity;
    for (var i = 0; i < points.length; i++) {
        minX = Math.min(minX, points[i].X);
        minY = Math.min(minY, points[i].Y);
        maxX = Math.max(maxX, points[i].X);
        maxY = Math.max(maxY, points[i].Y);
    }
    return new Rectangle(minX, minY, maxX - minX, maxY - minY);
};
var PathDistance = function (pts1, pts2) {
    var d = 0.0;
    for (var i = 0; i < pts1.length; i++)
        d += Distance(pts1[i], pts2[i]);
    return d / pts1.length;
};
var PathLength = function (points) {
    var d = 0.0;
    for (var i = 1; i < points.length; i++)
        d += Distance(points[i - 1], points[i]);
    return d;
};
var Distance = function (p1, p2) {
    var dx = p2.X - p1.X;
    var dy = p2.Y - p1.Y;
    return Math.sqrt(dx * dx + dy * dy);
};
var CalcStartUnitVector = function (points, index) {
    var v = new Point(points[index].X - points[0].X, points[index].Y - points[0].Y);
    var len = Math.sqrt(v.X * v.X + v.Y * v.Y);
    return new Point(v.X / len, v.Y / len);
};
var AngleBetweenUnitVectors = function (v1, v2) {
    var n = (v1.X * v2.X + v1.Y * v2.Y);
    if (n < -1.0 || n > +1.0)
        n = Round(n, 5);
    return Math.acos(n);
};
var Round = function (n, d) { d = Math.pow(10, d); return Math.round(n * d) / d; };
var Deg2Rad = function (d) { return (d * Math.PI / 180.0); };
var Resample = function (points, numPoint) {
    var I = PathLength(points) / (numPoint - 1);
    var D = 0.0;
    var newpoints = new Array(points[0]);
    for (var i = 1; i < points.length; i++) {
        var d = Distance(points[i - 1], points[i]);
        if ((D + d) >= I) {
            var qx = points[i - 1].X + ((I - D) / d) * (points[i].X - points[i - 1].X);
            var qy = points[i - 1].Y + ((I - D) / d) * (points[i].Y - points[i - 1].Y);
            var q = new Point(qx, qy);
            newpoints[newpoints.length] = q;
            points.splice(i, 0, q);
            D = 0.0;
        }
        else {
            D += d;
        }
    }
    if (newpoints.length === numPoint - 1) {
        newpoints[newpoints.length] = new Point(points[points.length - 1].X, points[points.length - 1].Y);
    }
    return newpoints;
};
var IndicativeAngle = function (points) {
    var c = Centroid(points);
    return Math.atan2(c.Y - points[0].Y, c.X - points[0].X);
};
var HeapPermute = function (n, order, orders) {
    if (n === 1) {
        orders[orders.length] = order.slice();
    }
    else {
        for (var i = 0; i < n; i++) {
            HeapPermute(n - 1, order, orders);
            if (n % 2 === 1) {
                var tmp = order[0];
                order[0] = order[n - 1];
                order[n - 1] = tmp;
            }
            else {
                var tmp_ = order[i];
                order[i] = order[n - 1];
                order[n - 1] = tmp_;
            }
        }
    }
};
var MakeUnistrokes = function (strokes, orders) {
    var unistrokes = [];
    for (var r = 0; r < orders.length; r++) {
        for (var b = 0; b < Math.pow(2, orders[r].length); b++) {
            var unistroke = [];
            for (var i = 0; i < orders[r].length; i++) {
                var pts = void 0;
                if (((b >> i) & 1) === 1) {
                    pts = strokes[orders[r][i]].slice().reverse();
                }
                else {
                    pts = strokes[orders[r][i]].slice();
                }
                for (var p = 0; p < pts.length; p++) {
                    unistroke[unistroke.length] = pts[p];
                }
            }
            unistrokes[unistrokes.length] = unistroke;
        }
    }
    return unistrokes;
};
var CombineStrokes = function (strokes) {
    var points = [];
    for (var s = 0; s < strokes.length; s++) {
        for (var p = 0; p < strokes[s].length; p++) {
            points[points.length] = new Point(strokes[s][p].X, strokes[s][p].Y);
        }
    }
    return points;
};
var RotateBy = function (points, radians) {
    var c = Centroid(points);
    var cos = Math.cos(radians);
    var sin = Math.sin(radians);
    var newpoints = [];
    for (var i = 0; i < points.length; i++) {
        var qx = (points[i].X - c.X) * cos - (points[i].Y - c.Y) * sin + c.X;
        var qy = (points[i].X - c.X) * sin + (points[i].Y - c.Y) * cos + c.Y;
        newpoints[newpoints.length] = new Point(qx, qy);
    }
    return newpoints;
};
var ScaleDimTo = function (points, size, ratio1D) {
    var B = BoundingBox(points);
    var uniformly = Math.min(B.Width / B.Height, B.Height / B.Width) <= ratio1D;
    var newpoints = [];
    for (var i = 0; i < points.length; i++) {
        var qx = uniformly ? points[i].X * (size / Math.max(B.Width, B.Height)) : points[i].X * (size / B.Width);
        var qy = uniformly ? points[i].Y * (size / Math.max(B.Width, B.Height)) : points[i].Y * (size / B.Height);
        newpoints[newpoints.length] = new Point(qx, qy);
    }
    return newpoints;
};
var TranslateTo = function (points, pt) {
    var c = Centroid(points);
    var newpoints = [];
    for (var i = 0; i < points.length; i++) {
        var qx = points[i].X + pt.X - c.X;
        var qy = points[i].Y + pt.Y - c.Y;
        newpoints[newpoints.length] = new Point(qx, qy);
    }
    return newpoints;
};
var Vectorize = function (points, useBoundedRotationInvariance) {
    var cos = 1.0;
    var sin = 0.0;
    if (useBoundedRotationInvariance) {
        var iAngle = Math.atan2(points[0].Y, points[0].X);
        var baseOrientation = (Math.PI / 4.0) * Math.floor((iAngle + Math.PI / 8.0) / (Math.PI / 4.0));
        cos = Math.cos(baseOrientation - iAngle);
        sin = Math.sin(baseOrientation - iAngle);
    }
    var sum = 0.0;
    var vector = [];
    for (var i = 0; i < points.length; i++) {
        var newX = points[i].X * cos - points[i].Y * sin;
        var newY = points[i].Y * cos + points[i].X * sin;
        vector[vector.length] = newX;
        vector[vector.length] = newY;
        sum += newX * newX + newY * newY;
    }
    var magnitude = Math.sqrt(sum);
    for (var i = 0; i < vector.length; i++)
        vector[i] /= magnitude;
    return vector;
};
var OptimalCosineDistance = function (v1, v2) {
    var a = 0.0;
    var b = 0.0;
    for (var i = 0; i < v1.length; i += 2) {
        a += v1[i] * v2[i] + v1[i + 1] * v2[i + 1];
        b += v1[i] * v2[i + 1] - v1[i + 1] * v2[i];
    }
    var angle = Math.atan(b / a);
    return Math.acos(a * Math.cos(angle) + b * Math.sin(angle));
};
var DistanceAtBestAngle = function (points, T, a, b, threshold) {
    var x1 = Phi * a + (1.0 - Phi) * b;
    var f1 = DistanceAtAngle(points, T, x1);
    var x2 = (1.0 - Phi) * a + Phi * b;
    var f2 = DistanceAtAngle(points, T, x2);
    while (Math.abs(b - a) > threshold) {
        if (f1 < f2) {
            b = x2;
            x2 = x1;
            f2 = f1;
            x1 = Phi * a + (1.0 - Phi) * b;
            f1 = DistanceAtAngle(points, T, x1);
        }
        else {
            a = x1;
            x1 = x2;
            f1 = f2;
            x2 = (1.0 - Phi) * a + Phi * b;
            f2 = DistanceAtAngle(points, T, x2);
        }
    }
    return Math.min(f1, f2);
};
var NumPoints = 96;
var SquareSize = 250.0;
var OneDThreshold = 0.25;
var Diagonal = Math.sqrt(SquareSize * SquareSize + SquareSize * SquareSize);
var HalfDiagonal = 0.5 * Diagonal;
var AngleRange = Deg2Rad(45.0);
var AnglePrecision = Deg2Rad(2.0);
var Phi = 0.5 * (-1.0 + Math.sqrt(5.0));
var StartAngleIndex = (NumPoints / 8);
var AngleSimilarityThreshold = Deg2Rad(30.0);
var Point = (function () {
    function Point(X, Y) {
        this.X = X;
        this.Y = Y;
    }
    Point.origin = function () {
        return new Point(0, 0);
    };
    return Point;
}());
exports.Point = Point;
var Rectangle = (function () {
    function Rectangle(X, Y, Width, Height) {
        this.X = X;
        this.Y = Y;
        this.Width = Width;
        this.Height = Height;
    }
    return Rectangle;
}());
exports.Rectangle = Rectangle;
var Result = (function () {
    function Result(Name, Score) {
        this.Name = Name;
        this.Score = Score;
    }
    return Result;
}());
exports.Result = Result;
var Unistroke = (function () {
    function Unistroke(Name, useBoundedRotationInvariance, points) {
        this.Name = Name;
        this.Points = Resample(points, NumPoints);
        var radians = IndicativeAngle(this.Points);
        this.Points = RotateBy(this.Points, -radians);
        this.Points = ScaleDimTo(this.Points, SquareSize, OneDThreshold);
        if (useBoundedRotationInvariance)
            this.Points = RotateBy(this.Points, +radians);
        this.Points = TranslateTo(this.Points, Point.origin());
        this.StartUnitVector = CalcStartUnitVector(this.Points, StartAngleIndex);
        this.Vector = Vectorize(this.Points, useBoundedRotationInvariance);
    }
    return Unistroke;
}());
exports.Unistroke = Unistroke;
var Multistroke = (function () {
    function Multistroke(Name, useBoundedRotationInvariance, strokes) {
        this.Name = Name;
        this.NumStrokes = strokes.length;
        var order = new Array(strokes.length);
        for (var i = 0; i < strokes.length; i++) {
            order[i] = i;
        }
        var orders = [];
        HeapPermute(strokes.length, order, orders);
        var unistrokes = MakeUnistrokes(strokes, orders);
        this.Unistrokes = new Array(unistrokes.length);
        for (var j = 0; j < unistrokes.length; j++) {
            this.Unistrokes[j] = new Unistroke(this.Name, useBoundedRotationInvariance, unistrokes[j]);
        }
    }
    return Multistroke;
}());
exports.Multistroke = Multistroke;
var Recognizer = (function () {
    function Recognizer() {
        this.Multistrokes = [];
    }
    Recognizer.prototype.Recognize = function (strokes, useBoundedRotationInvariance, requireSameNoOfStrokes, useProtractor) {
        var points = CombineStrokes(strokes);
        points = Resample(points, NumPoints);
        var radians = IndicativeAngle(points);
        points = RotateBy(points, -radians);
        points = ScaleDimTo(points, SquareSize, OneDThreshold);
        if (useBoundedRotationInvariance)
            points = RotateBy(points, +radians);
        points = TranslateTo(points, Point.origin());
        var startv = CalcStartUnitVector(points, StartAngleIndex);
        var vector = Vectorize(points, useBoundedRotationInvariance);
        var b = +Infinity;
        var u = -1;
        for (var i = 0; i < this.Multistrokes.length; i++) {
            if (!requireSameNoOfStrokes || strokes.length === this.Multistrokes[i].NumStrokes) {
                for (var j = 0; j < this.Multistrokes[i].Unistrokes.length; j++) {
                    if (AngleBetweenUnitVectors(startv, this.Multistrokes[i].Unistrokes[j].StartUnitVector) <= AngleSimilarityThreshold) {
                        var d = void 0;
                        if (useProtractor)
                            d = OptimalCosineDistance(this.Multistrokes[i].Unistrokes[j].Vector, vector);
                        else
                            d = DistanceAtBestAngle(points, this.Multistrokes[i].Unistrokes[j], -AngleRange, +AngleRange, AnglePrecision);
                        if (d < b) {
                            b = d;
                            u = i;
                        }
                    }
                }
            }
        }
        return (u === -1) ? new Result("No match.", 0.0) : new Result(this.Multistrokes[u].Name, useProtractor ? 1.0 / b : 1.0 - b / HalfDiagonal);
    };
    Recognizer.prototype.AddGesture = function (name, useBoundedRotationInvariance, strokes) {
        this.Multistrokes.push(new Multistroke(name, useBoundedRotationInvariance, strokes));
        var num = 0;
        for (var i = 0; i < this.Multistrokes.length; i++) {
            if (this.Multistrokes[i].Name === name)
                num++;
        }
        return num;
    };
    Recognizer.prototype.ClearGestures = function () {
        this.Multistrokes = [];
    };
    Recognizer.prototype.LoadDefaultGestures = function (useBoundedRotationInvariance) {
        this.Multistrokes.push(new Multistroke("T", useBoundedRotationInvariance, [
            [new Point(30, 7), new Point(103, 7)],
            [new Point(66, 7), new Point(66, 87)]
        ]));
        this.Multistrokes.push(new Multistroke("N", useBoundedRotationInvariance, [
            [new Point(177, 92), new Point(177, 2)],
            [new Point(182, 1), new Point(246, 95)],
            [new Point(247, 87), new Point(247, 1)]
        ]));
        this.Multistrokes.push(new Multistroke("D", useBoundedRotationInvariance, [
            [new Point(345, 9), new Point(345, 87)],
            [new Point(351, 8), new Point(363, 8), new Point(372, 9), new Point(380, 11), new Point(386, 14), new Point(391, 17), new Point(394, 22), new Point(397, 28), new Point(399, 34), new Point(400, 42), new Point(400, 50), new Point(400, 56), new Point(399, 61), new Point(397, 66), new Point(394, 70), new Point(391, 74), new Point(386, 78), new Point(382, 81), new Point(377, 83), new Point(372, 85), new Point(367, 87), new Point(360, 87), new Point(355, 88), new Point(349, 87)]
        ]));
        this.Multistrokes.push(new Multistroke("P", useBoundedRotationInvariance, [
            [new Point(507, 8), new Point(507, 87)],
            [new Point(513, 7), new Point(528, 7), new Point(537, 8), new Point(544, 10), new Point(550, 12), new Point(555, 15), new Point(558, 18), new Point(560, 22), new Point(561, 27), new Point(562, 33), new Point(561, 37), new Point(559, 42), new Point(556, 45), new Point(550, 48), new Point(544, 51), new Point(538, 53), new Point(532, 54), new Point(525, 55), new Point(519, 55), new Point(513, 55), new Point(510, 55)]
        ]));
        this.Multistrokes.push(new Multistroke("X", useBoundedRotationInvariance, [
            [new Point(30, 146), new Point(106, 222)],
            [new Point(30, 225), new Point(106, 146)]
        ]));
        this.Multistrokes.push(new Multistroke("H", useBoundedRotationInvariance, [
            [new Point(188, 137), new Point(188, 225)],
            [new Point(188, 180), new Point(241, 180)],
            [new Point(241, 137), new Point(241, 225)]
        ]));
        this.Multistrokes.push(new Multistroke("I", useBoundedRotationInvariance, [
            [new Point(371, 149), new Point(371, 221)],
            [new Point(341, 149), new Point(401, 149)],
            [new Point(341, 221), new Point(401, 221)]
        ]));
        this.Multistrokes.push(new Multistroke("exclamation", useBoundedRotationInvariance, [
            [new Point(526, 142), new Point(526, 204)],
            [new Point(526, 221)]
        ]));
        this.Multistrokes.push(new Multistroke("line", useBoundedRotationInvariance, [
            [new Point(12, 347), new Point(119, 347)]
        ]));
        this.Multistrokes.push(new Multistroke("five-point star", useBoundedRotationInvariance, [
            [new Point(177, 396), new Point(223, 299), new Point(262, 396), new Point(168, 332), new Point(278, 332), new Point(184, 397)]
        ]));
        this.Multistrokes.push(new Multistroke("null", useBoundedRotationInvariance, [
            [new Point(382, 310), new Point(377, 308), new Point(373, 307), new Point(366, 307), new Point(360, 310), new Point(356, 313), new Point(353, 316), new Point(349, 321), new Point(347, 326), new Point(344, 331), new Point(342, 337), new Point(341, 343), new Point(341, 350), new Point(341, 358), new Point(342, 362), new Point(344, 366), new Point(347, 370), new Point(351, 374), new Point(356, 379), new Point(361, 382), new Point(368, 385), new Point(374, 387), new Point(381, 387), new Point(390, 387), new Point(397, 385), new Point(404, 382), new Point(408, 378), new Point(412, 373), new Point(416, 367), new Point(418, 361), new Point(419, 353), new Point(418, 346), new Point(417, 341), new Point(416, 336), new Point(413, 331), new Point(410, 326), new Point(404, 320), new Point(400, 317), new Point(393, 313), new Point(392, 312)],
            [new Point(418, 309), new Point(337, 390)]
        ]));
        this.Multistrokes.push(new Multistroke("arrowhead", useBoundedRotationInvariance, [
            [new Point(506, 349), new Point(574, 349)],
            [new Point(525, 306), new Point(584, 349), new Point(525, 388)]
        ]));
        this.Multistrokes.push(new Multistroke("pitchfork", useBoundedRotationInvariance, [
            [new Point(38, 470), new Point(36, 476), new Point(36, 482), new Point(37, 489), new Point(39, 496), new Point(42, 500), new Point(46, 503), new Point(50, 507), new Point(56, 509), new Point(63, 509), new Point(70, 508), new Point(75, 506), new Point(79, 503), new Point(82, 499), new Point(85, 493), new Point(87, 487), new Point(88, 480), new Point(88, 474), new Point(87, 468)],
            [new Point(62, 464), new Point(62, 571)]
        ]));
        this.Multistrokes.push(new Multistroke("six-point star", useBoundedRotationInvariance, [
            [new Point(177, 554), new Point(223, 476), new Point(268, 554), new Point(183, 554)],
            [new Point(177, 490), new Point(223, 568), new Point(268, 490), new Point(183, 490)]
        ]));
        this.Multistrokes.push(new Multistroke("asterisk", useBoundedRotationInvariance, [
            [new Point(325, 499), new Point(417, 557)],
            [new Point(417, 499), new Point(325, 557)],
            [new Point(371, 486), new Point(371, 571)]
        ]));
        this.Multistrokes.push(new Multistroke("half-note", useBoundedRotationInvariance, [
            [new Point(546, 465), new Point(546, 531)],
            [new Point(540, 530), new Point(536, 529), new Point(533, 528), new Point(529, 529), new Point(524, 530), new Point(520, 532), new Point(515, 535), new Point(511, 539), new Point(508, 545), new Point(506, 548), new Point(506, 554), new Point(509, 558), new Point(512, 561), new Point(517, 564), new Point(521, 564), new Point(527, 563), new Point(531, 560), new Point(535, 557), new Point(538, 553), new Point(542, 548), new Point(544, 544), new Point(546, 540), new Point(546, 536)]
        ]));
    };
    return Recognizer;
}());
exports.Recognizer = Recognizer;

},{}]},{},[5])(5)
});