import {inject} from '@angular/core';
import {CanActivateFn, Router, UrlTree} from '@angular/router';
import {AuthStateService} from '../services/auth-state.service';
import {toObservable} from '@angular/core/rxjs-interop';
import {filter, map, take} from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  return toObservable(authState.loading).pipe(
    filter((loading) => !loading),
    take(1),
    map((): boolean | UrlTree => authState.isAuthenticated() ? true : router.parseUrl('/auth/login'))
  );
};
