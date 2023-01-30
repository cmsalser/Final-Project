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

    /**
     * 
     * @param distance Distance along the cicle circumfrance as decimal
     * 
     * @returns 4 Points for a bezier curve
     */
    bezierPoints(distance: number): Array<Point> {
        let toReturn = [
            new Point(
                this.center.x + this.radius * Math.cos(2 * Math.PI * (distance - .1)),
                this.center.y + this.radius * Math.sin(2 * Math.PI * (distance - .1))
            ),
            new Point(
                this.center.x + this.radius * Math.cos(2 * Math.PI * (distance + .1)),
                this.center.y + this.radius * Math.sin(2 * Math.PI * (distance + .1))
            )
        ];
        const c1 = toReturn[0].pointAt(2 * Math.PI * (distance - .1), this.radius*2);
        const c2 = toReturn[1].pointAt(2 * Math.PI * (distance + .1), this.radius*2);
        toReturn.push(c1, c2);
        return toReturn;
    }
}