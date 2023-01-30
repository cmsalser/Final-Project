import { Canvas } from "../canvas";
import { Factory } from "./factory";
import * as regexp from 'regexp-tree';
import { AstNode } from "regexp-tree/ast";
import { Node } from "../node";
import { Circle } from "../circle";
import { Point } from "../point";
import { BezierCurve } from "../bezier-curve";

const {fa} = require('regexp-tree')
const NODE_RADIUS = 30;
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
        let c = new Circle(new Point(30, 30), NODE_RADIUS);
        const a = c.bezierPoints(.5);  
        let l = new BezierCurve(a[0], a[1], a[2], a[3], true, 'A');
        this.canvas.addChildren(c);
        this.canvas.addChildren(l);
        this.canvas.draw();
        console.log(this.nfa);
        console.log(this.nodes);
        console.log(this.transitions)
    }
}