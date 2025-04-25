import { Component, signal } from '@angular/core';
import { CdkDragMove, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-resizable-layout',
  templateUrl: './resizable-layout.layout.html',
  styleUrl: './resizable-layout.layout.css',
  imports: [DragDropModule],
  host: {
    class: 'flex h-screen'
  }
})
export class ResizableLayoutLayout {
  private readonly DEFAULT_WIDTH = 300;
  private readonly MIN_WIDTH = 200;
  private readonly MAX_WIDTH = 600;

  readonly currentWidth = signal(this.DEFAULT_WIDTH);

  onDragMoved(event: CdkDragMove) {
    const pointerX = event.pointerPosition.x;

    const newWidth = Math.max(this.MIN_WIDTH, Math.min(this.MAX_WIDTH, pointerX));

    this.currentWidth.set(newWidth);

    const element = event.source.element.nativeElement;
    element.style.transform = 'none';
  }

  reset() {
    this.currentWidth.set(this.DEFAULT_WIDTH);
  }
}
