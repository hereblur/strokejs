"use strict";

import {Point} from "./Point";
import {Doodle} from "./Doodle";
import {Stroke} from "./Stroke";
/**
* class Point.
*/

class Boundaries {
  left   = Number.MAX_SAFE_INTEGER;
  top    = Number.MAX_SAFE_INTEGER;
  right  = 0;
  bottom = 0;

  /**
  * Recalculate boundaries to include new object
  *
  */
  include( obj ) {
    if ( obj instanceof Point ) {
      this.left   = Math.min( obj.x, this.left   );
      this.top    = Math.min( obj.y, this.top    );
      this.right  = Math.max( obj.x, this.right  );
      this.bottom = Math.max( obj.y, this.bottom );
      return this;
    }else
    if ( obj instanceof Boundaries ) {
      this.left   = Math.min( obj.left,   this.left   );
      this.top    = Math.min( obj.top,    this.top    );
      this.right  = Math.max( obj.right,  this.right  );
      this.bottom = Math.max( obj.bottom, this.bottom );
      return this;
    }
    if ( obj instanceof Stroke || obj instanceof Doodle ) {
      return this.include( obj.boundaries() );
    }

    throw new TypeError("Not support finding boundaries of this object: " + typeof obj);
  }

  /**
  * Scale this boundaries
  *
  * @param time Scale value
  */
  scale(time: number) {
    this.left   *= time;
    this.top    *= time;
    this.right  *= time;
    this.bottom *= time;

    return this;
  }

  /**
  * get Width
  *
  */
  width() {
    return this.right - this.left;
  }

  /**
  * get Height
  *
  */
  height() {
    return this.bottom - this.top;
  }

  /**
  * Move boundaries by offset
  *
  * @param x Move on X-axis
  * @param y Move on Y-axis
  */
  translate(x: number, y: number) {
    this.left   += x;
    this.top    += y;
    this.right  += x;
    this.bottom += y;

    return this;
  }

  /**
  * Clone
  *
  */
  clone (): Boundaries {
    let b = new Boundaries();
    b.include(this);
    return b;
  }

}

export {Boundaries};
