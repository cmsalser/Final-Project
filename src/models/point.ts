export class Point {
    public x: number;
    public y:number;

    constructor(x: number, y:number){
        this.x = x;
        this.y = y;
    }

    distanceTo(location: Point) {
        return Math.hypot(location.x - this.x, location.y - this.y); 
    }

    angleTo(location: Point) {
        return Math.atan2(location.y - this.y, location.x - this.x);
    }

    pointAt(angle: number, radius: number): Point {
        return new Point(Math.cos(angle) * radius + this.x, Math.sin(angle) * radius + this.y);
    }
}