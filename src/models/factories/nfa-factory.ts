import { Canvas } from "../canvas";
import { Factory } from "./factory";
import * as regexp from 'regexp-tree';
import { AstNode } from "regexp-tree/ast";
import { Node, Transition } from "../node";
import { Circle } from "../circle";
import { Point } from "../point";
import { BezierCurve } from "../bezier-curve";

const {fa} = require('regexp-tree')
const NODE_RADIUS = 30;
const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 500;
const START_X = 45;
export class NFAFactory extends Factory{
    private nfa: any;
    private table: any;

    constructor(canvas: Canvas) {
        super(canvas);
    }

    override build(data: AstNode) {
        this.transitions = [];
        this.nodes = [];
        const re = regexp.generate(data);
        this.nfa = fa.toNFA(re);
        this.table = this.nfa.getTransitionTable();
        //Assemble all states in finite automata
        for (const state in this.table) {
            let a = false;
            let s = false; 
            if (state == this.nfa.in.number) {
                s = true;
            }
            if (state == this.nfa.out.number) {
                a = true;
            }
            this.nodes.push(new Node(`w_${state}`, 'n/a', a, s))
        }
        for (const state in this.table) {
            //now assemble all transitions
            const from = this.nodes.find(n => n.name == `w_${state}`);
            const transitions = this.table[state];
            for (const transition in transitions) {
                const symbol = transition;
                transitions[transition].forEach((num: number) => {
                    const to = this.nodes.find(n => n.name == `w_${num}`);
                    this.transitions.push({
                        from: from!,
                        to: to!,
                        symbol: symbol
                    })
                });
            }
        }
    }

    override draw() {
        this.canvas.empty();
        console.log(this.nodes);
        console.log(this.transitions);
        let x = START_X;
        this.createLevels().forEach(array => {
            const start_y = (CANVAS_HEIGHT/2) - ((array.length - 1)/2 * 90);
            array.forEach(n => {
                const c = new Circle(new Point(x, start_y + (array.indexOf(n) * 90)), NODE_RADIUS, n.name);
                n.addCircle(c);
                this.canvas.addChildren(c);
            });
            x += 3 * NODE_RADIUS;
        });
        this.canvas.draw();
    }

    private createLevels(): Array<Array<Node>> {
        let toReturn: Array<Array<Node>> = []
        toReturn.push(this.nodes.filter(n => n.isStartState()));
        let collecter: Array<Node> = [];
        this.nodes.forEach(n => {
            if (!n.isAcceptState() && !n.isStartState()){
                collecter.push(n);

                if (collecter.length == 2) {
                    toReturn.push(collecter);
                    collecter = [];
                }
            }
        });
        toReturn.push(this.nodes.filter(n => n.isAcceptState()));
        return toReturn
    }
}