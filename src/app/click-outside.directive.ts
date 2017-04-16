import {Directive, ElementRef, Output, EventEmitter, HostListener} from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
  constructor(private _elementRef: ElementRef) {
  }

  @Output()
  public appClickOutside = new EventEmitter<MouseEvent>();

  @HostListener('document:click', ['$event', '$event.target'])
  public onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (!targetElement) {
      return;
    }

    const clickInside = this._elementRef.nativeElement.contains(targetElement);
    if (!clickInside) {
      this.appClickOutside.emit();
    }
  }
}
