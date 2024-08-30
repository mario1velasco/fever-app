import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Pet } from './pets.types';
import { ApiService } from '@fever-pets/core';

@Injectable()
export class PetsService {
  // * Injectors
  private apiService = inject(ApiService);

  // **********************
  // ****** API Methods  *******
  // **********************
  /**
   * The function `getList` retrieves a list of pets from a specified API endpoint.
   * @returns An Observable of an array of Pet objects is being returned.
   */
  getList(): Observable<Pet[]> {
    const path = `/fever_pets_data/pets`;
    return this.apiService.get(path) as Observable<Pet[]>;
  }
  /**
   * This function retrieves a pet by its ID from an API using TypeScript and returns it as an
   * Observable.
   * @param {string} id - The `id` parameter is a string that represents the unique identifier of a
   * pet. It is used to retrieve a specific pet from the API by appending it to the URL endpoint.
   * @returns An Observable of type Pet is being returned.
   */
  get(id: string): Observable<Pet> {
    const path = `/fever_pets_data/pets/${id}`;
    return this.apiService.get(path) as Observable<Pet>;
  }

  // **********************
  // ****** Methods *******
  // **********************
  calculatePetHealth(pet: Pet): string {
    const healthValue = pet.weight / (pet.height * pet.length);

    if (pet.kind === 'cat' && pet.number_of_lives === 1) {
      return 'unhealthy';
    } else if (healthValue < 2 || healthValue > 5) {
      return 'unhealthy';
    } else if (healthValue >= 3 && healthValue <= 5) {
      return 'healthy';
    } else {
      return 'very healthy';
    }
  }
}
