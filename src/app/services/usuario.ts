import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { environment } from '../../environments/environment';

interface RecuperarPasswordResponse {
  existe: boolean;
  mensaje: string;
  passwordActual?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  // GET /api/usuarios
  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl);
  }

  // GET /api/usuarios/id/{id}
  obtenerPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/id/${id}`);
  }

  // GET /api/usuarios/rut/{rut}
  obtenerPorRut(rut: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/rut/${rut}`);
  }

  // GET /api/usuarios/rol/{rol}
  obtenerPorRol(rol: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/rol/${rol}`);
  }

  // POST /api/usuarios
  crear(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUrl, usuario);
  }

  // PUT /api/usuarios/rut/{rut}
  actualizarPorRut(rut: string, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/rut/${rut}`, usuario);
  }

  // DELETE /api/usuarios/rut/{rut}
  eliminarPorRut(rut: string): Observable<string> {
    return this.http.delete(`${this.baseUrl}/rut/${rut}`, { responseType: 'text' });
  }

  // POST /api/usuarios/recuperar-password
  recuperarPassword(correo: string): Observable<RecuperarPasswordResponse> {
    return this.http.post<RecuperarPasswordResponse>(
      `${this.baseUrl}/recuperar-password`,
      { correo }
    );
  }
}
