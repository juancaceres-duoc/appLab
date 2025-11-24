import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl
} from '@angular/forms';
import { UsuarioService } from '../../services/usuario';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './registro.html',
  styleUrls: ['./registro.scss'],
})

export class Registro {
  registroForm: FormGroup;
  passwordVisible = false;
  confirmPasswordVisible = false;
  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {
    this.registroForm = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.minLength(2)]],
        rut: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[0-9]{7,8}-[0-9Kk]{1}$/)
          ]
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(20),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]};:'",.<>/?\\|`~]).+$/
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: [this.passwordsIgualesValidator],
      }
    );
  }

  get nombre() {
    return this.registroForm.get('nombre');
  }

  get rut() {
    return this.registroForm.get('rut');
  }

  get email() {
    return this.registroForm.get('email');
  }

  get password() {
    return this.registroForm.get('password');
  }

  get confirmPassword() {
    return this.registroForm.get('confirmPassword');
  }

  private passwordsIgualesValidator(form: AbstractControl) {
    const pass = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;

    if (!pass || !confirm) return null;
    return pass === confirm ? null : { passwordsNoCoinciden: true };
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  onSubmit(): void {
    this.mensajeExito = null;
    this.mensajeError = null;

    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    const formValue = this.registroForm.value;


    const nuevoUsuario: Usuario = {      
      username: formValue.rut,
      password: formValue.password,
      nombre: formValue.nombre,
      rol: 'CLIENTE',
      rut: formValue.rut,
      correo: formValue.email
    };

    console.log('Registrando usuario:', nuevoUsuario);

    this.usuarioService.crear(nuevoUsuario).subscribe({
      next: (userCreado) => {
        console.log('Usuario creado en backend:', userCreado);
        this.mensajeExito = 'Usuario registrado correctamente. Tu rol actual es CLIENTE.';
        this.registroForm.reset();
      },
      error: (err) => {
        console.error(err);
        this.mensajeError = 'Ocurrió un error al registrar el usuario.';
      },
    });
  }
}