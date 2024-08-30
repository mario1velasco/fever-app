export interface PetsList {
  id: string;
  title: string;
  duration: string;
  budget: string;
  release_date: string;
}

export interface Pet {
  id: number | string;
  name: string;
  kind: string;
  weight: number;
  height: number;
  length: number;
  photo_url: string;
  description: string;
  number_of_lives?: number;
  // Optional for cats
}
