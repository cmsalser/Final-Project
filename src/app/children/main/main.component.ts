import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { VisualizerComponent } from '../visualizer/visualizer.component';
import * as parser from 'regexp-tree';
import TypeIt from 'typeit';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [
    trigger('errorLeave', [
      transition(':leave', [
        animate('300ms ease', style({ opacity: 0 }))
      ])
    ]),
    trigger('btnEnter', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('3000ms ease', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class MainComponent implements OnInit {
  @Output() showEntry= new EventEmitter();
  @ViewChild('regex') regexChild!: VisualizerComponent;
  @ViewChild('nfa') nfaChild!: VisualizerComponent;
  @ViewChild('dfa') dfaChild!: VisualizerComponent;
  title = 'regular expressions and finite automata';
  error: string | undefined = undefined;
  loading: any = null;

  constructor() {}

  ngOnInit(): void {
    new (TypeIt as any)('#title', {
      cursor: false,
      strings: this.title
    }).go();
  }

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
      setTimeout(() => this.error = undefined, 1000);
    }
  }

  async validate(text: string) {
    const tokens = ['start'].concat([...text]);
    this.loading = true;
    const results: boolean[] = await Promise.all([
      //We will ignore regex return as we cant validate a syntax tree
      this.regexChild.validate(tokens),
      this.dfaChild.validate(tokens),
      this.nfaChild.validate(tokens)
    ]);
    this.regexChild.startAnimation(results[1]);
    this.dfaChild.startAnimation(results[1]);
    this.nfaChild.startAnimation(results[2]);
    this.loading = null;
  }

  goToTutotial() {
    this.showEntry.emit();
  }
}
