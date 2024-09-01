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

export interface PetState {
  [key: number]: Pet;
}

export function isPetState(variable: any): variable is PetState {
  if (
    typeof variable !== 'object' ||
    variable === null ||
    Object.keys(variable).length === 0
  ) {
    return false; // Must be an object and not null
  }

  for (const key in variable) {
    if (isNaN(Number(key))) {
      return false; // Keys must be numeric (or convertible to numbers)
    }

    const pet = variable[key];
    if (typeof pet !== 'object' || pet === null) {
      return false; // Values must be objects and not null
    }
  }

  return true;
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
