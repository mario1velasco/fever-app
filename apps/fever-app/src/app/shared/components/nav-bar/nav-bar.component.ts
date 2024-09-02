import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent, DialogComponent } from '@fever-pets/ui';
import { Router } from '@angular/router';
import { PetsService } from '../../../pages/pets/shared/pets.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { PetOfTheDay } from '../../../pages/pets/shared/pets.types';
import { DeviceService } from '@fever-pets/core';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, ButtonComponent, DialogComponent],
  templateUrl: './nav-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBarComponent {
  // * Injectors
  public router = inject(Router);
  public petService = inject(PetsService);
  private destroyRef = inject(DestroyRef);

  // * Signals Variables
  public device = toSignal(inject(DeviceService).getDevice());
  // * Variables
  public isOpen = signal<boolean>(false);
  public petOfTheDay: PetOfTheDay | undefined;

  // **********************
  // ****** Events  *******
  // **********************
  /**
   * Handles the click event of the view details button.
   */
  onClickBtnContact() {
    window.open('https://www.linkedin.com/in/mariovelascoalonso/', '_blank');
  }

  onClickBtnPetOfTheDay() {
    this.petService
      .getPetOfTheDay()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((petOfTheDay) => {
        this.petOfTheDay = petOfTheDay;
        this.isOpen.set(true);
      });
  }

  onClickDialogConfirmBtn() {
    this.isOpen.set(false);
  }
}
