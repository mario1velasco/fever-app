import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@fever-pets/ui';
import { PetsService } from '../../../shared/pets.service';
import { PetState } from '../../../shared/pets.types';
import { PetListFiltersComponent } from '../pet-list-filters/pet-list-filters.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pet-list-results',
  standalone: true,
  imports: [CommonModule, ButtonComponent, PetListFiltersComponent],
  templateUrl: './pet-list-results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetListResultsComponent {
  // * Injectors
  public petService = inject(PetsService);
  public router = inject(Router);
  // * Signals
  public pets = input.required<PetState>();
  // * Variables
  protected readonly object = Object;

  // **********************
  // ****** Events  *******
  // **********************
  /**
   * Handles the click event of the view details button.
   *
   * @param {number} id - The ID of the item to view details for.
   */
  public onClickBtnViewDetails(id: number) {
    this.router.navigate(['', id]);
  }
}
