import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DisasterService {
  private readonly api = `${environment.apiBaseUrl}/api/disasters`;

  constructor(private readonly http: HttpClient) {}

  getIncidents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/incidents`);
  }

  createIncident(payload: any): Observable<any> {
    return this.http.post<any>(`${this.api}/incidents`, payload);
  }

  resolveIncident(id: number): Observable<any> {
    return this.http.put<any>(`${this.api}/incidents/${id}/resolve`, {});
  }

  getEmergencySharings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/emergency-sharing`);
  }

  createEmergencySharing(payload: any): Observable<any> {
    return this.http.post<any>(`${this.api}/emergency-sharing`, payload);
  }
}
