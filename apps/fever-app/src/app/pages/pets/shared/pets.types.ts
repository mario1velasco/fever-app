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

export interface PetOfTheDay {
  day: string;
  pet: Pet;
}

export type SortType =
  | 'id'
  | 'nameAsc'
  | 'weightAsc'
  | 'heightAsc'
  | 'lengthAsc'
  | 'kindAsc';

export type PetFormType = FormGroup<{
  sortBy: FormControl<SortType | null>;
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
