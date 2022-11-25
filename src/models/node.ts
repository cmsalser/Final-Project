import { Circle } from "./circle";

export interface Transtion {
    from: Node,
    to: Node,
    symbol: string
}
export class Node {
    name: string;
    symbol: string;
    canvasElement: Circle | undefined;

    constructor(name: string, symbol: string) {
        this.name = name;
        this.symbol = symbol;
    }

    addCircle(e: Circle) {
        this.canvasElement = e;
    }
}