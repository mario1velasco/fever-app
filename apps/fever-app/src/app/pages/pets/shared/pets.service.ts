import { Injectable, inject, signal } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { Pet, PetOfTheDay, SortType } from './pets.types';
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
  private pets = signal<Pet[]>([]);

  // * Variables
  private _currentPage = 0;
  private _sortType: SortType = 'id';

  // * Getters and Setters
  public get currentPage(): number {
    return this._currentPage;
  }
  public set currentPage(value: number) {
    this._currentPage = value;
  }

  public get sortType(): SortType {
    return this._sortType;
  }
  public set sortType(value: SortType) {
    this._sortType = value;
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
        this.pets.update((pets) => {
          return this.deleteDuplicateObjectsById([...pets, ...petsResponse]);
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
    const petInState = this.pets().find((pet) => pet.id === Number(id));
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
   * Returns a subset of the pets, sorted and paginated based on the provided parameters.
   * @param startPosition - The starting index of the subset
   * @param count - The number of pets to include in the subset. Undefined by default
   * will return all pets (for mobile devices)
   * @param sortType - The sort criteria. Valid values are:
   *   - 'id' (Ascending order by ID)
   *   - 'nameAsc' (Ascending order by name)
   *   - 'weightAsc', 'heightAsc', 'lengthAsc' (Ascending order by weight, height, length)
   *   - 'kindAsc' (Ascending order by kind)
   *   Invalid sort values will be ignored.
   * @returns A new object containing the subset of pets
   */
  getPetList(startPosition = 0, count?: number, sortType?: SortType): Pet[] {
    // 1. Sort the pets based on the provided sortType
    const sortedPets = [...this.pets()].sort((a, b) => {
      switch (sortType) {
        case 'id':
          return a.id - b.id;
        case 'nameAsc':
          return a.name.localeCompare(b.name);
        case 'weightAsc':
          return a.weight - b.weight;
        case 'heightAsc':
          return a.height - b.height;
        case 'lengthAsc':
          return a.length - b.length;
        case 'kindAsc':
          return a.kind.localeCompare(b.kind);
        default:
          return 0;
      }
    });

    // 2. Apply pagination or retrieve all if count is not provided
    if (count !== undefined) {
      const endIndex = startPosition + count;
      return sortedPets.slice(startPosition, endIndex);
    } else {
      return sortedPets; // Return the whole sorted array
    }
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

  private deleteDuplicateObjectsById<T extends { id: any }>(array: T[]): T[] {
    const uniqueObjects: { [id: string]: T } = {};

    for (const obj of array) {
      uniqueObjects[obj.id] = obj; // Keep only the last object with a specific id
    }

    return Object.values(uniqueObjects);
  }
}
