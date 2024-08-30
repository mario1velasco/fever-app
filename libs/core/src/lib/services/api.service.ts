import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // * Injectors
  private http = inject(HttpClient);
  //  * Variables
  private readonly API = 'https://my-json-server.typicode.com/Feverup';

  //  *******************
  //  ****** Methods ****
  //  *******************
  /**
   * The `get` function sends a GET request to a specified path using the provided API URL.
   * @param {string} path - The `path` parameter in the `get` function is a string that represents
   * the endpoint or resource path that you want to make a GET request to. It is appended to the base
   * API URL to form the complete URL for the request.
   * @returns The `get` method is returning the result of making a GET request to the specified URL
   * formed by combining the base API URL (`this.API`) and the provided `path`.
   */
  get(path: string): Observable<object> {
    const url = `${this.API}${path}`;
    return this.http.request('GET', url);
  }
}
