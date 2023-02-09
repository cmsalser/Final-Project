import { CanvasElement } from "./canvas-element";
import { Point } from "./point";
import { Render } from "./render";

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

    override draw(tool: Render): void {
        tool.ctx.beginPath();
        for (let i = 0; i < this.points.length - 1; i++) {
            const p = this.points[i];
            tool.ctx.moveTo(p.x, p.y);
            tool.ctx.lineTo(this.points[i + 1].x, this.points[i + 1].y);
        }
        if (this.arrow) {
            const angle = this.points[this.points.length - 3].angleTo(this.points[this.points.length - 1]);
            const p = this.points[this.points.length - 1];
            tool.ctx.moveTo(p.x, p.y);
            tool.ctx.lineTo(p.x - ARROW_HEAD * (Math.cos(angle + Math.PI/6)), p.y - ARROW_HEAD * (Math.sin(angle + Math.PI/6)));
            tool.ctx.moveTo(p.x, p.y);
            tool.ctx.lineTo(p.x - ARROW_HEAD * (Math.cos(angle - Math.PI/6)), p.y - ARROW_HEAD * (Math.sin(angle - Math.PI/6)));
        }
        if (this.symbol && this.center) {
            tool.ctx.font = "14px Arial";
            tool.ctx.fillText(this.symbol, this.center.x, this.center.y);
        }
        tool.ctx.stroke();
    }
}