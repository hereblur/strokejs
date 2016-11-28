"use strict";

let angleBetween2Lines = (line1: [number, number, number, number], line2: [number, number, number, number]): number => {
    let angle1 = Math.atan2(line1[1] - line1[3],
                               line1[0] - line1[2]);
    let angle2 = Math.atan2(line2[1] - line2[3],
                               line2[0] - line2[2]);

    angle1 -= angle2;
    if ( angle1 < -Math.PI )
      angle1 += 2 * Math.PI;
    if ( angle1 > Math.PI )
      angle1 -= 2 * Math.PI;
    return angle1;
};


let standardDeviation = (values: number[]): number => {
  let summary = values.reduce((sum, val) => { return sum + Math.pow(val, 2); }, 0);
  return Math.sqrt(summary / values.length);
};

export {angleBetween2Lines, standardDeviation}
