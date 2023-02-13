import { Canvas } from "../canvas";
import { Factory } from "./factory";
import * as regexp from 'regexp-tree';
import { AstNode } from "regexp-tree/ast";
import { Node } from "../node";
import { Circle } from "../circle";
import { Point } from "../point";
import { Line } from "../line";
import { MultiLine } from "../multi-line";

const {fa} = require('regexp-tree');
const dagre = require('dagre');

const NODE_RADIUS = 30;
export class DFAFactory extends Factory{
    private dfa: any;
    private table: any;
    private graph: any;

    constructor(canvas: Canvas) {
        super(canvas);
    }

    override build(data: AstNode): void {
        this.transitions = [];
        this.nodes = [];
        this.graph = new dagre.graphlib.Graph({})
            .setGraph({})
            .setDefaultNodeLabel(function () { return {}; })
            .setDefaultEdgeLabel(function () { return {}; })
            ;
        this.dfa = fa.toDFA(regexp.generate(data));
        this.table = this.dfa.getTransitionTable();

        //Assemble all states in finite automata
        for (const state in this.table) {
            let a = false;
            let s = false;
            
            if (state == this.dfa._nfa.in.number) {
                s = true;
            }
            for (const item of this.dfa._acceptingStateNumbers) {
                if (item == state) { a = true; break; }
            }

            const n = new Node(`w_${state}`, a, s);
            this.nodes.push(n);
            this.graph.setNode(n.name, { width: 2*NODE_RADIUS, height: 2*NODE_RADIUS });
        }

        //now assemble all transitions
        for (const state in this.table) {
            const from = this.nodes.find(n => n.name == `w_${state}`);
            const transitions = this.table[state];
            for (const transition in transitions) {
                const to = this.nodes.find(n => n.name == `w_${transitions[transition]}`);
                this.transitions.push({
                    from: from!,
                    to: to!,
                    symbol: transition
                });
                this.graph.setEdge(from!.name, to!.name, { label: transition, labeloffset: 15, width: 10, height: 10 });
            }
        }
    }

    override draw(): void {
        this.canvas.empty();
        console.log('DFA');
        console.log(this.dfa);

        dagre.layout(this.graph);
        this.graph.nodes().forEach((n: any) => {
            const node = this.graph.node(n);
            const c = new Circle(new Point(node.x, node.y), NODE_RADIUS, n);
            this.nodes.find(i => i.name == n)!.addCircle(c);
            this.canvas.addChildren(c);
            if (this.nodes.find(i => i.name == n)!.isAcceptState()){
                this.canvas.addChildren(new Circle(new Point(node.x, node.y), NODE_RADIUS - 5));
            }
            if (this.nodes.find(i => i.name == n)!.isStartState()) {
                this.canvas.addChildren(new Line(new Point(node.x, node.y - (2* NODE_RADIUS)), new Point(node.x, node.y - NODE_RADIUS), true));
            }
        });
        this.graph.edges().forEach((e: any) => {
            const edge = this.graph.edge(e);
            let points = edge.points;

            //Add new start and end points to line
            //Accomadates for some edges not intersecting nodes
            let firstPoint = new Point(edge.points[0].x, edge.points[0].y);
            let lastPoint = new Point(edge.points[edge.points.length -1].x, edge.points[edge.points.length -1].y);
            let startNode = this.nodes.find(n => n.name == e.v)
            let endNode = this.nodes.find(n => n.name == e.w);

            let angle = startNode!.canvasElement!.getCenter().angleTo(firstPoint);
            let newPoint = startNode!.canvasElement!.getCenter().pointAt(angle, NODE_RADIUS);
            points.unshift({x: newPoint.x, y: newPoint.y});

            angle = endNode!.canvasElement!.getCenter().angleTo(lastPoint);
            newPoint = endNode!.canvasElement!.getCenter().pointAt(angle, NODE_RADIUS);
            points.push({x: newPoint.x, y: newPoint.y});
            
            let l: MultiLine;
            if (edge.x && edge.y) {
                l = new MultiLine(points, true, edge.label, new Point(edge.x, edge.y));
            } else {
                l = new MultiLine(points, true, edge.label);
            }
            this.canvas.addChildren(l);
        });
        this.canvas.draw();
    }

    override next(input: string): boolean {
        if (input == 'start') {
            this.nodes.find(n => n.isStartState())!.toggle();
            this.canvas.draw();
            return true;
        } else {
            let current = this.nodes.find(n => n.isActive());
            let outgoing = this.transitions.find(t => (t.from == current) && t.symbol == input);
            current!.toggle();
            if (!outgoing) {
                return false;
            }
            outgoing.to.toggle();
            this.canvas.draw();
            return true;
        }
    }

    override isValid(): boolean {
        const node = this.nodes.find(n => n.isActive());
        this.nodes.forEach(n => {
            if (n.isActive()) n.toggle();
        });
        if (node && node.isAcceptState()) return true;
        return false;
    }
}