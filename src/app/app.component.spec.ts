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

  it(`should have as title 'regex'`, () => {
    expect(app.title).toEqual('regular expressions and finite automata');
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.header h1')?.textContent).toContain('regular expressions and finite automata');
  });

  it('should not allow empty strings', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    
    app.onClick('');
    expect(app.error).toBeTruthy();
    expect(app.error).toEqual('Please enter an expression first.')
  });
});
