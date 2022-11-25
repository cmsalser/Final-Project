import { CanvasElement } from "./canvas-element";
import { Render } from "./render";
import { Point } from "./point";

const ARROW_HEAD = 15;
export class Line extends CanvasElement {
    private from: Point;
    private to: Point;
    private arrow?: boolean;

    constructor(from: Point, to: Point, arrow?: boolean) {
        super();
        this.from = from;
        this.to = to;
        this.arrow = arrow;
    }

    override draw(tool: Render) {
        tool.ctx.beginPath();
        tool.ctx.moveTo(this.from.x, this.from.y);
        tool.ctx.lineTo(this.to.x, this.to.y);
        if (this.arrow) {
            const angle = Math.atan2(this.to.y - this.from.y, this.to.x - this.from.x);
            tool.ctx.moveTo(this.to.x, this.to.y);
            tool.ctx.lineTo(this.to.x - ARROW_HEAD * (Math.cos(angle - Math.PI/6)), this.to.y - ARROW_HEAD * (Math.sin(angle - Math.PI/6)));
            tool.ctx.moveTo(this.to.x, this.to.y);
            tool.ctx.lineTo(this.to.x - ARROW_HEAD * (Math.cos(angle + Math.PI/6)), this.to.y - ARROW_HEAD * (Math.sin(angle + Math.PI/6)));
        }
        tool.ctx.stroke();
    }
}