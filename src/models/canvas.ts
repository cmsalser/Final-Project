import { CanvasElement } from "./canvas-element";
import { Point } from "./point";

/**
 * This implementation is largly inspired by the work of
 * https://github.com/joeylemon/nfa-to-dfa, it is worth 
 * checking out!
 */
export class Canvas {
    private children: Array<CanvasElement>;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private grabPoint?: Point = undefined;
    private state = {
        scale: 1,
        zoom: 0,
        xTranslation: 0,
        yTranslation: 0
    };

    constructor(id: string) {
        let canvas: any = document.querySelector(id);
        if (canvas == null) {
            throw new Error(`Could not find canvas with id ${id}!`);
        }
        let context = canvas.getContext('2d');
        this.canvas = canvas;
        this.context = context;
        this.children = [];
        this.setupListeners(); 
    }

    addChildren(child: CanvasElement) {
        this.children.push(child);
    }

    draw() {
        this.context.clearRect(-this.state.xTranslation, -this.state.yTranslation, this.canvas.width * (1/this.state.scale), this.canvas.height * (1/this.state.scale)); 
        this.children.forEach(e => e.draw(this.context));
    }

    empty() {
        this.children = [];
    }

    private setupListeners() {
        this.canvas.addEventListener('mousedown', this.mouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.mouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.mouseUp.bind(this));
        this.canvas.addEventListener('wheel', this.mouseWheel.bind(this));
    }

    private mouseDown(e: MouseEvent) {
        this.grabPoint = this.transformPoint(new Point(e.offsetX, e.offsetY));
        document.body.style.cursor = 'grabbing';
    };

    private mouseUp(e: MouseEvent) {
        if (this.grabPoint) {
            document.body.style.cursor = '';
            this.draw();
            this.grabPoint = undefined;
        }
    }

    private mouseMove(e: MouseEvent) {
        const mousePoint = this.transformPoint(new Point(e.offsetX, e.offsetY));
        if (this.grabPoint) {
            this.state.xTranslation += mousePoint.x - this.grabPoint.x;
            this.context.translate(mousePoint.x - this.grabPoint.x, 0);

            this.state.yTranslation += mousePoint.y - this.grabPoint.y;
            this.context.translate(0, mousePoint.y - this.grabPoint.y);
        }
        this.draw();
    }

    private mouseWheel(e: WheelEvent){
        e.preventDefault( );
        this.state.zoom = this.state.zoom + (0.0008 * -e.deltaY);
        //reset transformations
        this.context.translate(-this.state.xTranslation, -this.state.yTranslation);
        //reset scale
        this.context.scale(1/this.state.scale, 1/this.state.scale);

        this.state.scale = this.state.zoom + 1;
        this.context.scale(this.state.scale, this.state.scale);
        this.context.translate(this.state.xTranslation, this.state.yTranslation);

        this.draw();
    }

    private transformPoint(p: Point): Point {
        return new Point(p.x / this.state.scale - this.state.xTranslation, p.y / this.state.scale - this.state.yTranslation);
    }
}