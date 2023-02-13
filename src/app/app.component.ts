import { Component, ViewChild } from '@angular/core';
import * as parser from 'regexp-tree';
import { VisualizerComponent } from './children/visualizer/visualizer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('regex') regexChild!: VisualizerComponent;
  @ViewChild('nfa') nfaChild!: VisualizerComponent;
  @ViewChild('dfa') dfaChild!: VisualizerComponent;
  title = 'regular expressions and finite automata';
  error: string | undefined = undefined;

  onClick(text: string) {
    if (text.length > 0) {
      try {
        this.nfaChild.data = parser.parse('/' + text + '/');
        this.regexChild.data = parser.parse('/' + text + '/');
        this.dfaChild.data = parser.parse('/' + text + '/');
        this.error = undefined;
      } catch (e) {
        console.log(e)
        if (e instanceof SyntaxError) {
          this.error = e.message;
        } else if (e instanceof Error) {
          this.error = e.message;
        }
      }
    } else {
      this.error = "Please enter an expression first."
    }
  }

  validate(text: string) {
    const tokens = ['start'].concat([...text]);
    this.dfaChild.validate(tokens);
  }
}