import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppComponent } from './app.component';
import { VisualizerComponent } from './children/visualizer/visualizer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EntrySceneComponent } from './children/entry-scene/entry-scene.component';
import { MainComponent } from './children/main/main.component';

@NgModule({
  declarations: [
    AppComponent,
    VisualizerComponent,
    EntrySceneComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
