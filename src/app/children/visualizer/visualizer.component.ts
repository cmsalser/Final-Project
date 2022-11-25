import { AfterViewInit, Component, Input } from '@angular/core';
import { Canvas } from 'src/models/canvas';
import { RegexFactory } from 'src/models/factories/regex-factory';
import { AstNode } from "regexp-tree/ast";

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
  private factory: RegexFactory | undefined;

  constructor() { }

  ngAfterViewInit(): void {
    this.canvas = new Canvas('#' + this.name);
    this.factory = new RegexFactory(this.canvas);   
  }
}
