import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly api = `${environment.apiBaseUrl}/api/transactions`;

  constructor(private readonly http: HttpClient, private readonly authService: AuthService) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}`, this.authHeaders());
  }

  buyTower(payload: any): Observable<any> {
    return this.http.post<any>(`${this.api}/buy`, payload, this.authHeaders());
  }

  approveTransaction(id: number): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}/approve`, {}, this.authHeaders());
  }

  rejectTransaction(id: number): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}/reject`, {}, this.authHeaders());
  }

  private authHeaders() {
    const token = this.authService.getCurrentUser()?.token;
    if (!token) return {};
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }
}
