import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  loginForm: FormGroup;
  passwordVisible = false;
  mensajeError: string | null = null;
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      rut: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{7,8}-[0-9Kk]{1}$/),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      ],
    });
  }

  get rut() {
    return this.loginForm.get('rut');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(): void {
    this.mensajeError = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { rut, password } = this.loginForm.value;
    this.cargando = true;

    this.usuarioService.obtenerPorRut(rut).subscribe({
      next: (usuario) => {
        if (usuario.password === password) {
          this.authService.setUsuario(usuario);
          this.cargando = false;

          const rol = usuario.rol?.toUpperCase();
          console.log("ROL DETECTADO:", rol);

          if (rol === 'ADMIN') {
            this.router.navigate(['/perfil']);
          }
          else if (rol === 'TECNICO') {
            this.router.navigate(['/inicio']);
          }
          else if (rol === 'CLIENTE') {
            this.router.navigate(['/resultados']);
          }
          else {
            this.router.navigate(['/inicio']);
          }
        } else {
          this.cargando = false;
          this.mensajeError = 'Contraseña incorrecta.';
        }
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
        this.mensajeError = 'Usuario no encontrado o credenciales inválidas.';
      },
    });
  }
}