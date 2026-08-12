import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  private readonly api = `${environment.apiBaseUrl}/api/maintenance`;

  constructor(private readonly http: HttpClient) {}

  getInventory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/inventory`);
  }

  addInventoryItem(payload: any): Observable<any> {
    return this.http.post<any>(`${this.api}/inventory`, payload);
  }

  getRepairRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/repair-requests`);
  }

  getRepairRequestsForSiteManager(siteManagerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/repair-requests/site-manager/${siteManagerId}`);
  }

  createRepairRequest(payload: any): Observable<any> {
    return this.http.post<any>(`${this.api}/repair-requests`, payload);
  }

  consumeParts(id: number, payload: any): Observable<any> {
    return this.http.post<any>(`${this.api}/repair-requests/${id}/consume-parts`, payload);
  }

  restoreTower(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.api}/repair-requests/${id}/restore-tower`, payload);
  }
}
