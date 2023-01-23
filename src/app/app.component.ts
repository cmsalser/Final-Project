import { Component, OnInit, ViewChild } from '@angular/core';
import * as parser from 'regexp-tree';
import { VisualizerComponent } from './children/visualizer/visualizer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('regex') regexChild!: VisualizerComponent
  @ViewChild('nfa') nfaChild!: VisualizerComponent
  title = 'Regular Expressions and Finite Automata';
  error: string | undefined = undefined;
  
  ngOnInit(): void {

  }

  onClick(text: string) {
    try {
      this.nfaChild.data = parser.parse('/' + text + '/');
      this.regexChild.data = parser.parse('/' + text + '/');
      this.error = undefined;
    } catch (e) {
      if (e instanceof SyntaxError) {
        this.error = e.message;
      } else if (e instanceof Error) {
        this.error = e.message;
      } else {
        console.log(e);
      }
    }
  }
}