"use strict";
var MathH = require("./MathHelper");
var __dbg = function () { };
var setDebugCallback = function (fn) { __dbg = fn; };
exports.setDebugCallback = setDebugCallback;
var getSection = function (teacher, student, threshold) {
    var section = [];
    var start = 0;
    var prevPivot = -1;
    for (var i = 1; i < teacher.length; i++) {
        var guide = [teacher[i - 1].x, teacher[i - 1].y, teacher[i].x, teacher[i].y];
        __dbg && __dbg("checking POINT[T] " + (i - 1) + " - " + i, [teacher[i - 1], teacher[i]]);
        if (student.length <= 2) {
            section.push(0);
            section.push(student.length - 1);
            break;
        }
        for (var j = start; j < student.length - 1; j++) {
            if (prevPivot < 0) {
                var angle = Math.abs(MathH.angleBetween2Lines(guide, [student[j].x, student[j].y, student[j + 1].x, student[j + 1].y]));
                __dbg && __dbg("checking POINT[F] " + j + "/" + i, { start: start, prevPivot: prevPivot, angle: angle, threshold: Math.PI / 3 });
                if (Math.PI / 2 >= angle) {
                    prevPivot = j;
                    section.push(j);
                }
            }
            else {
                var angle = Math.abs(MathH.angleBetween2Lines(guide, [student[prevPivot].x, student[prevPivot].y, student[j].x, student[j].y]));
                var guideScore = (angle + 0.25) * student[j].distanceTo(teacher[i - 1]);
                var nextGuideScore = Number.MAX_SAFE_INTEGER;
                if (i < teacher.length - 1) {
                    var nextGuide = [teacher[i].x, teacher[i].y, teacher[i + 1].x, teacher[i + 1].y];
                    nextGuideScore = (Math.abs(MathH.angleBetween2Lines(nextGuide, [student[prevPivot].x, student[prevPivot].y, student[j].x, student[j].y]) + 0.25)
                        * student[j].distanceTo(teacher[i + 1]));
                }
                __dbg && __dbg("checking POINT[N] " + j + "/" + i, { stu: student.length - 2, start: start, prevPivot: prevPivot, angle: angle, guideScore: guideScore, nextGuideScore: nextGuideScore });
                if (Math.PI / 2 > angle && nextGuideScore > guideScore && j < student.length - 2) {
                }
                else {
                    if (j >= student.length - 2) {
                        section.push(j + 1);
                        prevPivot = j + 1;
                        start = j + 2;
                    }
                    else {
                        section.push(j);
                        prevPivot = j;
                        start = j + 1;
                    }
                    __dbg && __dbg("Pushing section", section);
                    break;
                }
            }
        }
        __dbg("WiSh" + (i + 1) + " - " + i, { start: start, student: student.length, prevPivot: prevPivot, section: section });
    }
    var result = {
        head: [],
        body: [],
        tail: [],
    };
    if (section[0] > 0) {
        result.head = student.slice(0, section[0]);
    }
    var prev = -1;
    for (var _i = 0, section_1 = section; _i < section_1.length; _i++) {
        var index = section_1[_i];
        if (prev >= 0) {
            result.body.push(student.slice(prev, index + 1));
        }
        prev = index;
        __dbg && __dbg("BUILDING BODY", { prev: prev, index: index });
    }
    result.tail = student.slice(prev);
    return result;
};
var compareStrokeToGuide = function (stroke, guide, threshold) {
    var prevPoint = null;
    var diffAngles = [];
    var diffDistance = [];
    for (var _i = 0, stroke_1 = stroke; _i < stroke_1.length; _i++) {
        var point = stroke_1[_i];
        if (prevPoint) {
            diffAngles.push(MathH.angleBetween2Lines([guide[0].x, guide[0].y, guide[1].x, guide[1].y], [prevPoint.x, prevPoint.y, point.x, point.y]));
        }
        diffDistance.push(point.distanceToLine(guide));
        prevPoint = point;
    }
    diffAngles = diffAngles.map(function (angle) {
        return Math.abs(angle) / (Math.PI / 2);
    });
    diffDistance = diffDistance.map(function (distance) {
        return distance / threshold;
    });
    __dbg && __dbg("compareStrokeToGuide", JSON.stringify([diffAngles, diffDistance, MathH.standardDeviation(diffAngles), MathH.standardDeviation(diffDistance)]));
    return ((MathH.standardDeviation(diffAngles) || 1) + (MathH.standardDeviation(diffDistance) || 1)) / 2;
};
var diffStroke = function (a, b, i, threshold) {
    var teacher = a;
    var student = b;
    var scale = a.boundaries().width() > b.boundaries().width() ? a.boundaries().width() / b.boundaries().width() : a.boundaries().height() / b.boundaries().height();
    a.translate(-a.boundaries().left, -a.boundaries().top);
    b.scale(scale);
    b.translate(-b.boundaries().left, -b.boundaries().top);
    if (teacher.getPointCount() > student.getPointCount()) {
        _a = [student, teacher], teacher = _a[0], student = _a[1];
    }
    student.simplify(0.01);
    __dbg && __dbg("simpliflied", { stroke: i, sections: student.points() });
    var sections = getSection(teacher.points(), student.points(), threshold);
    __dbg && __dbg("sections", { stroke: i, sections: sections, teacher: teacher.toArray() });
    var distance = 0;
    var lineCount = 0;
    for (var i_1 in sections.body) {
        for (var _i = 0, _b = sections.body[i_1]; _i < _b.length; _i++) {
            var point = _b[_i];
            distance += compareStrokeToGuide(sections.body[i_1], [teacher.point(Number(i_1)), teacher.point(Number(i_1) + 1)], threshold);
            lineCount++;
        }
    }
    for (var _c = 0, _d = sections.head; _c < _d.length; _c++) {
        var point = _d[_c];
        distance += point.distanceTo(teacher.point(0));
        lineCount++;
    }
    for (var _e = 0, _f = sections.tail; _e < _f.length; _e++) {
        var point = _f[_e];
        distance += point.distanceTo(teacher.point(teacher.getPointCount() - 1));
        lineCount++;
    }
    __dbg("result of section ", [distance / lineCount, distance, lineCount]);
    return {
        score: distance / lineCount,
        scale: scale
    };
    var _a;
};
var diff = function (a, b) {
    if (a.getStrokeCount() !== b.getStrokeCount())
        return 101;
    var strokeA = a.strokes();
    var strokeB = b.strokes();
    var bound = a.boundaries().include(b.boundaries());
    var distance = 0;
    var scales = [];
    for (var i in strokeA) {
        var dis = diffStroke(strokeA[i], strokeB[i], i, bound.width() * 0.33);
        __dbg("STROKE" + i, dis / bound.width());
        distance = Math.max(dis.score, distance);
        scales.push(Math.abs(dis.scale - 1));
    }
    distance *= 10 / bound.width();
    var scaleDistance = MathH.standardDeviation(scales) * 0.1;
    __dbg("result of doodle ", [distance + scaleDistance, distance, scaleDistance, scales]);
    return Math.min(distance + scaleDistance, 100);
};
exports.diff = diff;
