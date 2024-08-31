import { Route } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

export const appRoutes: Route[] = [
  {
    loadChildren: () =>
      import('./pages/pets/pets.module').then((m) => m.PetsModule),
    path: '',
  },
  { path: '**', component: NotFoundComponent },
];
