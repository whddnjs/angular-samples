import { Component } from '@angular/core';
import { ClickOutsideDirective } from './click-outside.directive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [
    ClickOutsideDirective
  ]
})
export class AppComponent {

  isClicked = false;
}
