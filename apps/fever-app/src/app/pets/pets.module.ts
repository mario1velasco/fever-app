import { NgModule } from '@angular/core';

import { Route, RouterModule } from '@angular/router';
const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pet-list/pet-list.component').then((m) => m.PetListComponent),
  },
  {
    path: ':petId',
    loadComponent: () =>
      import('./pet-details/pet-details.component').then(
        (m) => m.PetDetailsComponent
      ),
  },
  { path: '**', pathMatch: 'full', redirectTo: '' },
];
@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class PetsModule {}
