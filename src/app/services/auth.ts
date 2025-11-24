import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuarioActual: Usuario | null = null;

  setUsuario(usuario: Usuario): void {
    this.usuarioActual = usuario;
  }

  getUsuario(): Usuario | null {
    return this.usuarioActual;
  }

  isLoggedIn(): boolean {
    return this.usuarioActual !== null;
  }

  isAdmin(): boolean {
    return this.usuarioActual?.rol?.toUpperCase() === 'ADMIN';
  }

  isCliente(): boolean {
  return this.usuarioActual?.rol?.toUpperCase() === 'CLIENTE';
}

isTecnico(): boolean {
  return this.usuarioActual?.rol?.toUpperCase() === 'TECNICO';
}

  logout(): void {
    this.usuarioActual = null;
  }
}
