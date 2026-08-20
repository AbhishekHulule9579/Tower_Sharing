import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TowerService {
  private readonly api = `${environment.apiBaseUrl}/api/towers`;

  constructor(private readonly http: HttpClient, private readonly authService: AuthService) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.api, this.authHeaders());
  }

  getAvailableForLease(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/available-lease`, this.authHeaders());
  }

  getAvailableForSale(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/available-sale`, this.authHeaders());
  }

  getTowersByOperator(operatorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/operator/${operatorId}`, this.authHeaders());
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.api}/${id}`, this.authHeaders());
  }

  createTower(payload: any): Observable<any> {
    return this.http.post<any>(this.api, payload, this.authHeaders());
  }

  updateTower(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}`, payload, this.authHeaders());
  }

  deleteTower(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/${id}`, this.authHeaders());
  }

  private authHeaders() {
    const token = this.authService.getCurrentUser()?.token;
    if (!token) return {};
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }
}
