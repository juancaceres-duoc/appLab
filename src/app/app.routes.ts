import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { Recuperar } from './pages/recuperar/recuperar';
import { Perfil } from './pages/perfil/perfil';
import { Inicio } from './pages/inicio/inicio';
import { Resultados } from './pages/resultados/resultados';
import { AdminGuard } from './guards/admin-guard';
import { ClienteGuard } from './guards/cliente-guard';
import { Laboratorios } from './pages/laboratorios/laboratorios';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'registro', component: Registro },
    { path: 'recuperar', component: Recuperar },
    { path: 'inicio', component: Inicio },
    { path: 'resultados', component: Resultados, canActivate: [ClienteGuard] },
    { path: 'perfil', component: Perfil, canActivate: [AdminGuard] },
    { path: 'laboratorios', component: Laboratorios, canActivate: [AdminGuard] },
    { path: '**', redirectTo: 'login' },
];
