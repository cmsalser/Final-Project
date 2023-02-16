import { Circle } from "./circle";

export interface Transition {
    from: Node,
    to: Node,
    symbol: string
}
export class Node {
    name: string;
    canvasElement: Circle | undefined;
    private isAccepting: boolean;
    private isStart: boolean = false;

    constructor(name: string, accepting: boolean = false, start: boolean = false) {
        this.name = name;
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

    setStart(value: boolean){
        this.isStart = value;
    }

    toggle(): void {
        this.canvasElement!.toggle();
    }

    isActive(): boolean {
        return this.canvasElement!.isActive();
    }
}