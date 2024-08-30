import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { PetsService } from '../shared/pets.service';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [CommonModule],
  providers: [PetsService],
  templateUrl: './pet-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetListComponent {
  // * Injectors
  public petService = inject(PetsService);
  // * Signals
  public pets = toSignal(this.petService.getList());
}
