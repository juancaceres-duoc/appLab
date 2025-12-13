import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start logged out', () => {
    expect(service.getUsuario()).toBeNull();
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('setUsuario() and getUsuario() should store and return current user', () => {
    const u = { rut: '123', rol: 'CLIENTE' } as any;

    service.setUsuario(u);

    expect(service.getUsuario()).toEqual(u);
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('isAdmin() should be true for ADMIN role (case-insensitive)', () => {
    service.setUsuario({ rol: 'admin' } as any);
    expect(service.isAdmin()).toBeTrue();

    service.setUsuario({ rol: 'ADMIN' } as any);
    expect(service.isAdmin()).toBeTrue();
  });

  it('isAdmin() should be false when no user or different role', () => {
    service.logout();
    expect(service.isAdmin()).toBeFalse();

    service.setUsuario({ rol: 'CLIENTE' } as any);
    expect(service.isAdmin()).toBeFalse();
  });

  it('isCliente() should be true for CLIENTE role (case-insensitive)', () => {
    service.setUsuario({ rol: 'cliente' } as any);
    expect(service.isCliente()).toBeTrue();
  });

  it('isTecnico() should be true for TECNICO role (case-insensitive)', () => {
    service.setUsuario({ rol: 'tecnico' } as any);
    expect(service.isTecnico()).toBeTrue();
  });

  it('logout() should clear current user', () => {
    service.setUsuario({ rol: 'ADMIN' } as any);
    expect(service.isLoggedIn()).toBeTrue();

    service.logout();

    expect(service.getUsuario()).toBeNull();
    expect(service.isLoggedIn()).toBeFalse();
    expect(service.isAdmin()).toBeFalse();
    expect(service.isCliente()).toBeFalse();
    expect(service.isTecnico()).toBeFalse();
  });
});
