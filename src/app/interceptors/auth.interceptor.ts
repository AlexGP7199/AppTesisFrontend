import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, filter, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);

  // No agregar token a las rutas de autenticación
  if (req.url.includes('/Auth/')) {
    return next(req);
  }

  const token = authService.getToken();
  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/Auth/')) {
        return handleTokenRefresh(authService, req, next);
      }
      return throwError(() => error);
    })
  );
};

function handleTokenRefresh(authService: AuthService, req: HttpRequest<unknown>, next: HttpHandlerFn) {
  if (!authService.isRefreshing) {
    authService.isRefreshing = true;
    authService.refreshToken$.next(null);

    return authService.refreshToken().pipe(
      switchMap(res => {
        authService.isRefreshing = false;
        const newReq = req.clone({
          setHeaders: { Authorization: `Bearer ${res.data.token}` }
        });
        return next(newReq);
      }),
      catchError(err => {
        authService.isRefreshing = false;
        authService.logout();
        return throwError(() => err);
      })
    );
  }

  // Si ya se está refrescando, esperar a que termine
  return authService.refreshToken$.pipe(
    filter(token => token !== null),
    take(1),
    switchMap(token => {
      const newReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next(newReq);
    })
  );
}
