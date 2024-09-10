import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CountItemsPipe } from './count-item.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CountItemsPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  items: string[] = ['아이템 1', '아이템 2', '아이템 3'];

  addItem() {
    this.items.push('새로운 아이템');
  }
}
