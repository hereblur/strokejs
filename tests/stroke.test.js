'use strict';
var Stroke = require("../dist/lib/Stroke").Stroke;

var straightLines = [
  [10, 100],
  [20, 100],
  [20, 100],
  [30, 100],
  [40, 100],
  [50, 100]
];

var wavyLines = [
  [10, 100],
  [20, 105],
  [30, 110],
  [40, 105],
  [50, 100]
];

var rectangle = [
  [10, 10],
  [50, 10],
  [50, 60],
  [10, 60],
];


test('should create stroke from given array', () => {
  var stroke = new Stroke( straightLines );

  expect(stroke.getPointCount()).toBe( straightLines.length );

  for(var i=0;i<straightLines.length;i++){
    expect(stroke.point(i).x).toBe(straightLines[i][0]);
    expect(stroke.point(i).y).toBe(straightLines[i][1]);
  }
});

test('should simplify() drops un-needed points', () => {
  var stroke = new Stroke( straightLines );
  stroke.simplify();
  expect(stroke.getPointCount()).toBe( 2 );

  expect(stroke.point(0).x).toBe(straightLines[0][0]);
  expect(stroke.point(0).y).toBe(straightLines[0][1]);
  expect(stroke.point(1).x).toBe(straightLines[straightLines.length - 1][0]);
  expect(stroke.point(1).y).toBe(straightLines[straightLines.length - 1][1]);
});

test('should simplify() keeps significant points', () => {
  var stroke = new Stroke( wavyLines );
  stroke.simplify();
  expect(stroke.getPointCount()).toBe( 3 );

  expect(stroke.point(0).x).toBe(wavyLines[0][0]);
  expect(stroke.point(0).y).toBe(wavyLines[0][1]);
  expect(stroke.point(1).x).toBe(wavyLines[2][0]);
  expect(stroke.point(1).y).toBe(wavyLines[2][1]);
  expect(stroke.point(2).x).toBe(wavyLines[wavyLines.length - 1][0]);
  expect(stroke.point(2).y).toBe(wavyLines[wavyLines.length - 1][1]);
});

test('should scale()', () => {
    var stroke = new Stroke( rectangle );
    stroke.scale( 0.50 )
    for(var i=0;i<rectangle.length;i++){
      expect(stroke.point(i).x).toBe(rectangle[i][0]/2);
      expect(stroke.point(i).y).toBe(rectangle[i][1]/2);
    }
});

test('should translate()', () => {
    var stroke = new Stroke( rectangle );
    stroke.translate( 10, 20 )
    for(var i=0;i<rectangle.length;i++){
      expect(stroke.point(i).x).toBe(rectangle[i][0] +10 );
      expect(stroke.point(i).y).toBe(rectangle[i][1] +20 );
    }
});

test('should boundaries()', () => {
    var stroke = new Stroke( rectangle );
    var bound = stroke.boundaries();

    expect(bound.left).toBe(rectangle[0][0]);
    expect(bound.top ).toBe(rectangle[0][1]);
    expect(bound.right).toBe(rectangle[2][0]);
    expect(bound.bottom ).toBe(rectangle[2][1]);

    stroke.translate( 10, 20 )
    bound = stroke.boundaries();
    expect(bound.left).toBe(rectangle[0][0] +10);
    expect(bound.top ).toBe(rectangle[0][1] +20);
    expect(bound.right).toBe(rectangle[2][0] +10);
    expect(bound.bottom ).toBe(rectangle[2][1] +20);

    stroke.translate( -10, -20 );
    stroke.scale( 2 );
    bound = stroke.boundaries();
    expect(bound.left).toBe(rectangle[0][0] *2);
    expect(bound.top ).toBe(rectangle[0][1] *2);
    expect(bound.right).toBe(rectangle[2][0] *2);
    expect(bound.bottom ).toBe(rectangle[2][1] *2);

    stroke.scale( 0.5 )
          .append( [1, 11] )
          .append( [50, 80] );
    bound = stroke.boundaries();
    expect(bound.left).toBe(1);
    expect(bound.top ).toBe(rectangle[0][1]);
    expect(bound.right).toBe(rectangle[2][0]);
    expect(bound.bottom ).toBe(80);
});
