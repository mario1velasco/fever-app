import { Component, input, output } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  // * Inputs and Outputs
  /** Disable the button */
  public disabled = input<boolean>();
  /** The type of the button */
  public type = input.required<'button' | 'submit'>();
  /** The text of the button */
  public text = input.required<string>();
  /** The size of the button */
  public size = input<'small' | 'medium' | 'large'>('medium');
  /** The color of the button */
  public color = input<'primary' | 'secondary' | 'danger'>('primary');
  /** Event emitted when the button is clicked */
  public btnClick = output<void>();
}
