"use strict";
var angleBetween2Lines = function (line1, line2) {
    var angle1 = Math.atan2(line1[1] - line1[3], line1[0] - line1[2]);
    var angle2 = Math.atan2(line2[1] - line2[3], line2[0] - line2[2]);
    angle1 -= angle2;
    if (angle1 < -Math.PI)
        angle1 += 2 * Math.PI;
    if (angle1 > Math.PI)
        angle1 -= 2 * Math.PI;
    return angle1;
};
exports.angleBetween2Lines = angleBetween2Lines;
var standardDeviation = function (values) {
    var summary = values.reduce(function (sum, val) { return sum + Math.pow(val, 2); }, 0);
    return Math.sqrt(summary / values.length);
};
exports.standardDeviation = standardDeviation;
