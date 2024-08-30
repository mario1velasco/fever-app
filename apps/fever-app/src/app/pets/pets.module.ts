import { NgModule } from '@angular/core';

import { Route, RouterModule } from '@angular/router';
import { PetListComponent } from './pet-list/pet-list.component';
import { PetDetailsComponent } from './pet-details/pet-details.component';
const routes: Route[] = [
  {
    component: PetListComponent,
    path: '',
  },
  {
    component: PetDetailsComponent,
    path: ':petId',
  },
  { path: '**', pathMatch: 'full', redirectTo: '' },
];
@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class PetsModule {}
