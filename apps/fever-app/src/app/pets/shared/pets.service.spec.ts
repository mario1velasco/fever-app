import { TestBed } from '@angular/core/testing';
import { PetsService } from './pets.service';
import { ApiService } from '@fever-pets/core';
import { of } from 'rxjs';
import { Pet } from './pets.types';

describe('PetsService', () => {
  let service: PetsService;
  let apiServiceSpy: jest.Mocked<ApiService>;

  beforeEach(() => {
    const spy = {
      get: jest.fn(), // Create a mock function for ApiService's get method
    };

    TestBed.configureTestingModule({
      providers: [PetsService, { provide: ApiService, useValue: spy }],
    });

    service = TestBed.inject(PetsService);
    apiServiceSpy = TestBed.inject(ApiService) as jest.Mocked<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a list of pets', () => {
    const mockPetsList: Pet[] = [
      {
        id: '1',
        name: 'Fluffy',
        kind: 'cat',
        weight: 4,
        height: 25,
        length: 30,
        number_of_lives: 9,
        photo_url: 'https://example.com/fluffy.jpg', // Add photo_url
        description: 'A fluffy cat with nine lives', // Add description
      },
      {
        id: '2',
        name: 'Buddy',
        kind: 'dog',
        weight: 10,
        height: 40,
        length: 50,
        photo_url: 'https://example.com/buddy.jpg',
        description: 'A friendly dog',
      },
    ];
    apiServiceSpy.get.mockReturnValue(of(mockPetsList));

    service.getList().subscribe((pets) => {
      expect(pets).toEqual(mockPetsList);
      expect(apiServiceSpy.get).toHaveBeenCalledWith('/fever_pets_data/pets');
    });
  });

  it('should get a pet by ID', () => {
    const petId = '1';
    const mockPet: Pet = {
      id: petId,
      name: 'Fluffy',
      kind: 'cat',
      weight: 4,
      height: 25,
      length: 30,
      number_of_lives: 9,
      photo_url: 'https://example.com/fluffy.jpg',
      description: 'A fluffy cat with nine lives',
    };
    apiServiceSpy.get.mockReturnValue(of(mockPet));

    service.get(petId).subscribe((pet) => {
      expect(pet).toEqual(mockPet);
      expect(apiServiceSpy.get).toHaveBeenCalledWith(
        `/fever_pets_data/pets/${petId}`
      );
    });
  });

  it('should calculate pet health correctly', () => {
    const healthyCat: Pet = {
      id: '1',
      name: 'Whiskers',
      kind: 'cat',
      weight: 10981,
      height: 42,
      length: 80,
      number_of_lives: 7,
      photo_url: 'https://example.com/whiskers.jpg',
      description: 'A healthy cat',
    };
    const unhealthyCat: Pet = {
      id: '2',
      name: 'Shadow',
      kind: 'cat',
      weight: 4743,
      height: 25,
      length: 40,
      number_of_lives: 1,
      photo_url: 'https://example.com/shadow.jpg',
      description: 'An unhealthy cat',
    };
    const healthyDog: Pet = {
      id: '3',
      name: 'Max',
      kind: 'dog',
      weight: 10981,
      height: 42,
      length: 80,
      photo_url: 'https://example.com/max.jpg',
      description: 'A healthy dog',
    };
    const veryHealthyDog: Pet = {
      id: '4',
      name: 'Charlie',
      kind: 'dog',
      weight: 9561,
      height: 45,
      length: 90,
      photo_url: 'https://example.com/charlie.jpg',
      description: 'A very healthy dog',
    };
    const unhealthyDog: Pet = {
      id: '5',
      name: 'Rocky',
      kind: 'dog',
      weight: 1000,
      height: 26,
      length: 51,
      photo_url: 'https://example.com/rocky.jpg',
      description: 'An unhealthy dog',
    };
    // const healthValue = pet.weight / (pet.height * pet.length);

    expect(service.calculatePetHealth(healthyCat)).toBe('healthy');
    expect(service.calculatePetHealth(unhealthyCat)).toBe('unhealthy');
    expect(service.calculatePetHealth(healthyDog)).toBe('healthy');
    expect(service.calculatePetHealth(veryHealthyDog)).toBe('very healthy');
    expect(service.calculatePetHealth(unhealthyDog)).toBe('unhealthy');
  });
});
