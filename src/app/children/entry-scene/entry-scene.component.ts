import { Component, EventEmitter, OnInit, Output, HostListener } from '@angular/core';
import TypeIt from 'typeit'

@Component({
  selector: 'app-entry-scene',
  templateUrl: './entry-scene.component.html',
  styleUrls: ['./entry-scene.component.css'],
  host: {
    '(document:keydown.escape)': 'escape()'
  }
})
export class EntrySceneComponent implements OnInit {
  @Output() showMain = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    new (TypeIt as any)('#welcome', {
      strings: 'hi, welcome to my final project',
      startDelay: 500
    }).go();
  }

  escape() {
    this.showMain.emit();
  }
}
