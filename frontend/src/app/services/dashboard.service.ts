import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly api = `${environment.apiBaseUrl}/api/dashboards`;

  constructor(private readonly http: HttpClient, private readonly authService: AuthService) {}

  getSummary(): Observable<any> {
    return this.http.get<any>(`${this.api}/summary`, this.authHeaders());
  }

  getTowerUtilization(): Observable<any> {
    return this.http.get<any>(`${this.api}/tower-utilization`, this.authHeaders());
  }

  getDisasterMonitoring(): Observable<any> {
    return this.http.get<any>(`${this.api}/disaster-monitoring`, this.authHeaders());
  }

  getRevenueLease(): Observable<any> {
    return this.http.get<any>(`${this.api}/revenue-lease`, this.authHeaders());
  }

  getMaintenanceReport(): Observable<any> {
    return this.http.get<any>(`${this.api}/maintenance-report`, this.authHeaders());
  }

  private authHeaders() {
    const token = this.authService.getCurrentUser()?.token;
    if (!token) return {};
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }
}
