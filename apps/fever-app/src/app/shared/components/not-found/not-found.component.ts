import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { ButtonComponent } from '@gbrepo/ui';

@Component({
  imports: [ButtonComponent],
  selector: 'app-not-found',
  standalone: true,
  styleUrls: ['./not-found.component.scss'],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {
  // * Injectors
  private location = inject(Location);

  // * Events
  onClickButton(): void {
    this.location.back();
  }
}
