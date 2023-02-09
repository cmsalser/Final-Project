import { CanvasElement } from "./canvas-element";
import { Render } from "./render";
import { Point } from "./point";

const ARROW_HEAD = 10;
export class Line extends CanvasElement {
    private from: Point;
    private to: Point;
    private arrow?: boolean;
    private symbol?: string;

    constructor(from: Point, to: Point, arrow?: boolean, symbol?: string) {
        super();
        this.from = from;
        this.to = to;
        this.arrow = arrow;
        this.symbol = symbol;
    }

    override draw(tool: Render) {
        tool.ctx.beginPath();
        tool.ctx.moveTo(this.from.x, this.from.y);
        tool.ctx.lineTo(this.to.x, this.to.y);
        if (this.arrow) {
            const angle = this.from.angleTo(this.to);
            tool.ctx.moveTo(this.to.x, this.to.y);
            tool.ctx.lineTo(this.to.x - ARROW_HEAD * (Math.cos(angle - Math.PI/6)), this.to.y - ARROW_HEAD * (Math.sin(angle - Math.PI/6)));
            tool.ctx.moveTo(this.to.x, this.to.y);
            tool.ctx.lineTo(this.to.x - ARROW_HEAD * (Math.cos(angle + Math.PI/6)), this.to.y - ARROW_HEAD * (Math.sin(angle + Math.PI/6)));
        }
        if (this.symbol) {
            const angle = this.from.angleTo(this.to);
            const distance = this.from.distanceTo(this.to);
            const halfway = this.from.pointAt(angle, distance/2);
            tool.ctx.font = "14px Arial";
            tool.ctx.fillText(this.symbol, halfway.x + 10, halfway.y - 5);
        }
        tool.ctx.stroke();
    }
}