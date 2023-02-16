import { Canvas } from "../canvas";
import * as regexp from 'regexp-tree';
import { AstNode } from "regexp-tree/ast";
import { Node, Transition } from "../node";
import { Circle } from "../circle";
import { Point } from "../point";
import { Line } from "../line";
import { Factory } from "./factory";

const NODE_RADIUS = 35;
const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 500;
const START_Y = 35;

export class RegexFactory extends Factory{ 
    constructor(canvas: Canvas) {
        super(canvas);
    }

    override build(data: AstNode) {
        let poolTransitions: Transition[] = [];
        const m: Map<AstNode, Node> = new Map();
        regexp.traverse(data, {
            RegExp: {
                pre({node}) {
                    let x = new Node('root');
                    m.set(node, x);
                },
                post({node}){
                    if (node.body) {
                        poolTransitions.push({
                            from: m.get(node)!,
                            to: m.get(node.body)!,
                            symbol: ''
                        });
                    }
                }
            },
            Disjunction: {
                pre({node}) {
                    let x = new Node(node.type);
                    m.set(node, x);
                },
                post({node}) {
                    if (node.left){
                        poolTransitions.push({
                            from: m.get(node)!,
                            to:  m.get(node.left)!,
                            symbol: ''
                        })
                    }
                    if (node.right) {
                        poolTransitions.push({
                            from: m.get(node)!,
                            to:  m.get(node.right)!,
                            symbol: ''
                        });
                    }
                }                
            },
            Alternative: {
                pre({node}) {
                    let x = new Node('Concatination');
                    m.set(node, x);
                },
                post({node}){
                    node.expressions.forEach((e: AstNode) => {
                        poolTransitions.push({
                            from: m.get(node)!,
                            to: m.get(e)!,
                            symbol: ''
                        });
                    });
                }
            },
            Char({node}) {
                let x = new Node(node.value);
                m.set(node, x);
            },
            Repetition: {
                pre({node}) {
                    let name: string = '';
                    switch(node.quantifier.kind){
                        case ('?'): name = 'ZeroOrOne'; break;
                        case ('*'): name = 'ZeroOrMore'; break;
                        case ('+'): name = 'OneOrMore'; break;
                        default: throw new Error('Repition Quantifier not found'); 
                    }
                    let x = new Node(name);
                    m.set(node, x);
                },
                post({node}){
                    poolTransitions.push({
                        from: m.get(node)!,
                        to: m.get(node.expression)!,
                        symbol: ''
                    });
                }
            },
            Group: {
                pre({node}){
                    let x = new Node(node.type);
                    m.set(node, x);
                },
                post({node}){
                    if (node.expression){
                        poolTransitions.push({
                            from: m.get(node)!,
                            to: m.get(node.expression)!,
                            symbol: ''
                        });
                    }
                }
            },
            CharacterClass({node}) {
                throw new Error(`Unsupported Grammer of CharacterClass at : [`);
            },
            Backreference({node}) {
                throw new Error(`Unsupported Grammer of Backreference at: ${node.kind}`)
            },
            Assertion({node}) {
                throw new Error(`Unsupported Grammer of Assertion at: ${node.kind}`)
            }
        });
        this.transitions = poolTransitions;
        this.nodes = Array.from(m.values());
    }

    override draw() {
        this.canvas.empty();
        const levels = this.createLevels();
        for (let i = 0; i < levels.length; i++){
            const array = levels[i];
            const start_x = (CANVAS_HEIGHT/2) - ((array.length - 1)/2 * 90);
            array.forEach(n => {
                let x: number = 0;
                let y: number = 0;
                let p: Point;
                let parent: any = undefined;
                 //If Not the root node, center of node depends on parent
                if (i > 0){
                    parent =  this.transitions.find(t => t.to === n)!.from;
                    y = parent.canvasElement!.getCenter().y + (3 * NODE_RADIUS);
                    //If the new level has less Nodes then previous level use parents x cord
                    if (levels[i - 1].length > levels[i].length) {
                        x = this.transitions.find(t => t.to ===n)!.from.canvasElement!.getCenter().x;
                    }
                    //Otherwise, nodes will use the offset
                    else {     
                        x = start_x + ((array.indexOf(n)) * 90); 
                    }
                }
                //Otherwise place root node in default pos
                else {
                    x = CANVAS_WIDTH/2;
                    y = START_Y;
                }
                p = new Point(x, y);
                const c = new Circle(p, NODE_RADIUS, n.name);
                n.addCircle(c);
                this.canvas.addChildren(c);
                if (typeof parent !== 'undefined') { 
                    const angle = parent.canvasElement.getCenter().angleTo(p);
                    const lineStart = parent.canvasElement.getCenter().pointAt(angle, NODE_RADIUS);
                    const lineEnd = p.pointAt(angle - Math.PI, NODE_RADIUS);
                    this.canvas.addChildren(new Line(lineStart, lineEnd, true));
                }
            });
        }
        this.canvas.draw();
    }

    override next(input: string): boolean {
        if (input == 'start') {
            this.nodes.find(n => n.name == 'root')!.toggle();
            this.canvas.draw();
            return true;
        } else {
            let current = this.nodes.filter(n => n.isActive());
            current.forEach(n => n.toggle());
            let active = this.nodes.filter(n => n.name == input);
            if (active.length > 0) {
                active.forEach(n => n.toggle());
                this.canvas.draw();
                return true;
            } else {
                return false;
            }
        }
    }

    override isValid(): boolean {
        let active = this.nodes.filter(n => n.isActive());
        active.forEach(n => n.toggle());
        this.canvas.draw();
        return true;
    }

    private createLevels(): Array<Array<Node>> {
        let toReturn: Array<Array<Node>> = [];
        toReturn.push(this.nodes.filter(n => n.name == 'root'));
        for (let i = 0; i < toReturn.length; i++){
            let collecter: Array<Transition> = [];
            let array = toReturn[i];
            array.forEach(n => {
                this.transitions.filter(t => t.from === n).forEach(t => collecter.push(t));
            })
            if (collecter.length > 0) {
                toReturn.push(collecter.map(t => t.to));
            }
        }
        return toReturn;
    }
}