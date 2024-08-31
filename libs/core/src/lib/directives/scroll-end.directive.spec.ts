/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ScrollEndDirective } from './scroll-end.directive'; // Adjust the path as needed

// A simple host component to apply the directive to
@Component({
  template: `<div libScrollEnd (scrollEnd)="onScrollEnd()"></div>`,
})
class TestHostComponent {
  onScrollEnd() {
    /* Mock function for testing */
  }
}

// Mock window.scrollTo before your tests
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
});

describe('ScrollEndDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let directiveEl: DebugElement;
  let directiveInstance: ScrollEndDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestHostComponent], // Only declare the host component
      imports: [ScrollEndDirective], // Import the standalone directive
    });
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    directiveEl = fixture.debugElement.query(By.directive(ScrollEndDirective));
    directiveInstance = directiveEl.injector.get(ScrollEndDirective);

    // Spy on the output event emitter
    jest.spyOn(directiveInstance.scrollEnd, 'emit');

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(directiveInstance).toBeTruthy();
  });

  it('should emit scrollEnd when scrolled to the bottom', () => {
    // Simulate scrolling to the bottom
    window.scrollTo(0, document.documentElement.scrollHeight);
    window.dispatchEvent(new Event('scroll'));

    expect(directiveInstance.scrollEnd.emit).toHaveBeenCalled();
  });

  it('should not emit scrollEnd when not scrolled to the bottom', () => {
    // Temporarily override scrollHeight for this test
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 2000,
      writable: true, // Make it writable for this test
    });

    fixture.detectChanges(); // Make sure Angular is aware of the changes
    // Simulate scrolling somewhere in the middle
    window.scrollTo(0, document.documentElement.scrollHeight / 2);
    window.dispatchEvent(new Event('scroll'));

    expect(directiveInstance.scrollEnd.emit).not.toHaveBeenCalled();

    // Restore the original behavior after the test
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      writable: false,
    });
  });
});
