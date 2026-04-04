import {inject} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {CanActivateFn, Router, UrlTree} from '@angular/router';
import {filter, map, take} from 'rxjs';
import {UserRole} from '../../../shared/models/user-role.model';
import {AuthStateService} from '../services/auth-state.service';

export const roleGuard: CanActivateFn = (route) => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  return toObservable(authState.loading).pipe(
    filter((loading) => !loading),
    take(1),
    map((): boolean | UrlTree => {
      if (!authState.isAuthenticated()) {
        return router.parseUrl('/auth/login');
      }

      const allowedRoles = (route.data?.['roles'] ?? []) as UserRole[];
      if (!allowedRoles.length) {
        return true;
      }

      const currentRole = authState.role();
      return currentRole && allowedRoles.includes(currentRole)
        ? true
        : router.parseUrl('/');
    })
  );
};
