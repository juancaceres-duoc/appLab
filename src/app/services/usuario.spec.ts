import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UsuarioService } from './usuario';
import { environment } from '../../environments/environment';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;

  const baseUrl = `${environment.apiUrl}/usuarios`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsuarioService],
    });

    service = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('listar() should GET baseUrl', () => {
    const mock = [{ id: 1 } as any];

    service.listar().subscribe((res) => {
      expect(res).toEqual(mock as any);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('obtenerPorId() should GET baseUrl/id/{id}', () => {
    const id = 5;
    const mock = { id } as any;

    service.obtenerPorId(id).subscribe((res) => {
      expect(res).toEqual(mock as any);
    });

    const req = httpMock.expectOne(`${baseUrl}/id/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('obtenerPorRut() should GET baseUrl/rut/{rut}', () => {
    const rut = '12345678-9';
    const mock = { rut } as any;

    service.obtenerPorRut(rut).subscribe((res) => {
      expect(res).toEqual(mock as any);
    });

    const req = httpMock.expectOne(`${baseUrl}/rut/${rut}`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('obtenerPorRol() should GET baseUrl/rol/{rol}', () => {
    const rol = 'ADMIN';
    const mock = [{ rol } as any];

    service.obtenerPorRol(rol).subscribe((res) => {
      expect(res).toEqual(mock as any);
    });

    const req = httpMock.expectOne(`${baseUrl}/rol/${rol}`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('crear() should POST baseUrl with body', () => {
    const payload = { rut: '123' } as any;
    const mockResponse = { id: 1, ...payload } as any;

    service.crear(payload).subscribe((res) => {
      expect(res).toEqual(mockResponse as any);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('actualizarPorRut() should PUT baseUrl/rut/{rut} with body', () => {
    const rut = '12345678-9';
    const payload = { rut, nombre: 'Juan' } as any;
    const mockResponse = { ...payload } as any;

    service.actualizarPorRut(rut, payload).subscribe((res) => {
      expect(res).toEqual(mockResponse as any);
    });

    const req = httpMock.expectOne(`${baseUrl}/rut/${rut}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('eliminarPorRut() should DELETE baseUrl/rut/{rut} and return text', () => {
    const rut = '12345678-9';
    const mockText = 'DELETED';

    service.eliminarPorRut(rut).subscribe((res) => {
      expect(res).toBe(mockText);
    });

    const req = httpMock.expectOne(`${baseUrl}/rut/${rut}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.responseType).toBe('text');
    req.flush(mockText);
  });

  it('recuperarPassword() should POST baseUrl/recuperar-password with {correo}', () => {
    const correo = 'test@correo.cl';
    const mockResponse = { existe: true, mensaje: 'ok', passwordActual: 'x' } as any;

    service.recuperarPassword(correo).subscribe((res) => {
      expect(res).toEqual(mockResponse as any);
      expect(res.existe).toBeTrue();
    });

    const req = httpMock.expectOne(`${baseUrl}/recuperar-password`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ correo });
    req.flush(mockResponse);
  });
});