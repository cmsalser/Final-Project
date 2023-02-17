import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrySceneComponent } from './entry-scene.component';

describe('EntrySceneComponent', () => {
  let component: EntrySceneComponent;
  let fixture: ComponentFixture<EntrySceneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntrySceneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntrySceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
