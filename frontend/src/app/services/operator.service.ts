import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OperatorService {
  private readonly api = `${environment.apiBaseUrl}/api/operators`;

  constructor(private readonly http: HttpClient) {}

  getAllOperators(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}`);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/api/users`);
  }

  getSiteManagers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/api/users/site-managers`);
  }
}
