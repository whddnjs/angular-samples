import { Component } from '@angular/core';
import { CustomEditorComponent } from './custom-editor/custom-editor.component';

@Component({
  selector: 'app-root',
  imports: [CustomEditorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'custom-text-editor';
}
