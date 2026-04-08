import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { Layout } from './pages/layout/layout';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.Register) },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
      { path: 'categorias', loadComponent: () => import('./pages/categorias/categorias').then(m => m.Categorias) },
      { path: 'usuarios', loadComponent: () => import('./pages/usuarios/usuarios').then(m => m.Usuarios) },
      { path: 'cuentas', loadComponent: () => import('./pages/cuentas/cuentas').then(m => m.Cuentas) },
      { path: 'transacciones', loadComponent: () => import('./pages/transacciones/transacciones').then(m => m.Transacciones) },
      { path: 'contactos', loadComponent: () => import('./pages/contactos/contactos').then(m => m.Contactos) },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: 'login' },
];
