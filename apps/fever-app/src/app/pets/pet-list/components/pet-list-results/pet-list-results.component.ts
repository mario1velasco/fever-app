import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@fever-pets/ui';
import { PetsService } from '../../../shared/pets.service';
import { Pet } from '../../../shared/pets.types';

@Component({
  selector: 'app-pet-list-results',
  standalone: true,
  providers: [PetsService],
  imports: [CommonModule, ButtonComponent],
  templateUrl: './pet-list-results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetListResultsComponent {
  // * Injectors
  public petService = inject(PetsService);
  // * Signals
  public pets = input.required<Pet[]>();

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
