import { LocalStorageService } from './local-storage.service'; // Adjust the path if necessary

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    service = new LocalStorageService();
    localStorage.clear(); // Clear local storage before each test
  });

  it('should save data to local storage', () => {
    const key = 'testKey';
    const data = { name: 'John', age: 30 };

    service.saveData(key, data);

    expect(localStorage.getItem(key)).toBe(JSON.stringify(data));
  });

  it('should retrieve data from local storage', () => {
    const key = 'testKey';
    const data = { name: 'Jane', age: 25 };
    localStorage.setItem(key, JSON.stringify(data));

    const retrievedData = service.getData(key);

    expect(retrievedData).toEqual(data);
  });

  it('should return null when retrieving non-existent data', () => {
    const key = 'nonExistentKey';

    const retrievedData = service.getData(key);

    expect(retrievedData).toBeNull();
  });

  it('should remove data from local storage', () => {
    const key = 'testKey';
    const data = { name: 'Alice', age: 40 };
    localStorage.setItem(key, JSON.stringify(data));

    service.removeData(key);

    expect(localStorage.getItem(key)).toBeNull();
  });
});
