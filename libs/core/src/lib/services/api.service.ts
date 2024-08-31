import { HttpClient, HttpParams } from '@angular/common/http';
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
   * The `get` function sends a GET request to a specified path using the provided API URL, with
   * optional query parameters.
   * @param {string} path - The endpoint or resource path for the GET request.
   * @param { { params?: HttpParams } } [options] - Optional object containing request options, including 'params' for query parameters.
   * @returns An Observable of the GET request response.
   */
  get(path: string, options?: { params?: HttpParams }): Observable<object> {
    const url = `${this.API}${path}`;
    return this.http.get(url, options); // Pass the options object to the HttpClient's get method
  }
}
