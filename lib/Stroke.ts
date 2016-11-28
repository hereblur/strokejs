"use strict";
import {Point} from "./Point";
import {Boundaries} from "./Boundaries";

/**
*
* Class of a stroke containing multiple points
*
*/
class Stroke {

  /**
  * Array containing points.
  *
  * @Private
  *
  */
  private _points = [];
  private _boundaries = null;

  /**
  * Create stroke from array of points.
  *
  * @param points Array series of [x,y] pairs.
  *
  */
  constructor(points: [number, number][]) {
    this._boundaries = new Boundaries();
    this._points = points.map((pointCoord) =>  {
      let point = new Point(pointCoord);
      this._boundaries.include(point);
      return point;
    });
  }

  /**
  * Add more point to stroke
  *
  * @param points Point to add or array of [x,y] coordinate.
  *
  */
  append(point): Stroke {
    if ( point instanceof Point ) {

      let lastpoint = this._points[this._points.length - 1];
      if (lastpoint && lastpoint.x === point.x && lastpoint.y === point.y) return this;

      this._boundaries.include(point);
      this._points.push(point.clone());
      return this;
    }

    return this.append(new Point(point));
  }

  /**
  *
  * Simplify a line using Ramer–Douglas–Peucker's algorithm.
  * https://en.wikipedia.org/wiki/Ramer–Douglas–Peucker_algorithm
  *
  * @Private
  * @param points Series of point to simplify
  * @param epsilon Threshold to keep or drop points.
  */
  ramerDouglasPeucker(points: Point[], epsilon: number): Point[] {
    let max_distance = 0,
        middle = -1,
        end = points.length - 1;

    for ( let i = 1 ; i <= end - 1 ; i++ ) {
      let distance = points[ i ].distanceToLine( [points[0], points[end]] );
      if ( distance > max_distance ) {
        middle = i;
        max_distance = distance;
      }
    }

    if ( max_distance > epsilon ) {
      let left  = points.slice(0, middle + 1);
      let right = points.slice(middle);
      left  = this.ramerDouglasPeucker( left , epsilon);
      right = this.ramerDouglasPeucker( right, epsilon);

      return left.slice(0, -1).concat(right);
    }

    return [points[0], points[end]];
  }

  /**
  * Get point at position
  *
  * @param position Position of point to get
  *
  */
  point(position: number): Point {
    return this._points[position] || null;
  }


  /**
  * Get all points
  *
  */
  points(): Point[] {
    return this._points.map((p) => {return p.clone(); });
  }

  /**
  * Get Point count
  *
  */
  getPointCount(): number {
    return this._points.length;
  }

  /**
  * Simplify all strokes in the set
  *
  * @param threshold Threshold to drop un-needed points in pixel, default: 5px.
  *
  */
  simplify(threshold: number = 5) {
    let unique = this._points.map((point, idx) => {
                                                      if ( idx > 0 && point.x === this._points[idx - 1].x && point.y === this._points[idx - 1].y ) {
                                                        return null;
                                                      }

                                                      return point.clone();
                                                  })
                                                  .filter((p) => { return !!p; });
    if (unique.length > 1)
      this._points = this.ramerDouglasPeucker(unique, threshold);
    return this;
  }

  /**
  * Create a clone of this point.
  *
  */
  clone(): Stroke {
    return new Stroke( this._points.map((p) => {
                                                return p.toArray();
                                              }) );
  }

  /**
  * return array of points
  *
  */
  toArray(): [number, number][] {
    return this._points.map((p) => {
            return p.toArray();
          });
  }

  /**
  * Scale this stroke
  *
  * @param time Scale value
  */
  scale(time: number) {
    this._points.map((p) => {
      p.x *=  time;
      p.y *=  time;
    });

    this._boundaries.scale(time);

    return this;
  }

  /**
  * Move stroke by offset
  *
  * @param x Move on X-axis
  * @param y Move on Y-axis
  */
  translate(x: Number, y: Number) {
    this._points.map((p) => {
      p.x += x;
      p.y += y;
    });

    this._boundaries.translate(x, y);

    return this;
  }

  /**
  * Return boundaries of this stroke.
  */
  boundaries(): Boundaries {
    return this._boundaries.clone();
  }
}

export {Stroke};
