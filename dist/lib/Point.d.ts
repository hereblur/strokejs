declare class Point {
    x: number;
    y: number;
    constructor(coord: [number, number]);
    toArray(): [number, number];
    _isInsideLinePerpendicular(line: Point[]): boolean;
    distanceTo(point: Point): number;
    distanceToLine(line: Point[]): number;
    clone(): Point;
}
export { Point };
