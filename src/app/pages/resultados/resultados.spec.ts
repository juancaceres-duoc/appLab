import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Resultados } from './resultados';
import { AnalisisService } from '../../services/analisis';
import { AuthService } from '../../services/auth';

describe('Resultados', () => {
  let analisisSpy: jasmine.SpyObj<AnalisisService>;
  let authSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    analisisSpy = jasmine.createSpyObj<AnalisisService>('AnalisisService', ['obtenerPorRutUsuario']);
    authSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getUsuario']);

    await TestBed.configureTestingModule({
      imports: [Resultados],
      providers: [
        { provide: AnalisisService, useValue: analisisSpy },
        { provide: AuthService, useValue: authSpy },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Resultados);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('ngOnInit should set error and stop when no logged user', () => {
    authSpy.getUsuario.and.returnValue(null);

    const fixture = TestBed.createComponent(Resultados);
    const comp = fixture.componentInstance;

    comp.ngOnInit();

    expect(comp.error).toBe('No se encontró el usuario logueado.');
    expect(comp.cargando).toBeFalse();
    expect(analisisSpy.obtenerPorRutUsuario).not.toHaveBeenCalled();
  });

  it('ngOnInit should load results for logged user (data null -> [])', () => {
    authSpy.getUsuario.and.returnValue({ rut: '12345678-9' } as any);
    analisisSpy.obtenerPorRutUsuario.and.returnValue(of(null as any));

    const fixture = TestBed.createComponent(Resultados);
    const comp = fixture.componentInstance;

    comp.ngOnInit();

    expect(analisisSpy.obtenerPorRutUsuario).toHaveBeenCalledWith('12345678-9');
    expect(comp.resultados).toEqual([]);
    expect(comp.cargando).toBeFalse();
    expect(comp.error).toBeNull();
  });

  it('ngOnInit should set resultados when service returns data', () => {
    authSpy.getUsuario.and.returnValue({ rut: '12345678-9' } as any);
    const data: any[] = [{ id: 1 }, { id: 2 }];
    analisisSpy.obtenerPorRutUsuario.and.returnValue(of(data as any));

    const fixture = TestBed.createComponent(Resultados);
    const comp = fixture.componentInstance;

    comp.ngOnInit();

    expect(comp.resultados).toEqual(data as any);
    expect(comp.cargando).toBeFalse();
  });

  it('ngOnInit should set error when service fails', () => {
    authSpy.getUsuario.and.returnValue({ rut: '12345678-9' } as any);
    analisisSpy.obtenerPorRutUsuario.and.returnValue(throwError(() => new Error('boom')));

    const fixture = TestBed.createComponent(Resultados);
    const comp = fixture.componentInstance;

    comp.ngOnInit();

    expect(comp.error).toBe('No se pudieron obtener los análisis.');
    expect(comp.cargando).toBeFalse();
  });
});
