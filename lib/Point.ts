"use strict";

/**
* class Point.
*/

class Point {
  x = 0;
  y = 0;

  /**
  * Create a point from [x,y] array.
  *
  * @param coord Array of an [x,y] pair.
  *
  */
  constructor(coord: [number, number]) {
    this.x = coord[0] as number;
    this.y = coord[1] as number;
  }

  /**
  *
  * Return original array
  *
  */
  toArray(): [number, number] {
    return [this.x, this.y];
  }


  /**
  * Check weather Point is on Line's perpendicular projection.
  * @Private
  */
  _isInsideLinePerpendicular(line: Point[]): boolean {
    let line1 = line[0];
    let line2 = line[1];

    let L2 = (((line2.x - line1.x) * (line2.x - line1.x)) + ((line2.y - line1.y) * (line2.y - line1.y)));
    if (L2 === 0) return false;
    let r = (((this.x - line1.x) * (line2.x - line1.x)) + ((this.y - line1.y) * (line2.y - line1.y))) / L2;

    return (0 <= r) && (r <= 1);
  }

  /**
  * Calculate distance to another Point
  *
  * @param point Point.
  *
  */
  distanceTo( point: Point): number {
     return Math.sqrt( Math.pow((this.x - point.x), 2) + Math.pow(( this.y - point.y), 2) );
  }


  /**
  * Calculate distance to a finite line
  *
  * @param Array of an endpoint of line [start, end].
  *
  */
  distanceToLine( line: Point[]): number {

      if ( !this._isInsideLinePerpendicular(line) ) {
          return Math.min( this.distanceTo(line[0]), this.distanceTo(line[1]));
      }

      let x = this.x;
      let y = this.y;
      let x1 = line[0].x;
      let y1 = line[0].y;
      let x2 = line[1].x;
      let y2 = line[1].y;

      let A = this.x - line[0].x;
      let B = this.y - line[0].y;
      let C = line[1].x - line[0].x;
      let D = line[1].y - line[0].y;

      let dot = A * C + B * D;
      let len_sq = C * C + D * D;
      let param = -1;
      if (len_sq !== 0) // in case of 0 length line
          param = dot / len_sq;

      let xx, yy;

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

      let dx = x - xx;
      let dy = y - yy;

      return Math.sqrt(dx * dx + dy * dy);
  }

  /**
  *
  * Create a clone of this point.
  *
  */
  clone(): Point {
    return new Point(this.toArray());
  }
}

export {Point};
