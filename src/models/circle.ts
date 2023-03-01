import { CanvasElement } from "./canvas-element";
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

    override draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
        if (this.text) {
            ctx.textAlign = 'center';
            if (this.text.length < 9) ctx.font = "14px Arial";
            else ctx.font = "10px Arial";  
            ctx.fillText(this.text, this.center.x, this.center.y);
        }
        ctx.stroke();

        if (this.status) {
            ctx.beginPath();
            ctx.strokeStyle = "#eefc26";
            ctx.lineWidth = 5;
            ctx.arc(this.center.x, this.center.y, this.radius + 3, 0, 2 * Math.PI)
            ctx.stroke();
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 1;
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