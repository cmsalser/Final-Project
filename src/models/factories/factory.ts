import { AstNode } from "regexp-tree/ast";
import { Canvas } from "../canvas";
import { Node, Transtion } from "../node";

export class Factory {
    nodes: Node[];
    transitions: Transtion[];
    canvas: Canvas;
    constructor(canvas: Canvas){
        this.canvas = canvas;
        this.nodes = [];
        this.transitions = [];
    }

    build(data: AstNode) {
        throw new Error('An undefined call to draw was made.');
    }

    draw() {
        throw new Error('An undefined call to draw was made.');
    }
}