import { Canvas } from "../canvas";
import { Factory } from "./factory";
import * as regexp from 'regexp-tree';
import { AstNode } from "regexp-tree/ast";
import { Node } from "../node";

const {fa} = require('regexp-tree')

export class NFAFactory extends Factory{
    constructor(canvas: Canvas) {
        super(canvas);
    }

    override build(data: AstNode) {
        const re = regexp.generate(data);
        const nfa = fa.toNFA(re);
        const table = nfa.getTransitionTable();
        //Assemble all states in finite automata
        for (const state in table) {
            this.nodes.push(new Node(`w_${state}`, 'n/a'))
        }
        for (const state in table) {
            //now assemble all transitions
            const from = this.nodes.find(n => n.name == `w_${state}`);
            const transitions = table[state];
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
        console.log(this.transitions);
        console.log(this.nodes);
    }

    override draw() {

    }
}