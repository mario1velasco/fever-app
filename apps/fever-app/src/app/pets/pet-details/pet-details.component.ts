import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetsService } from '../shared/pets.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Pet } from '../shared/pets.types';

@Component({
  selector: 'app-pet-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pet-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetDetailsComponent {
  // * Injectors
  public petService = inject(PetsService);
  // * Signals
  public pets = toSignal(this.petService.getList());
}
