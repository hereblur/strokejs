declare class Boundaries {
    left: number;
    top: number;
    right: number;
    bottom: number;
    include(obj: any): any;
    scale(time: number): this;
    width(): number;
    height(): number;
    translate(x: number, y: number): this;
    clone(): Boundaries;
}
export { Boundaries };
