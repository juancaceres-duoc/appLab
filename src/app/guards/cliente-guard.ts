import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root',
})
export class ClienteGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const usuario = this.auth.getUsuario();

    if (usuario && usuario.rol === 'CLIENTE') {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
