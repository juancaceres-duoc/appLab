import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Analisis } from '../models/analisis';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalisisService {

  private baseUrl = `${environment.apiUrl}/analisis`;

  constructor(private http: HttpClient) { }

  // GET /api/analisis
  listar(): Observable<Analisis[]> {
    return this.http.get<Analisis[]>(this.baseUrl);
  }

  // GET /api/analisis/id/{id}
  obtenerPorId(id: number): Observable<Analisis> {
    return this.http.get<Analisis>(`${this.baseUrl}/id/${id}`);
  }

  // GET /api/analisis/rut/{rutUsuario}
  obtenerPorRutUsuario(rutUsuario: string): Observable<Analisis[]> {
    return this.http.get<Analisis[]>(`${this.baseUrl}/rut/${rutUsuario}`);
  }

  // GET /api/analisis/laboratorio/{laboratorio}
  obtenerPorLaboratorio(laboratorio: string): Observable<Analisis[]> {
    return this.http.get<Analisis[]>(`${this.baseUrl}/laboratorio/${laboratorio}`);
  }

  // POST /api/analisis
  crear(analisis: Analisis): Observable<Analisis> {
    return this.http.post<Analisis>(this.baseUrl, analisis);
  }

  // PUT /api/analisis/id/{id}
  actualizar(id: number, analisis: Analisis): Observable<Analisis> {
    return this.http.put<Analisis>(`${this.baseUrl}/id/${id}`, analisis);
  }

  // DELETE /api/analisis/id/{id}
  eliminar(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/id/${id}`, { responseType: 'text' });
  }
}
