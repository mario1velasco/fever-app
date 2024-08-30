import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { PetsService } from '../shared/pets.service';
import { ButtonComponent } from '@fever-pets/ui';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, NavBarComponent],
  providers: [PetsService],
  templateUrl: './pet-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetListComponent {
  // * Injectors
  public petService = inject(PetsService);
  // * Signals
  public pets = toSignal(this.petService.getList());

  // **********************
  // ****** Events  *******
  // **********************
  /**
   * Handles the click event of the view details button.
   *
   * @param {number} id - The ID of the item to view details for.
   */
  public onClickBtnViewDetails(id: number) {
    console.log('View Details', id);
  }
}
