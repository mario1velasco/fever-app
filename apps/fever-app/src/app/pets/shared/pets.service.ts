import { Injectable, inject, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Pet, PetState } from './pets.types';
import { ApiService } from '@fever-pets/core';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class PetsService {
  // * Injectors
  private apiService = inject(ApiService);
  // * Signals Variables
  private pets = signal<PetState>({});

  // **********************
  // ****** API Methods  *******
  // **********************
  /**
   * Fetches a list of pets from the API with optional filtering, pagination, and sorting.
   *
   * @param filters (Optional) An object containing filter criteria for the pets.
   * @param page (Optional) The page number for pagination (default: 1).
   * @param perPage (Optional) The number of pets per page (default: 10).
   * @param sort (Optional) An array of sort criteria. Valid values are:
   *   - 'nameAsc' (Ascending order by name)
   *   - 'nameDesc' (Descending order by name)
   *   - 'weightAsc', 'weightDesc', 'heightAsc', 'heightDesc', 'lengthAsc', 'lengthDesc'
   *   - 'kindAsc', 'kindDesc'
   *   Invalid sort values will be ignored.
   *
   * @returns An Observable emitting an array of `Pet` objects representing the fetched pets.
   */
  getList(
    filters?: Partial<Pet>,
    page = 1,
    perPage = 10,
    sort?: string[]
  ): Observable<Pet[]> {
    const params = this.generateHttpParams(filters, page, perPage, sort);
    const path = `/fever_pets_data/pets`;
    return this.apiService.get(path, { params }).pipe(
      map((response: unknown) => response as Pet[]), // Cast the response to Pet[]
      tap((petsResponse: Pet[]) => {
        const parseResponseToObject = this.parsePetsResponse(petsResponse);
        this.pets.update((pets) => {
          return { ...pets, ...parseResponseToObject };
        });
      })
    ) as Observable<Pet[]>;
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
  /**
   * Returns a subset of the given `pets` object, containing only pets with
   * IDs between `startId` and `startId + count - 1`.
   * @param pets - The object containing all the pets
   * @param startId - The starting ID of the subset
   * @param count - The number of pets to include in the subset. Undefined by default
   * will return all pets (for mobile devices)
   * @returns A new object containing the subset of pets
   */
  getPetList(startId = 1, count?: number): PetState {
    return this.getPetsByIdRange(this.pets(), startId, count);
  }

  /**
   * Calculates the health of a pet based on its weight, height, and length.
   *
   * @param {Pet} pet - A Pet object containing the pet's weight, height, length, kind, and number of lives.
   * @returns {string} A string indicating the health of the pet: "unhealthy", "healthy", or "very healthy".
   */
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

  // **********************
  // ****** Private Methods *******
  // **********************
  private generateHttpParams(
    filters?: Partial<Pet>,
    page = 1,
    perPage = 10,
    sort?: string[]
  ): HttpParams {
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

    if (sort) {
      params = this.addSortHttpParams(params, sort);
    }
    return params;
  }
  /**
   * Adds sort parameters to the given HttpParams.
   *
   * @param params - The HttpParams to which the sort parameters will be added.
   * @param sort - An array of sort criteria.
   * @returns The updated HttpParams.
   */
  private addSortHttpParams(params: HttpParams, sort: string[]): HttpParams {
    // Also implemented for descending as documentation says: https://github.com/typicode/json-server?tab=readme-ov-file#sort
    const validSortValues = [
      'nameAsc',
      'nameDesc',
      'weightAsc',
      'weightDesc',
      'heightAsc',
      'heightDesc',
      'lengthAsc',
      'lengthDesc',
      'kindAsc',
      'kindDesc',
    ];

    if (sort && sort.length > 0) {
      const transformedSort = sort
        .filter((s) => typeof s === 'string' && validSortValues.includes(s)) // Validate sort values
        .map((s) =>
          s.endsWith('Asc') ? s.slice(0, -3) : `-${s.slice(0, -4)}`
        ); // Transform

      params = params.set('_sort', transformedSort.join(','));
    }

    return params;
  }

  /**
   * Transforms an array of `Pet` objects into an object with keys equal to the `id` property of each
   * pet and values equal to the `Pet` object itself.
   *
   * @param response - An array of `Pet` objects.
   * @returns An object with keys equal to the `id` property of each pet and values equal to the `Pet` object itself.
   */
  private parsePetsResponse(response: Pet[]): PetState {
    const pets: PetState = {};

    for (const pet of response) {
      pets[pet.id] = pet;
    }

    return pets;
  }

  /**
   * Returns a subset of the given `pets` object, containing only pets with
   * IDs between `startId` and `startId + count - 1`.
   * @param pets - The object containing all the pets
   * @param startId - The starting ID of the subset
   * @param count - The number of pets to include in the subset
   * @returns A new object containing the subset of pets
   */
  private getPetsByIdRange(
    pets: PetState,
    startId: number,
    count?: number
  ): PetState {
    const result: PetState = {};
    let added = 0;

    // Return all pets if no count is provided. Useful for mobile to show all data that we got cached
    if (!count) {
      return pets;
    }

    // Return no pets if startId is greater than the number of pets. Useful for pagination.
    // Only iterate count times. Does not iterate the whole object (Better performance).
    for (
      let id = startId;
      id <= Object.keys(pets).length && added < count;
      id++
    ) {
      if (pets[id]) {
        result[id] = pets[id];
        added++;
      }
    }

    return result;
  }
}
