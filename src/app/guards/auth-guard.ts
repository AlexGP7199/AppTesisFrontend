import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  if (authService.hasRefreshToken()) {
    return authService.refreshToken().pipe(
      map(res => res.isSuccess ? true : router.createUrlTree(['/login'])),
      catchError(() => of(router.createUrlTree(['/login'])))
    );
  }

  return router.createUrlTree(['/login']);
};
