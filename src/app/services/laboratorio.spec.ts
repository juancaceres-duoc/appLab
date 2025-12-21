import { TestBed } from '@angular/core/testing';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';

import { LaboratorioService } from './laboratorio';
import { environment } from '../../environments/environment';
import { Laboratorio } from '../models/laboratorio';

describe('LaboratorioService', () => {
    let service: LaboratorioService;
    let httpMock: HttpTestingController;

    const baseUrl = `${environment.apiUrl}/laboratorios`;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [LaboratorioService],
        });

        service = TestBed.inject(LaboratorioService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('listar() should GET /laboratorios', () => {
        const mock: Laboratorio[] = [
            { idLaboratorio: 1, nombre: 'BioLab', activo: 'S' } as any,
            { idLaboratorio: 2, nombre: 'ClinLab', activo: 'N' } as any,
        ];

        service.listar().subscribe((res) => {
            expect(res).toEqual(mock);
        });

        const req = httpMock.expectOne(baseUrl);
        expect(req.request.method).toBe('GET');

        req.flush(mock);
    });

    it('listarActivos() should GET /laboratorios/activos', () => {
        const mock: Laboratorio[] = [
            { idLaboratorio: 1, nombre: 'BioLab', activo: 'S' } as any,
        ];

        service.listarActivos().subscribe((res) => {
            expect(res).toEqual(mock);
        });

        const req = httpMock.expectOne(`${baseUrl}/activos`);
        expect(req.request.method).toBe('GET');

        req.flush(mock);
    });

    it('obtenerPorId(id) should GET /laboratorios/id/{id}', () => {
        const id = 10;
        const mock: Laboratorio = { idLaboratorio: id, nombre: 'X', activo: 'S' } as any;

        service.obtenerPorId(id).subscribe((res) => {
            expect(res).toEqual(mock);
        });

        const req = httpMock.expectOne(`${baseUrl}/id/${id}`);
        expect(req.request.method).toBe('GET');

        req.flush(mock);
    });

    it('crear(lab) should POST /laboratorios with body', () => {
        const payload: Partial<Laboratorio> = { nombre: 'Nuevo' } as any;
        const mockResp: Laboratorio = { idLaboratorio: 99, nombre: 'Nuevo', activo: 'S' } as any;

        service.crear(payload).subscribe((res) => {
            expect(res).toEqual(mockResp);
        });

        const req = httpMock.expectOne(baseUrl);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(payload);

        req.flush(mockResp);
    });

    it('actualizar(id, lab) should PUT /laboratorios/id/{id} with body', () => {
        const id = 5;
        const payload: Partial<Laboratorio> = { nombre: 'Editado', activo: 'N' as any } as any;
        const mockResp: Laboratorio = { idLaboratorio: id, nombre: 'Editado', activo: 'N' } as any;

        service.actualizar(id, payload).subscribe((res) => {
            expect(res).toEqual(mockResp);
        });

        const req = httpMock.expectOne(`${baseUrl}/id/${id}`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(payload);

        req.flush(mockResp);
    });

    it('eliminar(id) should DELETE /laboratorios/id/{id} and return text', () => {
        const id = 7;
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