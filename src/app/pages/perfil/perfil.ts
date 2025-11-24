import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsuarioService } from '../../services/usuario';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf, NgForOf],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.scss'],
})
export class Perfil implements OnInit {
  usuarios: Usuario[] = [];
  seleccionado: Usuario | null = null;

  editForm: FormGroup;
  mensajeExito: string | null = null;
  mensajeError: string | null = null;
  cargandoLista = false;
  guardando = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {
    this.editForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      rol: ['', [Validators.required]],
      password: [
        '',
        [          
          Validators.minLength(8),
          Validators.maxLength(50),
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
          ),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  get nombre() {
    return this.editForm.get('nombre');
  }

  get correo() {
    return this.editForm.get('correo');
  }

  get rol() {
    return this.editForm.get('rol');
  }

  get password() {
    return this.editForm.get('password');
  }

  cargarUsuarios(): void {
    this.cargandoLista = true;
    this.usuarioService.listar().subscribe({
      next: (lista) => {
        this.usuarios = lista;
        this.cargandoLista = false;
      },
      error: (err) => {
        console.error(err);
        this.mensajeError = 'Error al cargar la lista de usuarios.';
        this.cargandoLista = false;
      },
    });
  }

  seleccionarUsuario(usuario: Usuario): void {
    this.mensajeExito = null;
    this.mensajeError = null;
    this.seleccionado = usuario;

    this.editForm.reset({
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
      password: '',
    });
  }

  cancelarEdicion(): void {
    this.seleccionado = null;
    this.editForm.reset();
    this.mensajeExito = null;
    this.mensajeError = null;
  }

  guardarCambios(): void {
    this.mensajeExito = null;
    this.mensajeError = null;

    if (!this.seleccionado) {
      this.mensajeError = 'No hay usuario seleccionado.';
      return;
    }

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const formValue = this.editForm.value;

    const actualizado: Usuario = {
      ...this.seleccionado,
      nombre: formValue.nombre,
      correo: formValue.correo,
      rol: formValue.rol,
    };

    if (formValue.password && formValue.password.trim().length > 0) {
      (actualizado as any).password = formValue.password;
    }

    this.guardando = true;
    this.usuarioService.actualizarPorRut(this.seleccionado.rut, actualizado).subscribe({
      next: (resp) => {
        const idx = this.usuarios.findIndex(u => u.rut === resp.rut);
        if (idx !== -1) {
          this.usuarios[idx] = resp;
        }

        this.mensajeExito = 'Usuario actualizado correctamente.';
        this.guardando = false;
      },
      error: (err) => {
        console.error(err);
        this.mensajeError = 'Ocurrió un error al actualizar el usuario.';
        this.guardando = false;
      },
    });
  }
}