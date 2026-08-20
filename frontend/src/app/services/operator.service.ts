import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OperatorService {
  private readonly api = `${environment.apiBaseUrl}/api/operators`;

  constructor(private readonly http: HttpClient, private readonly authService: AuthService) {}

  getAllOperators(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}`, this.authHeaders());
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/api/users`, this.authHeaders());
  }

  getSiteManagers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/api/users/site-managers`, this.authHeaders());
  }

  private authHeaders() {
    const token = this.authService.getCurrentUser()?.token;
    if (!token) return {};
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }
}
