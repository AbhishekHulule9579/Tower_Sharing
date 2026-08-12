import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly api = `${environment.apiBaseUrl}/api/dashboards`;

  constructor(private readonly http: HttpClient) {}

  getTowerUtilization(): Observable<any> {
    return this.http.get<any>(`${this.api}/tower-utilization`);
  }

  getDisasterMonitoring(): Observable<any> {
    return this.http.get<any>(`${this.api}/disaster-monitoring`);
  }

  getRevenueLease(): Observable<any> {
    return this.http.get<any>(`${this.api}/revenue-lease`);
  }

  getMaintenanceReport(): Observable<any> {
    return this.http.get<any>(`${this.api}/maintenance-report`);
  }
}
