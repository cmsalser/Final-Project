import { CanvasElement } from "./canvas-element";
import { Render } from "./render";
import { Point } from "./point";

export class Circle extends CanvasElement {
    private center: Point;
    private radius: number;
    private text?: string;
    private status: boolean;

    constructor(center: Point, radius: number, text?: string) {
        super();
        this.center = center;
        this.radius = radius;
        this.text = text;
        this.status = false;
    }

    override touchesPoint(point: Point): boolean {
        return this.center.distanceTo(point) < this.radius;
    }

    override draw(tool: Render): void {
        tool.ctx.beginPath();
        tool.ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
        if (this.text) {
            tool.ctx.textAlign = 'center';
            if (this.text.length < 9) tool.ctx.font = "14px Arial";
            else tool.ctx.font = "10px Arial";  
            tool.ctx.fillText(this.text, this.center.x, this.center.y);
        }
        tool.ctx.stroke();

        if (this.status) {
            tool.ctx.beginPath();
            tool.ctx.strokeStyle = "#eefc26";
            tool.ctx.lineWidth = 5;
            tool.ctx.arc(this.center.x, this.center.y, this.radius + 3, 0, 2 * Math.PI)
            tool.ctx.stroke();
            tool.ctx.strokeStyle = "#000000";
            tool.ctx.lineWidth = 1;
        }
    }

    getCenter(): Point {
        return this.center;
    }

    toggle(): void {
        this.status = !this.status;
    }

    isActive(): boolean {
        return this.status;
    }
}