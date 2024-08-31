import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Pet } from './pets.types';
import { ApiService } from '@fever-pets/core';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class PetsService {
  // * Injectors
  private apiService = inject(ApiService);

  // **********************
  // ****** API Methods  *******
  // **********************
  /**
   * The function `getList` retrieves a list of pets from a specified API endpoint, with optional
   * filtering, pagination, and sorting based on provided parameters.
   * @param {Partial<Pet>} [filters] - An optional object containing filter criteria for the pet list.
   * @param {number} [page] - The page number for pagination (default is 1).
   * @param {number} [perPage] - The number of items per page (default is 10).
   * @param {string[]} [sort] - An array of field names for sorting (e.g., ['name', '-weight'] for
   * ascending name and descending weight).
   * @returns An Observable of an array of Pet objects, potentially filtered, paginated, and sorted
   * based on the provided parameters.
   */
  getList(
    filters?: Partial<Pet>,
    page = 1,
    perPage = 10,
    sort?: string[]
  ): Observable<Pet[]> {
    let params = new HttpParams()
      .set('_page', page.toString())
      .set('_per_page', perPage.toString());

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params = params.append(key, value.toString());
        }
      });
    }

    if (sort && sort.length > 0) {
      params = params.set('_sort', sort.join(','));
    }

    const path = `/fever_pets_data/pets`;
    return this.apiService.get(path, { params }) as Observable<Pet[]>;
  }
  /**
   * This function retrieves a pet by its ID from an API using TypeScript and returns it as an
   * Observable.
   * @param {number} id - The `id` parameter is a number that represents the unique identifier of a
   * pet. It is used to retrieve a specific pet from the API by appending it to the URL endpoint.
   * @returns An Observable of type Pet is being returned.
   */
  get(id: number): Observable<Pet> {
    const path = `/fever_pets_data/pets/${id.toString()}`;
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
