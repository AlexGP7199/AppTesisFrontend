import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, switchMap, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseResponse } from '../models/base-response.model';
import { LoginRequest, RegisterRequest, RefreshTokenRequest, AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = `${environment.apiUrl}/Auth`;
  private readonly tokenCookieName = 'app_tesis_token';
  private readonly refreshTokenCookieName = 'app_tesis_refresh_token';
  private readonly userCookieName = 'app_tesis_user';
  private refreshingToken = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  login(request: LoginRequest): Observable<BaseResponse<AuthResponse>> {
    return this.http.post<BaseResponse<AuthResponse>>(`${this.url}/login`, request).pipe(
      tap(res => {
        if (res.isSuccess) {
          this.storeTokens(res.data);
        }
      })
    );
  }

  register(request: RegisterRequest): Observable<BaseResponse<AuthResponse>> {
    return this.http.post<BaseResponse<AuthResponse>>(`${this.url}/register`, request).pipe(
      tap(res => {
        if (res.isSuccess) {
          this.storeTokens(res.data);
        }
      })
    );
  }

  refreshToken(): Observable<BaseResponse<AuthResponse>> {
    const token = this.getToken() || '';
    const refreshToken = this.getRefreshToken() || '';
    const request: RefreshTokenRequest = { token, refreshToken };

    return this.http.post<BaseResponse<AuthResponse>>(`${this.url}/refresh-token`, request).pipe(
      tap(res => {
        if (res.isSuccess) {
          this.storeTokens(res.data);
          this.refreshingToken = false;
          this.refreshTokenSubject.next(res.data.token);
        }
      }),
      catchError(err => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    this.deleteCookie(this.tokenCookieName);
    this.deleteCookie(this.refreshTokenCookieName);
    this.deleteCookie(this.userCookieName);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.getCookie(this.tokenCookieName);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  hasRefreshToken(): boolean {
    return !!this.getRefreshToken();
  }

  getUser(): { userId: number; fullName: string; email: string } | null {
    const user = this.getCookie(this.userCookieName);
    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }

  get isRefreshing(): boolean {
    return this.refreshingToken;
  }

  set isRefreshing(value: boolean) {
    this.refreshingToken = value;
  }

  get refreshToken$(): BehaviorSubject<string | null> {
    return this.refreshTokenSubject;
  }

  private storeTokens(data: AuthResponse): void {
    const tokenExpiration = data.tokenExpiration
      ? new Date(data.tokenExpiration)
      : this.getTokenExpiration(data.token) ?? new Date(Date.now() + 15 * 60 * 1000);

    this.setCookie(this.tokenCookieName, data.token, tokenExpiration);
    this.setCookie(this.refreshTokenCookieName, data.refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    this.setCookie(this.userCookieName, JSON.stringify({
      userId: data.userId,
      fullName: data.fullName,
      email: data.email
    }), tokenExpiration);
  }

  private getRefreshToken(): string | null {
    return this.getCookie(this.refreshTokenCookieName);
  }

  private setCookie(name: string, value: string, expiresAt: Date): void {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expiresAt.toUTCString()}; path=/; SameSite=Strict${secure}`;
  }

  private getCookie(name: string): string | null {
    const cookieName = `${name}=`;
    const cookies = document.cookie.split(';');

    for (const cookie of cookies) {
      const trimmedCookie = cookie.trim();
      if (trimmedCookie.startsWith(cookieName)) {
        return decodeURIComponent(trimmedCookie.substring(cookieName.length));
      }
    }

    return null;
  }

  private deleteCookie(name: string): void {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict${secure}`;
  }

  private isTokenExpired(token: string): boolean {
    const expiration = this.getTokenExpiration(token);
    if (!expiration) {
      return true;
    }

    return expiration.getTime() <= Date.now();
  }

  private getTokenExpiration(token: string): Date | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) {
        return null;
      }

      const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(atob(normalizedPayload));
      const exp = decodedPayload.exp;

      if (typeof exp !== 'number') {
        return null;
      }

      return new Date(exp * 1000);
    } catch {
      return null;
    }
  }
}
