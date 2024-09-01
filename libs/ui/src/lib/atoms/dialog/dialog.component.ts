import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'ui-dialog',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  // * Inputs and Outputs
  /** Disable the button */
  public title = input<string>();
  /** The text of the button for the confirm button */
  public confirmButtonText = input<string>('Confirm');
  /** The text of the button for the cancel button */
  public cancelButtonText = input<string>('Cancel');
  /** Disable the cancel button  */
  public cancelButtonDisabled = input<boolean>(false);
  /** Hide the cancel button */
  public hideCancelButton = input<boolean>(false);
  /** Disable the confirm button  */
  public confirmButtonDisabled = input<boolean>(false);
  /** Control dialog visibility using the isOpen property  */
  public isOpen = input<boolean>(true);
  /** Event emitted when the confirm button is clicked  */
  public confirm = output<void>();
  /** Event emitted when the dialog is closed  */
  public closed = output<void>();
}
