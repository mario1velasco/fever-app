import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetsService } from '../shared/pets.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '@fever-pets/ui';

@Component({
  selector: 'app-pet-details',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './pet-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetDetailsComponent {
  // * Injectors
  public activatedRoute = inject(ActivatedRoute);
  public petService = inject(PetsService);
  public router = inject(Router);
  // * Routing Variables
  public userId = this.activatedRoute.snapshot.paramMap.get('petId');
  // * Signals
  public pet = toSignal(this.petService.get(this.userId));
  // * Variables
  public petHealth = computed(() => {
    const pet = this.pet();
    if (!pet) return 0;
    return this.petService.calculatePetHealth(pet);
  });

  // **********************
  // ****** Events  *******
  // **********************
  /**
   * Handles the click event of the view details button.
   */
  onClickBtnBack() {
    this.router.navigate(['']);
  }
}
