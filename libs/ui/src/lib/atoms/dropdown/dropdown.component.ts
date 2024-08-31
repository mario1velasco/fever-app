/* eslint-disable @typescript-eslint/no-empty-function */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'ui-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent implements ControlValueAccessor {
  // * Injectors
  private cd = inject(ChangeDetectorRef);
  private elRef = inject(ElementRef);

  // * Inputs & Outputs
  /** List of options to display in the dropdown */
  public options = input<string[]>([]);
  /** Placeholder text for the dropdown */
  public placeholder = input<string>('Select an option');
  /** Selected option */
  public selectedOption = input<string | null>(null);
  /** Event emitted when the selected option changes */
  public selectionChange = output<string>();

  // * Signals
  public optionSelected: string | null = null;
  // * Variables
  isOpen = false;
  // * ControlValueAccessor functions
  onChange = (value: unknown): void => {};
  onTouched = () => {};

  constructor() {
    effect(() => {
      this.optionSelected = this.selectedOption();
    });
  }

  // *************
  // * EVENTS
  // *************
  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.cd.markForCheck(); // Ensure Angular updates the view
    }
  }

  onCLickToggleDropdown() {
    this.isOpen = !this.isOpen;
    this.onTouched();
  }

  onClickSelectOption(option: string) {
    this.optionSelected = option;
    this.onChange(this.optionSelected);
    this.onTouched();
    this.isOpen = false;
    this.cd.markForCheck();
    this.selectionChange.emit(option);
  }
  // * ControlValueAccessor implementation
  writeValue(value: string): void {
    this.optionSelected = value;
    this.onChange(this.optionSelected);
    this.onTouched();
    this.cd.markForCheck();
  }

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
