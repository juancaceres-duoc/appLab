import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './recuperar.html',
  styleUrls: ['./recuperar.scss'],
})
export class Recuperar {
  recuperarForm: FormGroup;
  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {
    this.recuperarForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get email() {
    return this.recuperarForm.get('email');
  }

  onSubmit(): void {
    this.mensajeExito = null;
    this.mensajeError = null;

    if (this.recuperarForm.invalid) {
      this.recuperarForm.markAllAsTouched();
      return;
    }

    const email = this.recuperarForm.value.email as string;
    console.log('Solicitando recuperación de contraseña para:', email);

    this.usuarioService.recuperarPassword(email).subscribe({
      next: (resp) => {
        if (resp.existe) {
          const pass = resp.passwordActual ?? '***';
          
          this.mensajeExito =
            `El correo existe en el sistema, su contraseña actual es: ${pass}, ` +
            `será bloqueada y se enviarán instrucciones para generar una contraseña a su correo.`;
        } else {
          this.mensajeError = 'El correo no existe en el sistema.';
        }
      },
      error: (err) => {
        console.error('Error al recuperar contraseña:', err);
        this.mensajeError = 'Ocurrió un error al intentar recuperar la contraseña.';
      }
    });
  }
}
