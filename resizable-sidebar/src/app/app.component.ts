import { Component } from '@angular/core';
import { ResizableLayoutLayout } from './resizable-layout/resizable-layout.layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [ResizableLayoutLayout]
})
export class AppComponent {
}
