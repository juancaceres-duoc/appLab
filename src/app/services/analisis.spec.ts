import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AnalisisService } from './analisis';
import { environment } from '../../environments/environment';

describe('AnalisisService', () => {
  let service: AnalisisService;
  let httpMock: HttpTestingController;

  const baseUrl = `${environment.apiUrl}/analisis`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AnalisisService],
    });

    service = TestBed.inject(AnalisisService);
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
    const id = 123;
    const mock = { id } as any;

    service.obtenerPorId(id).subscribe((res) => {
      expect(res).toEqual(mock as any);
    });

    const req = httpMock.expectOne(`${baseUrl}/id/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('obtenerPorRutUsuario() should GET baseUrl/rut/{rutUsuario}', () => {
    const rutUsuario = '12345678-9';
    const mock = [{ rutUsuario } as any];

    service.obtenerPorRutUsuario(rutUsuario).subscribe((res) => {
      expect(res).toEqual(mock as any);
    });

    const req = httpMock.expectOne(`${baseUrl}/rut/${rutUsuario}`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('obtenerPorLaboratorio() should GET baseUrl/laboratorio/{laboratorio}', () => {
    const laboratorio = 'Lab A';
    const mock = [{ laboratorio } as any];

    service.obtenerPorLaboratorio(laboratorio).subscribe((res) => {
      expect(res).toEqual(mock as any);
    });

    const req = httpMock.expectOne(`${baseUrl}/laboratorio/${laboratorio}`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('crear() should POST baseUrl with body', () => {
    const payload = { foo: 'bar' } as any;
    const mockResponse = { id: 1, ...payload } as any;

    service.crear(payload).subscribe((res) => {
      expect(res).toEqual(mockResponse as any);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('actualizar() should PUT baseUrl/id/{id} with body', () => {
    const id = 10;
    const payload = { id, updated: true } as any;
    const mockResponse = { ...payload } as any;

    service.actualizar(id, payload).subscribe((res) => {
      expect(res).toEqual(mockResponse as any);
    });

    const req = httpMock.expectOne(`${baseUrl}/id/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('eliminar() should DELETE baseUrl/id/{id} and return text', () => {
    const id = 99;
    const mockText = 'OK';

    service.eliminar(id).subscribe((res) => {
      expect(res).toBe(mockText);
    });

    const req = httpMock.expectOne(`${baseUrl}/id/${id}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.responseType).toBe('text');
    req.flush(mockText);
  });
});
