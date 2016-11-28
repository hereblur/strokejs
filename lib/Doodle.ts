"use strict";
import {Stroke} from "./Stroke";
import {Boundaries} from "./Boundaries";
import * as nDollar from "ndollar-js";

/**
*
* Class strokes-set
*
*/
class Doodle {

  /**
  * Array containing strokes.
  *
  * @Private
  *
  */
  private _strokes = [];
  private _boundaries = null;

  /**
  * Create strokes set from array of point array.
  *
  */
  constructor(strokes: [number, number][][]) {
    this._boundaries = new Boundaries();
    this._strokes = strokes.map( (points) => {
                        let stroke = new Stroke( points );
                        this._boundaries.include(stroke);
                        return stroke;
                    } );
  }

  /**
  * Simplify all strokes in the set
  *
  * @param threshold Threshold to drop un-needed points.
  *
  */
  simplify(threshold: number) {
    this._strokes.map( (stroke) => {
        return stroke.simplify( threshold );
    } );
  }

  /**
  * Get stroke at position
  *
  * @param position Position of stroke to get
  *
  */
  stroke(position: number): Stroke {
    return this._strokes[position] || null;
  }

  /**
  * Get all strokes
  *
  */
  strokes(): Stroke[] {
    return this._strokes.map((s) => { return s.clone(); });
  }

  /**
  * Get Stroke count
  *
  */
  getStrokeCount(): number {
    return this._strokes.length;
  }

  /**
  * Compare this Doodle to another
  *
  */
  compare(another: Doodle): number {

    if ( this.getStrokeCount() !== another.getStrokeCount() ) {
      return 0;
    }

    let me = this.strokes().map(function(stroke){
      return stroke.points().map(function(point){
        return new nDollar.Point(point.x, point.y);
      });
    });

    let you = another.strokes().map(function(stroke){
      return stroke.points().map(function(point){
        return new nDollar.Point(point.x, point.y);
      });
    });

    let recognizer = new nDollar.Recognizer();
    recognizer.AddGesture("correctDoodle", true, me);

    let result = recognizer.Recognize(you, true, true, true);

    if ( result.Name !== "correctDoodle" ) {
      return 0;
    }

    return result.Score;
  }

  /**
  * Add more point to stroke
  *
  * @param points Point to add or array of [x,y] coordinate.
  *
  */
  append(stroke): Doodle {
    if ( stroke instanceof Stroke ) {

      let lastpoint = this._strokes[this._strokes.length - 1];

      this._boundaries.include(stroke);
      this._strokes.push(stroke.clone());
      return this;
    }

    return this.append(new Stroke(stroke));
  }

  /**
  * Get boundaries of this Doodle
  *
  */
  boundaries(): Boundaries {
    return this._boundaries.clone();
  }

  /**
  * Scale this Doodle
  *
  * @param time Scale value
  */
  scale(time: number) {
    this._strokes.map((stroke) => {
      stroke.scale(time);
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
    this._strokes.map((stroke) => {
      stroke.translate(x, y);
    });

    this._boundaries.translate(x, y);

    return this;
  }

  /**
  * Clone this doodle
  *
  */
  clone(): Doodle {
      return new Doodle( this._strokes.map((s) => {
                return s.toArray();
             }) );
  }


  /**
  * return array of points
  *
  */
  toArray(): [number, number][][] {
    return this._strokes.map((stroke) => {
            return stroke.points().map((p) => {
                return p.toArray();
            });
    });
  }

}

export {Doodle};
