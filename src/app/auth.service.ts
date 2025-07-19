import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private registerUrl = 'https://secured-card-transact-system.onrender.com/api/register/';
  private tokenUrl = 'https://secured-card-transact-system.onrender.com/api/token/';
  private refreshTokenUrl = 'https://secured-card-transact-system.onrender.com/api/token/refresh/';
  private dashboardUrl = 'https://secured-card-transact-system.onrender.com/api/dashboard/';

  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';

  constructor(private httpClient: HttpClient) {}

  // Register User
  register(data: any): Observable<any> {
    return this.httpClient.post(this.registerUrl, data);
  }

  // Login and get JWT
  login(data: any): Observable<any> {
    return this.httpClient.post(this.tokenUrl, data);
  }

  approveTransaction(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.httpClient.post('https://secured-card-transact-system.onrender.com/api/approve-transaction/', data, { headers });
  }
  submitFraudTransaction(data: any): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.httpClient.post('https://secured-card-transact-system.onrender.com/api/approve-transaction/', data, { headers });
}

  

  // Store tokens in localStorage
  storeTokens(access: string, refresh: string): void {
    localStorage.setItem(this.accessTokenKey, access);
    localStorage.setItem(this.refreshTokenKey, refresh);
  }

  // Get tokens
  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  // Add token to headers
  getAuthHeaders(): HttpHeaders {
    const token = this.getAccessToken();
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  }

  // Get protected dashboard data
  getDashboard(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.httpClient.get(this.dashboardUrl, { headers });
  }

  // Refresh access token
  refreshToken(): Observable<any> {
    const refresh = this.getRefreshToken();
    return this.httpClient.post(this.refreshTokenUrl, { refresh });
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Logout user
  logout(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }
}
