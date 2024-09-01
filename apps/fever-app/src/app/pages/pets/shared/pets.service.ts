import { Injectable, inject, signal } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { Pet, PetOfTheDay, PetState } from './pets.types';
import { ApiService, LocalStorageService } from '@fever-pets/core';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PetsService {
  // * Injectors
  private apiService = inject(ApiService);
  private localStorageService = inject(LocalStorageService);
  // * Signals Variables
  private pets = signal<PetState>({});

  // * Variables
  private _currentPage = 1;

  // * Getters and Setters
  public get currentPage(): number {
    return this._currentPage;
  }

  public set currentPage(value: number) {
    this._currentPage = value;
  }

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
   * Retrieves a pet by its ID from the API or the local cache and returns it as an Observable.
   * If `id` is null or undefined, it returns an empty Pet object.
   * If the pet is found in the local cache, it returns an Observable of the cached pet.
   * If the pet is not found in the local cache, it sends a GET request to the API to fetch the pet
   * and returns an Observable of the pet.
   * @param {string | null} id - The ID of the pet to retrieve.
   * @returns An Observable of type Pet.
   */
  get(id: string | null): Observable<Pet> {
    if (!id) {
      return of({} as Pet);
    }
    const petInState = this.pets()[Number(id)];
    if (petInState) {
      return of(petInState);
    }
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
  getPetList(startId = 1, count?: number): PetState | object {
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

  /**
   * ! NOTE: Not happy with the solution but I dont know how to get the last element (id).
   * Fetches all pets from the API. This is a temporary solution to load all pets and is not
   * the final solution. It does not have pagination or sorting. It will be replaced when the
   * API is updated to support pagination and sorting.
   *
   * @returns An Observable emitting an array of `Pet` objects representing all pets.
   */
  getPetOfTheDay(): Observable<PetOfTheDay> {
    // ! Temporary solution I need loading all pets. I could not find a solution to get the last item (id).
    // ! Sorting descending not working properly.
    const path = `/fever_pets_data/pets`;
    // To prevent calling the API loading all pets all the time
    const petOfTheDay = this.localStorageService.getData(
      'petOfTheDay'
    ) as PetOfTheDay | null;

    if (petOfTheDay && this.isPetOfTheDaySameDayAsNow(petOfTheDay)) {
      return of(petOfTheDay);
    }
    return this.apiService.get(path).pipe(
      map((response: unknown) => response as Pet[]), // Cast the response to Pet[]
      map((pets) => {
        return this.generateAndSavePetOfTheDay(pets);
      })
    );
  }

  /**
   * Transforms an array of `Pet` objects into an object with keys equal to the `id` property of each
   * pet and values equal to the `Pet` object itself.
   *
   * @param response - An array of `Pet` objects.
   * @returns An object with keys equal to the `id` property of each pet and values equal to the `Pet` object itself.
   */
  parsePetsResponse(response: Pet[]): PetState {
    const pets: PetState = {};

    for (const pet of response) {
      pets[pet.id] = pet;
    }

    return pets;
  }

  // **********************
  // ****** Private Methods *******
  // **********************

  /**
   * Generates an HttpParams object from the given parameters.
   * @param filters - An object containing filter criteria for the pets.
   * @param page - The page number for pagination (default: 1).
   * @param perPage - The number of pets per page (default: 10).
   * @param sort - An array of sort criteria. Valid values are:
   *   - 'nameAsc' (Ascending order by name)
   *   - 'nameDesc' (Descending order by name)
   *   - 'weightAsc', 'weightDesc', 'heightAsc', 'heightDesc', 'lengthAsc', 'lengthDesc'
   *   - 'kindAsc', 'kindDesc'
   *   Invalid sort values will be ignored.
   * @returns An HttpParams object containing the generated parameters.
   */
  private generateHttpParams(
    filters?: Partial<Pet>,
    page = 1,
    // ! Also implemented for items per page: https://github.com/typicode/json-server?tab=readme-ov-file#sort
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
    // ! Also implemented for descending as documentation says: https://github.com/typicode/json-server?tab=readme-ov-file#sort
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
  ): PetState | object {
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

  /**
   * Checks if the date stored in `_petOfTheDay` is the same day as today.
   * @returns True if the date stored in `_petOfTheDay` is the same day as today.
   */
  private isPetOfTheDaySameDayAsNow(petOfTheDay: PetOfTheDay): boolean {
    if (!petOfTheDay) {
      return false;
    }
    const now = new Date();
    const petDate = new Date(petOfTheDay.day);
    return (
      petDate.getDate() === now.getDate() &&
      petDate.getMonth() === now.getMonth() &&
      petDate.getFullYear() === now.getFullYear()
    );
  }

  private generateAndSavePetOfTheDay(pets: Pet[]): PetOfTheDay {
    if (!pets.length) {
      return {} as PetOfTheDay;
    }
    const lastPetId = pets[pets.length - 1].id;
    const randomId = this.getRandomNumber(lastPetId);
    const newPetOfTheDay: PetOfTheDay = {
      day: new Date().toString(),
      pet: pets[randomId],
    };
    this.localStorageService.saveData('petOfTheDay', newPetOfTheDay);

    return newPetOfTheDay;
  }

  private getRandomNumber(maxValue: number): number {
    const random = Math.random() * maxValue;
    const randomNumber = Math.ceil(random);
    return randomNumber;
  }
}
