import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Registro } from './registro';
import { UsuarioService } from '../../services/usuario';

describe('Registro', () => {
  let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;

  beforeEach(async () => {
    usuarioServiceSpy = jasmine.createSpyObj<UsuarioService>('UsuarioService', ['crear']);

    await TestBed.configureTestingModule({
      imports: [Registro],
      providers: [{ provide: UsuarioService, useValue: usuarioServiceSpy }],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Registro);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('togglePasswordVisibility should invert passwordVisible', () => {
    const fixture = TestBed.createComponent(Registro);
    const comp = fixture.componentInstance;

    expect(comp.passwordVisible).toBeFalse();
    comp.togglePasswordVisibility();
    expect(comp.passwordVisible).toBeTrue();
  });

  it('toggleConfirmPasswordVisibility should invert confirmPasswordVisible', () => {
    const fixture = TestBed.createComponent(Registro);
    const comp = fixture.componentInstance;

    expect(comp.confirmPasswordVisible).toBeFalse();
    comp.toggleConfirmPasswordVisibility();
    expect(comp.confirmPasswordVisible).toBeTrue();
  });

  it('passwordsIgualesValidator should mark form invalid when passwords differ', () => {
    const fixture = TestBed.createComponent(Registro);
    const comp = fixture.componentInstance;

    comp.registroForm.patchValue({
      nombre: 'Juan',
      rut: '12345678-9',
      email: 'juan@duoc.cl',
      password: 'Aa1!aaaa',
      confirmPassword: 'Aa1!aaab',
    });

    comp.registroForm.updateValueAndValidity();

    expect(comp.registroForm.errors).toEqual({ passwordsNoCoinciden: true } as any);
    expect(comp.registroForm.valid).toBeFalse();
  });

  it('onSubmit should markAllAsTouched and return when form invalid', () => {
    const fixture = TestBed.createComponent(Registro);
    const comp = fixture.componentInstance;

    comp.registroForm.patchValue({ nombre: '', rut: '', email: '', password: '', confirmPassword: '' });
    const markSpy = spyOn(comp.registroForm, 'markAllAsTouched').and.callThrough();

    comp.onSubmit();

    expect(markSpy).toHaveBeenCalled();
    expect(usuarioServiceSpy.crear).not.toHaveBeenCalled();
  });

  it('onSubmit should call crear and set mensajeExito on success', () => {
    const fixture = TestBed.createComponent(Registro);
    const comp = fixture.componentInstance;

    const formPassword = 'Aa1!aaaa';
    comp.registroForm.setValue({
      nombre: 'Juan',
      rut: '12345678-9',
      email: 'juan@duoc.cl',
      password: formPassword,
      confirmPassword: formPassword,
    });

    const backendResp: any = { rut: '12345678-9', nombre: 'Juan', correo: 'juan@duoc.cl', rol: 'CLIENTE' };
    usuarioServiceSpy.crear.and.returnValue(of(backendResp));

    const resetSpy = spyOn(comp.registroForm, 'reset').and.callThrough();

    comp.onSubmit();

    expect(usuarioServiceSpy.crear).toHaveBeenCalled();
    const sentUser = usuarioServiceSpy.crear.calls.mostRecent().args[0] as any;

    expect(sentUser).toEqual(jasmine.objectContaining({
      username: '12345678-9',
      password: formPassword,
      nombre: 'Juan',
      rol: 'CLIENTE',
      rut: '12345678-9',
      correo: 'juan@duoc.cl',
    }));

    expect(comp.mensajeExito).toBe('Usuario registrado correctamente. Tu rol actual es CLIENTE.');
    expect(comp.mensajeError).toBeNull();
    expect(resetSpy).toHaveBeenCalled();
  });

  it('onSubmit should set mensajeError on service error', () => {
    const fixture = TestBed.createComponent(Registro);
    const comp = fixture.componentInstance;

    const formPassword = 'Aa1!aaaa';
    comp.registroForm.setValue({
      nombre: 'Juan',
      rut: '12345678-9',
      email: 'juan@duoc.cl',
      password: formPassword,
      confirmPassword: formPassword,
    });

    usuarioServiceSpy.crear.and.returnValue(throwError(() => new Error('boom')));

    comp.onSubmit();

    expect(comp.mensajeError).toBe('Ocurrió un error al registrar el usuario.');
    expect(comp.mensajeExito).toBeNull();
  });
});
