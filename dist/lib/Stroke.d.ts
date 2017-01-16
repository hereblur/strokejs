import { Point } from "./Point";
import { Boundaries } from "./Boundaries";
declare class Stroke {
    private _points;
    private _boundaries;
    constructor(points: [number, number][]);
    append(point: any): Stroke;
    ramerDouglasPeucker(points: Point[], epsilon: number): Point[];
    point(position: number): Point;
    points(): Point[];
    getPointCount(): number;
    simplify(threshold?: number): this;
    clone(): Stroke;
    toArray(): [number, number][];
    scale(time: number): this;
    translate(x: Number, y: Number): this;
    boundaries(): Boundaries;
}
export { Stroke };
