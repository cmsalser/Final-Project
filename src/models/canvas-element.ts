import { Point } from "./point";

export class CanvasElement {
    constructor() { }

    draw(ctx: CanvasRenderingContext2D) {
        throw new Error('An undefined call to draw was made.');
    }
}