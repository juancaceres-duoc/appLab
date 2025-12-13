import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Recuperar } from './recuperar';
import { UsuarioService } from '../../services/usuario';

describe('Recuperar', () => {
  let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;

  beforeEach(async () => {
    usuarioServiceSpy = jasmine.createSpyObj<UsuarioService>('UsuarioService', ['recuperarPassword']);

    await TestBed.configureTestingModule({
      imports: [Recuperar],
      providers: [{ provide: UsuarioService, useValue: usuarioServiceSpy }],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Recuperar);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('onSubmit should markAllAsTouched and return when form invalid', () => {
    const fixture = TestBed.createComponent(Recuperar);
    const comp = fixture.componentInstance;

    comp.recuperarForm.setValue({ email: '' });
    const markSpy = spyOn(comp.recuperarForm, 'markAllAsTouched').and.callThrough();

    comp.onSubmit();

    expect(markSpy).toHaveBeenCalled();
    expect(usuarioServiceSpy.recuperarPassword).not.toHaveBeenCalled();
  });

  it('onSubmit should set mensajeExito when email exists (with passwordActual)', () => {
    const fixture = TestBed.createComponent(Recuperar);
    const comp = fixture.componentInstance;

    usuarioServiceSpy.recuperarPassword.and.returnValue(of({ existe: true, passwordActual: 'abc123' } as any));

    comp.recuperarForm.setValue({ email: 'a@a.cl' });
    comp.onSubmit();

    expect(usuarioServiceSpy.recuperarPassword).toHaveBeenCalledWith('a@a.cl');
    expect(comp.mensajeExito).toContain('abc123');
    expect(comp.mensajeError).toBeNull();
  });

  it('onSubmit should use "***" when passwordActual is null/undefined', () => {
    const fixture = TestBed.createComponent(Recuperar);
    const comp = fixture.componentInstance;

    usuarioServiceSpy.recuperarPassword.and.returnValue(of({ existe: true, passwordActual: null } as any));

    comp.recuperarForm.setValue({ email: 'a@a.cl' });
    comp.onSubmit();

    expect(comp.mensajeExito).toContain('***');
  });

  it('onSubmit should set mensajeError when email does not exist', () => {
    const fixture = TestBed.createComponent(Recuperar);
    const comp = fixture.componentInstance;

    usuarioServiceSpy.recuperarPassword.and.returnValue(of({ existe: false } as any));

    comp.recuperarForm.setValue({ email: 'a@a.cl' });
    comp.onSubmit();

    expect(comp.mensajeError).toBe('El correo no existe en el sistema.');
    expect(comp.mensajeExito).toBeNull();
  });

  it('onSubmit should set mensajeError on service error', () => {
    const fixture = TestBed.createComponent(Recuperar);
    const comp = fixture.componentInstance;

    usuarioServiceSpy.recuperarPassword.and.returnValue(throwError(() => new Error('boom')));

    comp.recuperarForm.setValue({ email: 'a@a.cl' });
    comp.onSubmit();

    expect(comp.mensajeError).toBe('Ocurrió un error al intentar recuperar la contraseña.');
    expect(comp.mensajeExito).toBeNull();
  });
});
