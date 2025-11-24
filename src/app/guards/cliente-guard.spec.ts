import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ClienteGuard } from './cliente-guard';
import { AuthService } from '../services/auth';

describe('ClienteGuard', () => {
  let guard: ClienteGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['getUsuario']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        ClienteGuard,
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    });

    guard = TestBed.inject(ClienteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user role is CLIENTE', () => {
    authService.getUsuario.and.returnValue({
      idUsuario: 1,
      username: 'cliente1',
      password: 'Pass1234',
      nombre: 'Juanito',
      rol: 'CLIENTE',
      rut: '12345678-9',
      correo: 'cliente@mail.com'
    });

    const result = guard.canActivate();
    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should block access and redirect when user is not CLIENTE', () => {
    authService.getUsuario.and.returnValue({
      idUsuario: 2,
      username: 'admin1',
      password: 'Pass1234',
      nombre: 'Mario',
      rol: 'ADMIN',
      rut: '98765432-1',
      correo: 'admin@mail.com'
    });

    const result = guard.canActivate();
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should block access and redirect when there is no user', () => {
    authService.getUsuario.and.returnValue(null);

    const result = guard.canActivate();
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
