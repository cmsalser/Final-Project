import { CanvasElement } from "./canvas-element";
import { Render } from "./render";
import { Point } from "./point";

export class Circle extends CanvasElement {
    private center: Point;
    private radius: number;
    private text?: string;

    constructor(center: Point, radius: number, text?: string) {
        super();
        this.center = center;
        this.radius = radius;
        this.text = text;
    }

    override touchesPoint(point: Point): boolean {
        return this.center.distanceTo(point) < this.radius;
    }

    override draw(tool: Render): void {
        tool.ctx.beginPath();
        tool.ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
        if (this.text) {
            tool.ctx.textAlign = 'center';  
            tool.ctx.fillText(this.text, this.center.x, this.center.y);
        }
        tool.ctx.stroke();
    }

    getCenter(): Point {
        return this.center;
    }
}