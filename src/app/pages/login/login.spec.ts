import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { Login } from './login';
import { UsuarioService } from '../../services/usuario';
import { AuthService } from '../../services/auth';
import { RouterTestingModule } from '@angular/router/testing';

describe('Login', () => {
  let fixture: ComponentFixture<Login>;
  let component: Login;

  let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerNavigateSpy: jasmine.Spy;

  beforeEach(async () => {
    usuarioServiceSpy = jasmine.createSpyObj<UsuarioService>('UsuarioService', ['obtenerPorRut']);
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['setUsuario']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, Login],
      providers: [
        FormBuilder,
        { provide: UsuarioService, useValue: usuarioServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;

    const router = TestBed.inject(Router);
    routerNavigateSpy = spyOn(router, 'navigate');

    fixture.detectChanges();
  });


  it('should create and initialize form controls', () => {
    expect(component).toBeTruthy();
    expect(component.loginForm).toBeTruthy();
    expect(component.rut).toBeTruthy();
    expect(component.password).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.passwordVisible).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.passwordVisible).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.passwordVisible).toBeFalse();
  });

  it('onSubmit should mark form touched and stop when invalid', () => {
    const markSpy = spyOn(component.loginForm, 'markAllAsTouched').and.callThrough();
    component.loginForm.patchValue({ rut: '', password: '' });
    component.onSubmit();

    expect(markSpy).toHaveBeenCalled();
    expect(usuarioServiceSpy.obtenerPorRut).not.toHaveBeenCalled();
    expect(component.cargando).toBeFalse();
  });

  it('onSubmit should set error when password does not match', () => {
    component.loginForm.patchValue({ rut: '12345678-9', password: 'Password1!' });

    usuarioServiceSpy.obtenerPorRut.and.returnValue(
      of({ rut: '12345678-9', password: 'Different1!', rol: 'ADMIN' } as any),
    );

    component.onSubmit();

    expect(component.cargando).toBeFalse();
    expect(component.mensajeError).toBe('Contraseña incorrecta.');
    expect(authServiceSpy.setUsuario).not.toHaveBeenCalled();
    expect(routerNavigateSpy).not.toHaveBeenCalled();
  });

  it('onSubmit should navigate to /perfil for ADMIN role (case-insensitive)', () => {
    component.loginForm.patchValue({ rut: '12345678-9', password: 'Password1!' });

    usuarioServiceSpy.obtenerPorRut.and.returnValue(
      of({ rut: '12345678-9', password: 'Password1!', rol: 'admin' } as any),
    );

    const logSpy = spyOn(console, 'log');
    component.onSubmit();

    expect(logSpy).toHaveBeenCalled();
    expect(authServiceSpy.setUsuario).toHaveBeenCalled();
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/perfil']);
    expect(component.cargando).toBeFalse();
    expect(component.mensajeError).toBeNull();
  });

  it('onSubmit should navigate to /inicio for TECNICO role', () => {
    component.loginForm.patchValue({ rut: '12345678-9', password: 'Password1!' });

    usuarioServiceSpy.obtenerPorRut.and.returnValue(
      of({ rut: '12345678-9', password: 'Password1!', rol: 'TECNICO' } as any),
    );

    component.onSubmit();

    expect(authServiceSpy.setUsuario).toHaveBeenCalled();
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/inicio']);
    expect(component.cargando).toBeFalse();
  });

  it('onSubmit should navigate to /resultados for CLIENTE role', () => {
    component.loginForm.patchValue({ rut: '12345678-9', password: 'Password1!' });

    usuarioServiceSpy.obtenerPorRut.and.returnValue(
      of({ rut: '12345678-9', password: 'Password1!', rol: 'CLIENTE' } as any),
    );

    component.onSubmit();

    expect(authServiceSpy.setUsuario).toHaveBeenCalled();
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/resultados']);
    expect(component.cargando).toBeFalse();
  });

  it('onSubmit should default navigate to /inicio for unknown role', () => {
    component.loginForm.patchValue({ rut: '12345678-9', password: 'Password1!' });

    usuarioServiceSpy.obtenerPorRut.and.returnValue(
      of({ rut: '12345678-9', password: 'Password1!', rol: 'OTRO' } as any),
    );

    component.onSubmit();

    expect(authServiceSpy.setUsuario).toHaveBeenCalled();
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/inicio']);
    expect(component.cargando).toBeFalse();
  });

  it('onSubmit should default navigate to /inicio when role is missing/undefined', () => {
    component.loginForm.patchValue({ rut: '12345678-9', password: 'Password1!' });

    usuarioServiceSpy.obtenerPorRut.and.returnValue(
      of({ rut: '12345678-9', password: 'Password1!' } as any),
    );

    component.onSubmit();

    expect(authServiceSpy.setUsuario).toHaveBeenCalled();
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/inicio']);
    expect(component.cargando).toBeFalse();
  });

  it('onSubmit should set error message on service error', () => {
    component.loginForm.patchValue({ rut: '12345678-9', password: 'Password1!' });

    usuarioServiceSpy.obtenerPorRut.and.returnValue(
      throwError(() => new Error('boom')),
    );

    const errSpy = spyOn(console, 'error');
    component.onSubmit();

    expect(errSpy).toHaveBeenCalled();
    expect(component.cargando).toBeFalse();
    expect(component.mensajeError).toBe('Usuario no encontrado o credenciales inválidas.');
    expect(authServiceSpy.setUsuario).not.toHaveBeenCalled();
    expect(routerNavigateSpy).not.toHaveBeenCalled();
  });
});