import { animate, style, transition, trigger } from '@angular/animations';
import { NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, HostListener, ViewContainerRef, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import TypeIt from 'typeit'

@Component({
  selector: 'app-entry-scene',
  templateUrl: './entry-scene.component.html',
  styleUrls: ['./entry-scene.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('3000ms ease', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class EntrySceneComponent implements OnInit {
  @Output() showMain = new EventEmitter();
  showButtons: boolean = false;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    this.showButtons = true;
    new (TypeIt as any)('#typeItTarget', {
      html: true,
      cursor: false,
      lifelike: true,
      speed: 50
    })
    .type('<h3>welcome to my final project!</h3>')
    .break()
    .type('<h1><b>REGULAR EXPRESSIONS AND THEIR CONVERSIONS TO FINITE AUTOMATA</b></h1>')
    .break()
    .type('<h4>here you can find a little background information about the computational models you will be looking at and the conversions between them.</h4>')
    .exec(() => {
      this.showButtons = true;
      new (TypeIt as any)('#hint', {
        strings: '(hint) you can exit this screen by hitting escape!'
      }).go();
    })
    .go();
  }

  @HostListener('document:keydown.escape')
  escape() {
    if (!this.modalService.hasOpenModals()) {
      this.showMain.emit();
    }
  }

  openTutorial(content: TemplateRef<any>) {
    this.modalService.open(content, { 
      scrollable: true, 
    });
  }
}
