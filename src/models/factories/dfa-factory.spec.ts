import { DFAFactory } from "./dfa-factory"
import { Canvas } from "../canvas";


describe('DFA Factory', () => {
    let factory: DFAFactory;
    let canvas: Canvas;

    beforeEach(() => {
        canvas = jasmine.createSpyObj('Canvas', ['addChildren']);
        factory = new DFAFactory(canvas);
    });

    it('should be created', () => {
        expect(factory).toBeTruthy();
    })

    it('', () => {
        
    })
});