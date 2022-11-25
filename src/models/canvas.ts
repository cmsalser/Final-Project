import { CanvasElement } from "./canvas-element";
import { Render } from "./render";

export class Canvas {
    private children: Array<CanvasElement>;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private render: Render;
    private _dragInProgress: boolean = false;
    private _dragX: number = 0;
    private _dragY: number = 0;

    constructor(id: string) {
        let canvas: any = document.querySelector(id);
        if (canvas == null) {
            throw new Error(`Could not find canvas with id ${id}!`);
        }
        let context = canvas.getContext('2d');
        this.canvas = canvas;
        this.context = context;
        this.render = {canvas: canvas, ctx: context};
        this.children = [];
        this.setupListeners(); 
    }

    addChildren(child: CanvasElement) {
        this.children.push(child);
    }

    draw() { 
        this.children.forEach(e => e.draw(this.render));
    }

    clear() {
        //Save current context
        this.context.save();
        //Reset any transformations before clearing
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //Restore
        this.context.restore();
    }

    empty() {
        this.children = [];
    }

    private setupListeners() {
        this.canvas.addEventListener('mouseup', this.mouseUp.bind(this));
        this.canvas.addEventListener('mousedown', this.mouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.mouseMove.bind(this));
        this.canvas.addEventListener('mouseout', this.mouseUp.bind(this));     
    }

    private mouseDown(e: MouseEvent) {
        this._dragInProgress = true;
        document.body.style.cursor = 'grabbing';
        this._dragX = e.offsetX;
        this._dragY = e.offsetY;
    };

    private mouseUp(e: MouseEvent) {
        this._dragInProgress = false;
        document.body.style.cursor = '';
    };

    private mouseMove(e: MouseEvent) {
        if (!this._dragInProgress) return;
        this.clear();
        this.context.translate(e.offsetX - this._dragX, e.offsetY - this._dragY);
        this._dragX = e.offsetX;
        this._dragY = e.offsetY;
        this.draw();
    };

}