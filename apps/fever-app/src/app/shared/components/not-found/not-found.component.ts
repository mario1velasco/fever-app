import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  imports: [],
  selector: 'app-not-found',
  standalone: true,
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
