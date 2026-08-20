import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DisasterService {
  private readonly api = `${environment.apiBaseUrl}/api/disasters`;

  constructor(private readonly http: HttpClient, private readonly authService: AuthService) {}

  getIncidents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/incidents`, this.authHeaders());
  }

  createIncident(payload: any): Observable<any> {
    return this.http.post<any>(`${this.api}/incidents`, payload, this.authHeaders());
  }

  resolveIncident(id: number): Observable<any> {
    return this.http.put<any>(`${this.api}/incidents/${id}/resolve`, {}, this.authHeaders());
  }

  getEmergencySharings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/emergency-sharing`, this.authHeaders());
  }

  createEmergencySharing(payload: any): Observable<any> {
    return this.http.post<any>(`${this.api}/emergency-sharing`, payload, this.authHeaders());
  }

  private authHeaders() {
    const token = this.authService.getCurrentUser()?.token;
    if (!token) return {};
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }
}
