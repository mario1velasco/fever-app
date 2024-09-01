import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // This makes the service available throughout the application
})
export class LocalStorageService {
  saveData(key: string, data: any): void {
    const dataJSON = JSON.stringify(data);
    localStorage.setItem(key, dataJSON);
  }

  getData(key: string): any | null {
    const dataJSON = localStorage.getItem(key);
    if (dataJSON) {
      return JSON.parse(dataJSON);
    } else {
      return null;
    }
  }

  removeData(key: string): void {
    localStorage.removeItem(key);
  }
}
