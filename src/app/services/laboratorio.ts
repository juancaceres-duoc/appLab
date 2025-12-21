import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Laboratorio } from '../models/laboratorio';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LaboratorioService {

  private readonly baseUrl = `${environment.apiUrl}/laboratorios`;

  constructor(private readonly http: HttpClient) {}

  // GET /api/laboratorios
  listar(): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(this.baseUrl);
  }

  // GET /api/laboratorios/activos
  listarActivos(): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(`${this.baseUrl}/activos`);
  }

  // GET /api/laboratorios/id/{id}
  obtenerPorId(id: number): Observable<Laboratorio> {
    return this.http.get<Laboratorio>(`${this.baseUrl}/id/${id}`);
  }

  // POST /api/laboratorios
  crear(lab: Partial<Laboratorio>): Observable<Laboratorio> {
    return this.http.post<Laboratorio>(this.baseUrl, lab);
  }

  // PUT /api/laboratorios/id/{id}
  actualizar(id: number, lab: Partial<Laboratorio>): Observable<Laboratorio> {
    return this.http.put<Laboratorio>(`${this.baseUrl}/id/${id}`, lab);
  }

  // DELETE /api/laboratorios/id/{id}
  eliminar(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/id/${id}`, { responseType: 'text' });
  }
}