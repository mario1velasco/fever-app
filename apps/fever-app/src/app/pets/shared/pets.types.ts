import { FormGroup, FormControl } from '@angular/forms';

export interface Pet {
  id: number;
  name: string;
  kind: string;
  weight: number;
  height: number;
  length: number;
  photo_url: string;
  description: string;
  // Optional for cats
  number_of_lives?: number;
}

export type PetFormType = FormGroup<{
  sortBy: FormControl<string | null>;
  searchByName: FormControl<string | null>;
}>;

export type sortBy =
  | 'nameAsc'
  | 'nameDesc'
  | 'weightAsc'
  | 'weightDesc'
  | 'heightAsc'
  | 'heightDesc'
  | 'lengthAsc'
  | 'lengthDesc'
  | 'kindAsc'
  | 'kindDesc';
