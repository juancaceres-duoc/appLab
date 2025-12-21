import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Laboratorio } from '../../models/laboratorio';
import { LaboratorioService } from '../../services/laboratorio';

@Component({
  selector: 'app-laboratorios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './laboratorios.html',
  styleUrls: ['./laboratorios.scss'],
})
export class Laboratorios implements OnInit {

  laboratorios: Laboratorio[] = [];
  cargandoLista = true;

  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  crearForm!: FormGroup;
  creando = false;

  soloActivos = false;

  constructor(
    private  readonly laboratorioService: LaboratorioService,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.crearForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    });

    this.cargarLista();
  }

  cargarLista(): void {
    this.cargandoLista = true;
    this.mensajeError = null;

    const obs = this.soloActivos
      ? this.laboratorioService.listarActivos()
      : this.laboratorioService.listar();

    obs.subscribe({
      next: (data) => {
        this.laboratorios = data ?? [];
        this.cargandoLista = false;
      },
      error: () => {
        this.mensajeError = 'No se pudieron cargar los laboratorios.';
        this.cargandoLista = false;
      }
    });
  }

  toggleSoloActivos(): void {
    this.soloActivos = !this.soloActivos;
    this.cargarLista();
  }

  crear(): void {
    this.mensajeExito = null;
    this.mensajeError = null;

    if (this.crearForm.invalid) {
      this.crearForm.markAllAsTouched();
      return;
    }

    this.creando = true;

    const payload = {
      nombre: (this.crearForm.value.nombre as string).trim(),
      activo: 'S'
    };

    this.laboratorioService.crear(payload).subscribe({
      next: () => {
        this.mensajeExito = 'Laboratorio creado correctamente.';
        this.creando = false;
        this.crearForm.reset({ nombre: '' });
        this.cargarLista();
      },
      error: (err) => {
        this.mensajeError = err?.error?.message ?? 'No se pudo crear el laboratorio.';
        this.creando = false;
      }
    });
  }

  toggleActivo(lab: Laboratorio, event: Event): void {
    this.mensajeExito = null;
    this.mensajeError = null;

    const input = event.target as HTMLInputElement;
    const nuevoActivo = input.checked ? 'S' : 'N';

    const payload = {
      nombre: lab.nombre,
      activo: nuevoActivo
    };

    this.laboratorioService.actualizar(lab.idLaboratorio, payload).subscribe({
      next: () => {
        lab.activo = nuevoActivo;
        this.mensajeExito = `Laboratorio "${lab.nombre}" ${nuevoActivo === 'S' ? 'activado' : 'desactivado'}.`;

        if (this.soloActivos && nuevoActivo === 'N') {
          this.cargarLista();
        }
      },
      error: () => {        
        input.checked = !input.checked;
        this.mensajeError = 'No se pudo actualizar el estado del laboratorio.';
      }
    });
  }

  eliminar(lab: Laboratorio): void {
    this.mensajeExito = null;
    this.mensajeError = null;

    const ok = confirm(`¿Seguro que quieres eliminar el laboratorio "${lab.nombre}"?`);
    if (!ok) return;

    this.laboratorioService.eliminar(lab.idLaboratorio).subscribe({
      next: () => {
        this.mensajeExito = `Laboratorio "${lab.nombre}" eliminado.`;
        this.cargarLista();
      },
      error: (err) => {
        this.mensajeError = err?.error?.message ?? 'No se pudo eliminar el laboratorio.';
      }
    });
  }

  get nombreCrear() { return this.crearForm.get('nombre'); }
}