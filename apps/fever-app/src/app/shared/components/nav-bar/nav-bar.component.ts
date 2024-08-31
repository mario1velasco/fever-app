import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@fever-pets/ui';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './nav-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBarComponent {
  // **********************
  // ****** Events  *******
  // **********************
  /**
   * Handles the click event of the view details button.
   */
  public onClickBtnContact() {
    window.open('https://www.linkedin.com/in/mariovelascoalonso/', '_blank');
  }
}
