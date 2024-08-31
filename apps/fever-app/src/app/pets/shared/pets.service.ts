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
}
