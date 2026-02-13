import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { authClient } from '../../lib/auth-client';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const { data, error } = await authClient.getSession();
  if (error || !data?.session) {
    const loginUrl = router.parseUrl('/login');
    return new RedirectCommand(loginUrl, {
      replaceUrl: true,
    });
  }
  return true;
};
