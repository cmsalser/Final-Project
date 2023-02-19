import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { VisualizerComponent } from './children/visualizer/visualizer.component';

class VisualizerComponentMock {
  public data = '';
}

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        VisualizerComponent,
        NgbPopover
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });
});
