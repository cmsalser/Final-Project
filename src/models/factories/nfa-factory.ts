import { Canvas } from "../canvas";
import { Factory } from "./factory";
import * as regexp from 'regexp-tree';
import { AstNode } from "regexp-tree/ast";
import { Node } from "../node";
import { Circle } from "../circle";
import { Point } from "../point";
import { MultiLine } from "../multi-line";
import { Line } from "../line";

const {fa} = require('regexp-tree');
const dagre = require('dagre');

const EPSILON = 'ε*';
const NODE_RADIUS = 30;
export class NFAFactory extends Factory{
    private nfa: any;
    private table: any;
    private graph: any;
    private vistited = new Set();

    constructor(canvas: Canvas) {
        super(canvas);
    }

    override build(data: AstNode) {
        this.transitions = [];
        this.nodes = [];
        this.graph = new dagre.graphlib.Graph({ multigraph: true })
            .setGraph({ranksep: 0})
            .setDefaultNodeLabel(function () { return {}; })
            .setDefaultEdgeLabel(function () { return {}; })
            ;
        this.nfa = fa.toNFA(regexp.generate(data));
        this.table = this.nfa.getTransitionTable();

        //Assemble all states in finite automata
        for (const state in this.table) {
            let a = false;
            let s = false; 
            if (state == this.nfa.in.number) {
                s = true;
            }
            for (const item of this.nfa._acceptingStates) {
                if (item.number == state) { a = true; break; }
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
                const symbol = transition;
                transitions[transition].forEach((num: number) => {
                    const to = this.nodes.find(n => n.name == `w_${num}`);
                    const t = {
                        from: from!,
                        to: to!,
                        symbol: symbol
                    }
                    this.transitions.push(t);
                    //Pass index of the transition to serve as UID, needed for multigraphs
                    this.graph.setEdge(from!.name, to!.name, { label: symbol, labeloffset: 15, width: 10, height: 14 }, this.transitions.indexOf(t));
                });
            }
        }
    }

    override draw() {
        this.canvas.empty();
        
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
            //Find active state
            let current = this.nodes.find(n => n.isActive());
            current!.toggle();
            let nextStates: Node[] = [current!];
            //Add all states reachable by Epsilon transition that are not self loops
            this.transitions.filter(t => t.from == current).forEach(t => {
                if (t.symbol == EPSILON && t.to != current) nextStates.push(t.to);
            });

            let activeTransitions = this.transitions.filter(t => t.symbol == input && nextStates.includes(t.from)); 
            activeTransitions.forEach(t => t.to.toggle());
            this.canvas.draw();
            return activeTransitions.length > 0;
        }
    }

    override isValid(): boolean {
        let active = this.nodes.find(n => n.isActive());
        if (!active) {
            return false;
        }
        active.toggle();
        this.canvas.draw();
        //Find all states reachable with epsilon to see if we are near an accepting state
        let nextStates: Node[] = [];
        this.transitions.filter(t => t.from == active).forEach(t => {
            if (t.symbol == EPSILON && t.to != active) nextStates.push(t.to);
        });
        nextStates.push(active!);
        return nextStates.filter(n => n.isAcceptState()).length > 0;
    }
}