"use strict";
import {Stroke} from "./Stroke";
import {Point} from "./Point";
import {Boundaries} from "./Boundaries";
import {Doodle} from "./Doodle";
import * as MathH from "./MathHelper";

let __dbg: Function = () => {};

let setDebugCallback = (fn: Function) => { __dbg = fn; };

let getSection = (teacher: Point[], student: Point[], threshold: number): any => {

  let section = [];
  let start = 0;
  let prevPivot = -1;



  for (let i = 1; i < teacher.length; i++ ) {

    let guide: [number, number, number, number] = [teacher[ i - 1 ].x, teacher[ i - 1 ].y, teacher[ i ].x, teacher[ i ].y];

    __dbg && __dbg("checking POINT[T] " + (i - 1) + " - " + i, [teacher[i-1], teacher[i]]);

    if (student.length <= 2) {
      section.push( 0 );
      section.push( student.length - 1 );
      break;
    }

    for (let j = start; j < student.length - 1; j++) {

      if ( prevPivot < 0 ) {
        let angle = Math.abs(MathH.angleBetween2Lines( guide,
                                                      [student[j].x, student[j].y, student[j + 1].x, student[j + 1].y]));

        __dbg && __dbg("checking POINT[F] " + j + "/" + i , {start: start, prevPivot: prevPivot, angle: angle, threshold: Math.PI / 3 } );

        if ( Math.PI / 2 >= angle ) {
          prevPivot = j;
          section.push( j );
        }
      } else {
        let angle = Math.abs(MathH.angleBetween2Lines( guide,
                                                      [student[prevPivot].x, student[prevPivot].y, student[j].x, student[j].y]));
        let guideScore = (angle + 0.25) * student[ j ].distanceTo( teacher[ i - 1 ] );

        let nextGuideScore = Number.MAX_SAFE_INTEGER;
        if ( i < teacher.length - 1) {
          let nextGuide: [number, number, number, number] = [teacher[ i ].x, teacher[ i ].y, teacher[ i + 1 ].x, teacher[ i + 1 ].y];

          nextGuideScore = (Math.abs(MathH.angleBetween2Lines(  nextGuide,
                                                      [student[prevPivot].x, student[prevPivot].y, student[j].x, student[j].y]) + 0.25)
                         * student[ j ].distanceTo( teacher[ i + 1 ] ) );
         }

        __dbg && __dbg("checking POINT[N] " + j + "/" + i , {stu: student.length - 2, start: start, prevPivot: prevPivot, angle: angle, guideScore: guideScore, nextGuideScore: nextGuideScore} );

        if ( Math.PI / 2 > angle && nextGuideScore > guideScore && j < student.length - 2 ) {
          // continue
        } else {

          if ( j >= student.length - 2 ) {
            section.push( j + 1  );
            prevPivot = j + 1;
            start = j + 2 ;
          } else {
            section.push( j  );
            prevPivot = j ;
            start = j + 1;
          }

          __dbg && __dbg("Pushing section", section );

          break;
        }
      }
    }

    __dbg("WiSh" + (i + 1) + " - " + i, {start: start, student : student.length, prevPivot: prevPivot, section:section})
  }

  let result = {
    head: [],
    body: [],
    tail: [],
  };
  if ( section[0] > 0 ) {
    result.head = student.slice(0, section[0]);
  }

  let prev = -1;
  for (let index of section) {

    if ( prev >= 0 ) {
      result.body.push( student.slice( prev, index + 1 ) );
    }


    prev = index;
    __dbg && __dbg ("BUILDING BODY", {prev : prev, index : index});
  }

  result.tail = student.slice( prev );

  return result;
};

let compareStrokeToGuide = (stroke: Point[], guide: [Point, Point], threshold: number): number => {
  let prevPoint = null;

  let diffAngles: number[] = [];
  let diffDistance = [];
  for (let point of stroke) {
    if ( prevPoint ) {
      diffAngles.push( MathH.angleBetween2Lines( [guide[0].x, guide[0].y, guide[1].x, guide[1].y],
                                                  [prevPoint.x, prevPoint.y, point.x, point.y]
                                               ));
    }

    diffDistance.push( point.distanceToLine(guide) );

    prevPoint = point;
  }

  diffAngles = diffAngles.map((angle) => { // scale angle to score space: 0rad => 0.00, 45deg => 0.5, 90deg => 1.00, 180deg => 2.00
    return Math.abs(angle) / (Math.PI / 2);
  });

  diffDistance = diffDistance.map((distance) => { // scale distances to score space
    return distance / threshold;
  });

  __dbg && __dbg("compareStrokeToGuide" , JSON.stringify( [diffAngles, diffDistance, MathH.standardDeviation( diffAngles ) , MathH.standardDeviation( diffDistance ) ] ) );

  return (( MathH.standardDeviation( diffAngles ) || 1) + (MathH.standardDeviation( diffDistance ) || 1) ) / 2;
};

let diffStroke = (a: Stroke, b: Stroke, i: any, threshold: number): any => {
  let teacher = a;
  let student = b;

  let scale = a.boundaries().width() > b.boundaries().width() ? a.boundaries().width() / b.boundaries().width() : a.boundaries().height() / b.boundaries().height();

  a.translate(-a.boundaries().left,  -a.boundaries().top);
  b.scale( scale );
  b.translate(-b.boundaries().left,  -b.boundaries().top);

  if (teacher.getPointCount() > student.getPointCount()) {
    [teacher, student] = [student, teacher];
  }

  student.simplify( 0.01 );

  __dbg && __dbg("simpliflied", {stroke: i, sections : student.points()} );
  let sections = getSection( teacher.points(), student.points(), threshold);
  __dbg && __dbg("sections", {stroke: i, sections : sections, teacher: teacher.toArray() } );

  let distance = 0;
  let lineCount = 0;
  for (let i in sections.body ) {
    for (let point of sections.body[i]){
      distance += compareStrokeToGuide(sections.body[i], [teacher.point( Number(i) ), teacher.point( Number(i) + 1 ) ], threshold);
      lineCount ++;
    }
  }

  for (let point of sections.head ) {
    distance += point.distanceTo( teacher.point(0) );
    lineCount ++;
  }
  for (let point of sections.tail ) {
    distance += point.distanceTo( teacher.point( teacher.getPointCount() - 1 ) );
    lineCount ++;
  }

  __dbg("result of section ", [distance / lineCount, distance, lineCount]);
  return {
    score : distance / lineCount,
    scale : scale
  };
};

let diff = (a: Doodle, b: Doodle): number => {
  if (a.getStrokeCount() !== b.getStrokeCount()) return 101;

  let strokeA = a.strokes();
  let strokeB = b.strokes();
  let bound = a.boundaries().include(b.boundaries());

  let distance = 0;
  let scales = [];
  for (let i in strokeA) {
    let dis =  diffStroke(strokeA[i], strokeB[i], i, bound.width() * 0.33);
    __dbg("STROKE" + i, dis / bound.width());
    distance = Math.max( dis.score, distance);
    scales.push( Math.abs(dis.scale - 1) );
  }

  distance *= 10 / bound.width();
  let scaleDistance = MathH.standardDeviation( scales ) * 0.1;

  __dbg("result of doodle ", [distance + scaleDistance, distance, scaleDistance, scales]);
  return Math.min(distance + scaleDistance, 100);
};

export {diff, setDebugCallback};
