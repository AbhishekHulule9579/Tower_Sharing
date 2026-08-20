import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  private readonly api = `${environment.apiBaseUrl}/api/maintenance`;

  constructor(private readonly http: HttpClient, private readonly authService: AuthService) {}

  getInventory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/inventory`, this.authHeaders());
  }

  addInventoryItem(payload: any): Observable<any> {
    return this.http.post<any>(`${this.api}/inventory`, payload, this.authHeaders());
  }

  getRepairRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/repair-requests`, this.authHeaders());
  }

  getRepairRequestsForSiteManager(siteManagerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/repair-requests/site-manager/${siteManagerId}`, this.authHeaders());
  }

  createRepairRequest(payload: any): Observable<any> {
    return this.http.post<any>(`${this.api}/repair-requests`, payload, this.authHeaders());
  }

  consumeParts(id: number, payload: any): Observable<any> {
    return this.http.post<any>(`${this.api}/repair-requests/${id}/consume-parts`, payload, this.authHeaders());
  }

  restoreTower(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.api}/repair-requests/${id}/restore-tower`, payload, this.authHeaders());
  }

  private authHeaders() {
    const token = this.authService.getCurrentUser()?.token;
    if (!token) return {};
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }
}
