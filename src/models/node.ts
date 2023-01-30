import { Circle } from "./circle";

export interface Transition {
    from: Node,
    to: Node,
    symbol: string
}
export class Node {
    name: string;
    symbol: string;
    canvasElement: Circle | undefined;
    private isAccepting: boolean;
    private isStart: boolean;

    constructor(name: string, symbol: string, accepting: boolean = false, start: boolean = false) {
        this.name = name;
        this.symbol = symbol;
        this.isAccepting = accepting;
        this.isStart = start;
    }

    addCircle(e: Circle) {
        this.canvasElement = e;
    }

    isAcceptState(): boolean {
        return this.isAccepting;
    }

    isStartState(): boolean {
        return this.isStart;
    }
}