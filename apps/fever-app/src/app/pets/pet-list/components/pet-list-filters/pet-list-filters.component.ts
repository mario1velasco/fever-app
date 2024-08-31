import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetFormType } from '../../../shared/pets.types';
import { ButtonComponent, DropdownComponent } from '@fever-pets/ui';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pet-list-filters',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    ReactiveFormsModule,
    DropdownComponent,
  ],
  templateUrl: './pet-list-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetListFiltersComponent {
  // * Inputs and Outputs
  public form = input.required<PetFormType>();
  public formSubmit = output<void>();
  public formReset = output<void>();

  // * Variables
  public isMaximized = false;
  public isFormVisible = false;

  // *******************
  // * EVENTS
  // *******************
  onClickBtnToggleMaximize() {
    this.isMaximized = !this.isMaximized;
  }
  onClickBtnToggleFormVisibility() {
    this.isFormVisible = !this.isFormVisible;
  }
}
