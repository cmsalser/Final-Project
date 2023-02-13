import { AfterViewInit, Component, Input } from '@angular/core';
import { Canvas } from 'src/models/canvas';
import { Factory } from 'src/models/factories/factory';
import { AstNode } from "regexp-tree/ast";
import { RegexFactory } from 'src/models/factories/regex-factory';
import { NFAFactory } from 'src/models/factories/nfa-factory';
import { DFAFactory } from 'src/models/factories/dfa-factory';

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.css']
})
export class VisualizerComponent implements AfterViewInit {
  @Input() name = '';
  private _data?: AstNode;
  @Input() set data(input: AstNode) {
    this._data = input;
    if (this.factory) {
      this.factory.build(this._data);
      this.factory.draw();
    }
  }
  private canvas: Canvas | undefined; 
  private factory: Factory | undefined;

  constructor() { }

  ngAfterViewInit(): void {
    this.canvas = new Canvas('#' + this.name);
    switch(this.name) {
      case 'regex':
        this.factory = new RegexFactory(this.canvas);
        break;
      case 'nfa':
        this.factory = new NFAFactory(this.canvas);
        break;
      case 'dfa':
        this.factory = new DFAFactory(this.canvas); 
        break;
      default:
        throw new Error('Unknown name in visualizer.component')
    }   
  }

  async validate(tokens: string[]) {
    if (this.factory) {
      for (let i = 0; i < tokens.length; i++){
        const curr = tokens[i];
        console.log(curr)
        if (this.factory.next(curr)) {
          await this.waitFor(1500);
        } else {
          break;
        }
      }

      console.log(this.factory.isValid());
    }
  }

  waitFor(n: number) {
    return new Promise(resolve => setTimeout(resolve, n));
  }
}
