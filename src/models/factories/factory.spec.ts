import { Factory } from "./factory"
import { Canvas } from "../canvas";


describe('Base Factory', () => {
    let factory: Factory;
    let canvas: Canvas;

    beforeEach(() => {
        canvas = jasmine.createSpyObj('Canvas', []);
        factory = new Factory(canvas);
    });

    it('should be created', () => {
        expect(factory).toBeTruthy();
        expect(factory.nodes.length).toEqual(0);
        expect(factory.transitions.length).toEqual(0);
    })

    it('should throw errors on function call', () => {
        expect(factory.draw).toThrowError();
    })
});