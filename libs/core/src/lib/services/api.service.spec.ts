import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service'; // Adjust path as needed
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('ApiService', () => {
  let service: ApiService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a GET request to the correct URL', () => {
    const path = '/posts';
    const mockResponse = [{ id: 1, title: 'Test Post' }];

    // Mock the HttpClient response
    jest.spyOn(httpClient, 'request').mockReturnValue(of(mockResponse));

    service.get(path).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
  });
});
