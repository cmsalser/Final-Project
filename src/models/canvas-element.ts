import { Render } from "./render";
import { Point } from "./point";

export class CanvasElement {
    constructor() { }

    draw(tool: Render) {
        throw new Error('An undefined call to draw was made.');
    }
}