'use strict';
var Doodle = require("../dist/lib/Doodle").Doodle;

var stroke1 = [
  [10, 100],
  [20, 100],
  [20, 100],
  [30, 100],
  [40, 100],
  [50, 100]
];
var stroke2 = [

  [10, 100],
  [20, 105],
  [30, 110],
  [40, 105],
  [50, 100]
];

test('should create Doodle from given array', () => {
  var doodle = new Doodle( [stroke1, stroke2] );
  expect(doodle.getStrokeCount()).toBe( 2 );
  expect(doodle.stroke(0).getPointCount()).toBe( stroke1.length );
  expect(doodle.stroke(1).getPointCount()).toBe( stroke2.length );
});

test('should clone', () => {
  var doodle = new Doodle( [stroke1, stroke2] );
  var st3 = [ [ 5, 3], [70, 80] ];
  expect(doodle.getStrokeCount()).toBe( 2 );
  doodle.append(st3);

  var clone = doodle.clone();

  expect(clone.getStrokeCount()).toBe( 3 );
  expect(clone.stroke(0).getPointCount()).toBe( stroke1.length );
  expect(clone.stroke(1).getPointCount()).toBe( stroke2.length );
  expect(clone.stroke(2).getPointCount()).toBe( st3.length );
});


test('should append()', () => {
  var doodle = new Doodle( [stroke1, stroke2] );
  var st3 = [ [ 5, 3], [70, 80] ];

  expect(doodle.getStrokeCount()).toBe( 2 );

  doodle.append(st3);

  expect(doodle.getStrokeCount()).toBe( 3 );

  expect(doodle.stroke(0).getPointCount()).toBe( stroke1.length );
  expect(doodle.stroke(1).getPointCount()).toBe( stroke2.length );
  expect(doodle.stroke(2).getPointCount()).toBe( st3.length );
});


test('should simplify all strokes', () => {
  var doodle = new Doodle( [stroke1, stroke2] );
  doodle.simplify()
  expect(doodle.getStrokeCount()).toBe( 2 );
  expect(doodle.stroke(0).getPointCount()).toBe( 2 );
  expect(doodle.stroke(1).getPointCount()).toBe( 3 );
});

test('should scale()', () => {
    var st1 = [ [10, 10], [50, 10] ];
    var st2 = [ [50, 60], [10, 60] ];
    var strokes = [st1, st2];

    var doodle = new Doodle( strokes );
    doodle.scale( 0.50 )
    for(var i=0;i<doodle.getStrokeCount();i++){
      var str = doodle.stroke(i);
      for(var p=0;p<str.getPointCount();p++){
        expect(str.point(p).x).toBe(strokes[i][p][0]/2);
        expect(str.point(p).y).toBe(strokes[i][p][1]/2);
      }
    }
});

test('should translate()', () => {
    var st1 = [ [10, 10], [50, 10] ];
    var st2 = [ [50, 60], [10, 60] ];
    var strokes = [st1, st2];

    var doodle = new Doodle( strokes );
    doodle.translate( 10, 20 )
    for(var i=0;i<doodle.getStrokeCount();i++){
      var str = doodle.stroke(i);
      for(var p=0;p<str.getPointCount();p++){
        expect(str.point(p).x).toBe(strokes[i][p][0] + 10);
        expect(str.point(p).y).toBe(strokes[i][p][1] + 20);
      }
    }
});

test('should boundaries()', () => {
  var st1 = [ [10, 10], [50, 10] ];
  var st2 = [ [50, 60], [10, 60] ];
  var st3 = [ [ 5, 3], [70, 80] ];
  var strokes = [st1, st2];

  var doodle = new Doodle( strokes );
  var bound = doodle.boundaries();

  expect(bound.left).toBe(st1[0][0]);
  expect(bound.top ).toBe(st1[0][1]);
  expect(bound.right).toBe(st2[0][0]);
  expect(bound.bottom ).toBe(st2[0][1]);

  doodle.translate( 10, 20 )
  bound = doodle.boundaries();
  expect(bound.left).toBe(st1[0][0] +10);
  expect(bound.top ).toBe(st1[0][1] +20);
  expect(bound.right).toBe(st2[0][0] +10);
  expect(bound.bottom ).toBe(st2[0][1] +20);

  doodle.translate( -10, -20 );
  doodle.scale( 2 );
  bound = doodle.boundaries();
  expect(bound.left).toBe(st1[0][0] *2);
  expect(bound.top ).toBe(st1[0][1] *2);
  expect(bound.right).toBe(st2[0][0] *2);
  expect(bound.bottom ).toBe(st2[0][1] *2);

  doodle.scale( 0.5 )
        .append( st3 );
  bound = doodle.boundaries();
  expect(bound.left).toBe(st3[0][0]);
  expect(bound.top ).toBe(st3[0][1]);
  expect(bound.right).toBe(st3[1][0]);
  expect(bound.bottom ).toBe(st3[1][1]);
});

test('shoud compare()', ()=>{
  var guildStrokes = [
                      [[10 ,10], [50, 10]],
                      [[30 ,5],  [30, 60]]
                    ];
  var notBadStrokes = [
                      [[9 ,11], [50,  5]],
                      [[32 , 2],  [35, 57]]
                    ];
  var badStrokes = [
                      [[10 ,10], [50, 70]],
                      [[0 ,5],  [30, 20]]
                    ];
  var teacher = new Doodle( guildStrokes );
  var student = new Doodle( guildStrokes );

  expect( teacher.compare(student) ).toBeGreaterThan( 10000 ); // Perfectly matches

  student = new Doodle( notBadStrokes );
  expect( teacher.compare(student) ).toBeGreaterThan( 8 );

  student = new Doodle( badStrokes );
  expect( teacher.compare(student) ).toBeLessThan( 0.5 );
});
