import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LeaseService {
  private readonly api = `${environment.apiBaseUrl}/api/leases`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  requestLease(payload: any): Observable<any> {
    return this.http.post<any>(`${this.api}/request`, payload);
  }

  approveLease(id: number, approved: boolean, approvalNotes: string): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}/approve`, { approved, approvalNotes });
  }

  terminateLease(id: number): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}/terminate`, {});
  }
}
