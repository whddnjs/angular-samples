import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, inject } from "@angular/core";

@Directive({
  selector: '[appClickOutside]',
  standalone: true
})
export class ClickOutsideDirective {

  private readonly element = inject(ElementRef);

  @Output() appClickOutside = new EventEmitter<void>();
  @Input() ignoreElement?: HTMLElement;

  @HostListener('document:mousedown', ['$event'])
  onClick(event: Event): void {
    const target = event.target as Node;
    const clickedInside = this.element.nativeElement.contains(target);
    const clickedOnIgnoredElement = this.ignoreElement?.contains(target);
    if (!clickedInside && !clickedOnIgnoredElement) {
      this.appClickOutside.emit();
    }
  }
}