export class Point {
    public x: number;
    public y:number;

    constructor(x: number, y:number){
        this.x = x;
        this.y = y;
    }

    distanceTo(p: Point) {
        return Math.hypot(p.x - this.x, p.y - this.y); 
    }

    angleTo(p: Point) {
        return Math.atan2(p.y - this.y, p.x - this.x);
    }

    pointAt(angle: number, radius: number): Point {
        return new Point(Math.cos(angle) * radius + this.x, Math.sin(angle) * radius + this.y);
    }
}