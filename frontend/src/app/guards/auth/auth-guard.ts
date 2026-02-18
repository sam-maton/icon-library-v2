import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { catchError, map, take } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const loginUrl = router.parseUrl('/login');

  return authService.getSession().pipe(
    take(1),
    map((response) => {
      if (response.error || !response.data?.session) {
        return new RedirectCommand(loginUrl, { replaceUrl: true });
      }
      return true;
    }),
    catchError(() => of(new RedirectCommand(loginUrl, { replaceUrl: true }))),
  );
};
