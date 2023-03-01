import { CanvasElement } from "./canvas-element";
import { Point } from "./point";

const ARROW_HEAD = 10;
export class MultiLine extends CanvasElement {
    private points: Point[];
    private arrow?: boolean;
    private symbol?: string;
    private center?: Point;

    constructor(array: Array<any>, arrow?: boolean, symbol?: string, center?: Point) {
        super();
        this.points = array.map(e => new Point(e.x, e.y));
        this.arrow = arrow;
        this.symbol = symbol;
        this.center = center;
    }

    override draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        for (let i = 0; i < this.points.length - 1; i++) {
            const p = this.points[i];
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(this.points[i + 1].x, this.points[i + 1].y);
        }
        if (this.arrow) {
            const angle = this.points[this.points.length - 3].angleTo(this.points[this.points.length - 1]);
            const p = this.points[this.points.length - 1];
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - ARROW_HEAD * (Math.cos(angle + Math.PI/6)), p.y - ARROW_HEAD * (Math.sin(angle + Math.PI/6)));
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - ARROW_HEAD * (Math.cos(angle - Math.PI/6)), p.y - ARROW_HEAD * (Math.sin(angle - Math.PI/6)));
        }
        if (this.symbol && this.center) {
            ctx.font = "14px Arial";
            ctx.fillText(this.symbol, this.center.x, this.center.y);
        }
        ctx.stroke();
    }
}