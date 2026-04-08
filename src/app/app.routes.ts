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
      { path: 'categorias/:id/editar', loadComponent: () => import('./pages/categoria-edit/categoria-edit').then(m => m.CategoriaEdit) },
      { path: 'categorias', loadComponent: () => import('./pages/categorias/categorias').then(m => m.Categorias) },
      { path: 'usuarios/:id/editar', loadComponent: () => import('./pages/usuario-edit/usuario-edit').then(m => m.UsuarioEdit) },
      { path: 'usuarios', loadComponent: () => import('./pages/usuarios/usuarios').then(m => m.Usuarios) },
      { path: 'cuentas/:id/editar', loadComponent: () => import('./pages/cuenta-edit/cuenta-edit').then(m => m.CuentaEdit) },
      { path: 'cuentas', loadComponent: () => import('./pages/cuentas/cuentas').then(m => m.Cuentas) },
      { path: 'transacciones/:id/editar', loadComponent: () => import('./pages/transaccion-edit/transaccion-edit').then(m => m.TransaccionEdit) },
      { path: 'transacciones', loadComponent: () => import('./pages/transacciones/transacciones').then(m => m.Transacciones) },
      { path: 'contactos/:id/editar', loadComponent: () => import('./pages/contacto-edit/contacto-edit').then(m => m.ContactoEdit) },
      { path: 'contactos', loadComponent: () => import('./pages/contactos/contactos').then(m => m.Contactos) },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: 'login' },
];
