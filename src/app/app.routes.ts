import {Routes} from '@angular/router';
import {authGuard} from './core/auth/guards/auth.guard';
import {roleGuard} from './core/auth/guards/role.guard';
import {guestGuard} from './core/auth/guards/guest.guard';

export const routes: Routes = [
  {
    path: 'auth/login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard-page/dashboard-page').then((m) => m.DashboardPage),
  },
  {
    path: 'products',
    canActivate: [authGuard, roleGuard],
    data: {roles: ['admin', 'manager', 'viewer']},
    loadComponent: () =>
      import('./features/products/pages/products-list-page/products-list-page').then(
        (m) => m.ProductsListPage
      ),
  },
  {
    path: 'products/new',
    canActivate: [authGuard, roleGuard],
    data: {roles: ['admin', 'manager']},
    loadComponent: () =>
      import('./features/products/pages/product-create-page/product-create-page').then(
        (m) => m.ProductCreatePage
      ),
  },
  {
    path: 'products/:id/edit',
    canActivate: [authGuard, roleGuard],
    data: {roles: ['admin', 'manager']},
    loadComponent: () =>
      import('./features/products/pages/product-edit-page/product-edit-page').then(
        (m) => m.ProductEditPage
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
