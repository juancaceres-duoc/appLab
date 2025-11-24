import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar {

  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  esAdmin(): boolean {
    return this.auth.isAdmin();
  }

  get usuarioActual() {
    return this.auth.getUsuario();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
