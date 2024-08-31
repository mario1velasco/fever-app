import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({ standalone: true, selector: '[libScrollEnd]' })
export class ScrollEndDirective {
  @Output() public scrollEnd = new EventEmitter<void>();

  //  *****************
  //  **** EVENTS *****
  //  *****************
  /**
   * This TypeScript function detects when the user has scrolled to the bottom of the page and emits
   * an event.
   */
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight
    ) {
      this.scrollEnd.emit();
    }
  }
}
