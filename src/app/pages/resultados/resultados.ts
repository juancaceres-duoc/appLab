import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { AnalisisService } from '../../services/analisis';
import { AuthService } from '../../services/auth';
import { Analisis } from '../../models/analisis';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor
  ],
  templateUrl: './resultados.html',
  styleUrls: ['./resultados.scss'],
})
export class Resultados implements OnInit {

  resultados: Analisis[] = [];
  cargando = true;
  error: string | null = null;

  constructor(
    private analisisService: AnalisisService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    const usuario = this.authService.getUsuario();

    if (!usuario) {
      this.error = 'No se encontró el usuario logueado.';
      this.cargando = false;
      return;
    }

    const rut = usuario.rut;

    this.analisisService.obtenerPorRutUsuario(rut).subscribe({
      next: (data) => {
        this.resultados = data ?? [];
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron obtener los análisis.';
        this.cargando = false;
      },
    });
  }
}