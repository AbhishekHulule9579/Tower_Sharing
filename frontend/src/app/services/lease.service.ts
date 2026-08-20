import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LeaseService {
  private readonly api = `${environment.apiBaseUrl}/api/leases`;

  constructor(private readonly http: HttpClient, private readonly authService: AuthService) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.api, this.authHeaders());
  }

  requestLease(payload: any): Observable<any> {
    return this.http.post<any>(`${this.api}/request`, payload, this.authHeaders());
  }

  approveLease(id: number, approved: boolean, approvalNotes: string): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}/approve`, { approved, approvalNotes }, this.authHeaders());
  }

  terminateLease(id: number): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}/terminate`, {}, this.authHeaders());
  }

  private authHeaders() {
    const token = this.authService.getCurrentUser()?.token;
    if (!token) return {};
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }
}
