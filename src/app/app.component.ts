import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('400ms ease', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AppComponent { 
  private _entry = true;
  public get entry() {
    return this._entry;
  }

  showMain() {
    this._entry = false;
  }

  showEntry() {
    this._entry = true;
  }
}