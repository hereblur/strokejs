import { Stroke } from "./Stroke";
import { Boundaries } from "./Boundaries";
declare class Doodle {
    private _strokes;
    private _boundaries;
    constructor(strokes: [number, number][][]);
    simplify(threshold: number): void;
    stroke(position: number): Stroke;
    strokes(): Stroke[];
    getStrokeCount(): number;
    compare(another: Doodle): number;
    append(stroke: any): Doodle;
    boundaries(): Boundaries;
    scale(time: number): this;
    translate(x: Number, y: Number): this;
    clone(): Doodle;
    toArray(): [number, number][][];
}
export { Doodle };
