import { Doodle } from "./Doodle";
declare let setDebugCallback: (fn: Function) => void;
declare let diff: (a: Doodle, b: Doodle) => number;
export { diff, setDebugCallback };
