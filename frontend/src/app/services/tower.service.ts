import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TowerService {
  private readonly api = `${environment.apiBaseUrl}/api/towers`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  getAvailableForLease(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/available-lease`);
  }

  getAvailableForSale(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/available-sale`);
  }

  getTowersByOperator(operatorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/operator/${operatorId}`);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  createTower(payload: any): Observable<any> {
    return this.http.post<any>(this.api, payload);
  }

  updateTower(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}`, payload);
  }

  deleteTower(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/${id}`);
  }
}
