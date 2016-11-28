'use strict';
var Point = require("../dist/lib/Point").Point;

test('should create point', () => {
  var point = new Point([1,2]);
  expect(point.x).toBe(1)
  expect(point.y).toBe(2)
});

test('should toArray() return correct array', () => {
  var point = new Point([100,200]);
  var pointArr = point.toArray();
  expect(pointArr.length).toBe(2);
  expect(pointArr[0]).toBe(100);
  expect(pointArr[1]).toBe(200);
});


test('should clone() immutable clone the point', () => {
  var point = new Point([100,200]);
  var clone = point.clone();

  expect(clone.x).toBe(point.x);
  expect(clone.y).toBe(point.y);

  clone.x = 200;

  expect(clone.x).toBe(200);
  expect(clone.y).toBe(point.y);
  expect(point.x).toBe(100)
  expect(point.y).toBe(200)
});


test('should calculate correct distance to line', () => {
  var point = new Point([50,50]);
  var distanceX1 = point.distanceToLine( [new Point([0, 0]), new Point([0, 50]) ])
  var distanceX2 = point.distanceToLine( [new Point([0, 0]), new Point([0, 100])])
  var distanceY1 = point.distanceToLine( [new Point([0, 0]), new Point([50, 0]) ])
  var distanceY2 = point.distanceToLine( [new Point([0, 0]), new Point([100, 0])])


  point = new Point([80,60]);
  var distanceF1 = point.distanceToLine( [new Point([100, 0]), new Point([0, 100])])

  expect(distanceX1).toBe(50)
  expect(distanceX2).toBe(50)
  expect(distanceY1).toBe(50)
  expect(distanceY2).toBe(50)
  expect(Math.abs(distanceF1 - 28.2842)).toBeLessThan(0.001)
});

test('should calculate correct distance to line that`s not on perpendicular', () => {
  var point = new Point([50,50]);
  var distanceX1 = point.distanceToLine( [new Point([100, 0]), new Point([200, 0]) ])
  var distanceX2 = point.distanceToLine( [new Point([0, 100]), new Point([-50, 150])])

  point = new Point([50,300]);
  var distanceF1 = point.distanceToLine( [new Point([0, 100]), new Point([100, 0])])

  expect(Math.abs(distanceX1 - 70.7106)).toBeLessThan(0.001)
  expect(Math.abs(distanceX2 - 70.7106)).toBeLessThan(0.001)
  expect(Math.abs(distanceF1 - 206.1552)).toBeLessThan(0.001)
});
