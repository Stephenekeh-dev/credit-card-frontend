import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmailValidationService {
  private apiKey = 'fde403f376174683815229726b1899d6';  
  private apiUrl = 'https://emailvalidation.abstractapi.com/v1/';

  constructor(private http: HttpClient) {}

  validateEmail(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?api_key=${this.apiKey}&email=${email}`);
  }
}
