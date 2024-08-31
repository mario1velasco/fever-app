export interface PetsList {
  id: string;
  title: string;
  duration: string;
  budget: string;
  release_date: string;
}

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
