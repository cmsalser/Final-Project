import { AstNode } from "regexp-tree/ast";
import { Canvas } from "../canvas";
import { Node, Transition } from "../node";

export class Factory {
    nodes: Node[];
    transitions: Transition[];
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

    //Iterate through graph on input
    next(input: string): boolean {
        throw new Error(`An undefined call to next was made with ${input}.`);
    }

    //Return if the walkthough was valid
    //Also handles teardown of walkthrough
    isValid(): boolean {
        throw new Error('An undefined call to isValid was made');
    }
}