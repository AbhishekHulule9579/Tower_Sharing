import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly api = `${environment.apiBaseUrl}/api/transactions`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}`);
  }

  buyTower(payload: any): Observable<any> {
    return this.http.post<any>(`${this.api}/buy`, payload);
  }
}
