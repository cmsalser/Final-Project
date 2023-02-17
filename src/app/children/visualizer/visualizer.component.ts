import { AfterViewInit, Component, Input } from '@angular/core';
import { Canvas } from 'src/models/canvas';
import { Factory } from 'src/models/factories/factory';
import { AstNode } from "regexp-tree/ast";
import { RegexFactory } from 'src/models/factories/regex-factory';
import { NFAFactory } from 'src/models/factories/nfa-factory';
import { DFAFactory } from 'src/models/factories/dfa-factory';
import { animate, state, style, transition, trigger } from '@angular/animations';
import TypeIt from 'typeit';

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.css'],
  animations: [
    trigger('valid', [
      state('true', style({
        border: '3px solid #03aa27',
        backgroundColor: '#9eec8a'
      })),
      state('false', style({
        border: '3px solid #222222',
        backgroundColor: 'white'
      })),
      transition('0 <=> 1', [
        animate('1000ms ease')
      ])
    ]),
    trigger('notValid', [
      state('true', style({
        border: '3px solid #f00a0a',
        backgroundColor: '#ec7777'
      })),
      state('false', style({
        border: '3px solid #222222',
        backgroundColor: 'white'
      })),
      transition('0 <=> 1', [
        animate('1000ms ease')
      ]) 
    ])
  ]
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
  validAnimate = false;
  nonValidAnimate = false;

  constructor() { }

  ngAfterViewInit(): void {
    this.canvas = new Canvas('#' + this.name);
    new (TypeIt as any)('#' + this.name + '-title', {
      cursor: false,
      startDelay: 4000,
      strings: this.name
    }).go();
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

  async validate(tokens: string[]): Promise<boolean> {
    if (this.factory) {
      for (let i = 0; i < tokens.length; i++){
        const curr = tokens[i];
        if (this.factory.next(curr)) {
          await this.waitFor(1500);
        } else {
          break;
        }
      }

      return this.factory.isValid();
    } else {
      return Promise.resolve(false);
    } 
  }

  waitFor(n: number) {
    return new Promise(resolve => setTimeout(resolve, n));
  }

  startAnimation(result: boolean) {
    if (result) this.validAnimate = true;
    else this.nonValidAnimate = true;
  }

  onValidAnimationFinish() {
    this.validAnimate = false;
  }

  onNonValidAnimationFinish() {
    this.nonValidAnimate = false;
  }
}
