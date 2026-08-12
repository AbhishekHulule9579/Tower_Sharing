import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: string;
  operatorId?: number;
  operatorCode?: string;
  operatorName?: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = `${environment.apiBaseUrl}/api/auth`;
  private readonly storageKey = 'tower-sharing-user';
  private readonly userSubject = new BehaviorSubject<AuthUser | null>(this.readUserFromStorage());

  readonly currentUser$ = this.userSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  login(username: string, password: string, role: string): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.api}/login`, { username, password, role }).pipe(
      tap((user) => {
        this.saveUserToStorage(user);
        this.userSubject.next(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.userSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }

  getCurrentUser(): AuthUser | null {
    return this.userSubject.value;
  }

  getUserRole(): string | null {
    return this.userSubject.value?.role ?? null;
  }

  registerSiteManagerRequest(data: { username: string; password: string; email: string; fullName: string; phoneNumber: string; operatorId: number }): Observable<any> {
    return this.http.post<any>(`${this.api}/site-manager-requests`, data);
  }

  getPendingSiteManagerRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/site-manager-requests`, this.getAuthOptions());
  }

  approveSiteManagerRequest(requestId: number): Observable<any> {
    return this.http.post<any>(`${this.api}/site-manager-requests/${requestId}/approve`, {}, this.getAuthOptions());
  }

  private getAuthOptions() {
    const token = this.userSubject.value?.token;
    if (!token) {
      return {};
    }
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  private saveUserToStorage(user: AuthUser): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  private readUserFromStorage(): AuthUser | null {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
