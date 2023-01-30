import { CanvasElement } from "./canvas-element";
import { Point } from "./point";
import { Render } from "./render";

const ARROW_HEAD = 15;
export class BezierCurve extends CanvasElement {
    private from: Point;
    private to: Point;
    private c1: Point;
    private c2: Point;
    private arrow?: boolean;
    private text?: string;

    constructor(from: Point, to: Point, c1: Point, c2: Point, arrow?: boolean, text?: string) {
        super();
        this.from = from;
        this.to = to;
        this.c1 = c1;
        this.c2 = c2;
        this.arrow = arrow;
        this.text = text;
    }

    private pointAt(x: number) {
        //x: 0 - 1 as distance along curve
        //use cubic form Bezier curve equation to calculate point on the curve
        return new Point(
            Math.pow((1 - x), 3) * this.from.x + 3 * Math.pow((1 - x), 2) * x * this.c1.x + 3 * (1 - x) * x * x * this.c2.x + Math.pow(x, 3) * this.to.x,
            Math.pow((1 - x), 3) * this.from.y + 3 * Math.pow((1 - x), 2) * x * this.c1.y + 3 * (1 - x) * x * x * this.c2.y + Math.pow(x, 3) * this.to.y
        );
    }

    override draw(tool: Render) {
        tool.ctx.beginPath();
        tool.ctx.moveTo(this.from.x, this.from.y);
        tool.ctx.bezierCurveTo(this.c1.x, this.c1.y, this.c2.x, this.c2.y, this.to.x, this.to.y);
    
        if (this.arrow) {
            const anglePoint = this.pointAt(.9);
            const angle = Math.atan2(this.to.y - anglePoint.y, this.to.x -  anglePoint.x);
            tool.ctx.moveTo(this.to.x, this.to.y);
            tool.ctx.lineTo(this.to.x - ARROW_HEAD * (Math.cos(angle - Math.PI/6)), this.to.y - ARROW_HEAD * (Math.sin(angle - Math.PI/6)));
            tool.ctx.moveTo(this.to.x, this.to.y);
            tool.ctx.lineTo(this.to.x - ARROW_HEAD * (Math.cos(angle + Math.PI/6)), this.to.y - ARROW_HEAD * (Math.sin(angle + Math.PI/6))); 
        }

        if (this.text) {
            const p = this.pointAt(.5);
            tool.ctx.font = "14px Arial"
            tool.ctx.fillText(this.text, p.x + 5, p.y - 5);
            tool.ctx.font = "";
        }
        tool.ctx.stroke();
    }
}