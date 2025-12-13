import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Inicio } from './inicio';
import { AuthService } from '../../services/auth';

describe('Inicio', () => {
  let routerSpy: jasmine.SpyObj<Router>;
  let authSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    authSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getUsuario', 'isAdmin']);

    await TestBed.configureTestingModule({
      imports: [Inicio],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authSpy },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Inicio);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('ngOnInit should set usuarioActual and NOT navigate when user exists', () => {
    const mockUser: any = { rut: '12345678-9', rol: 'TECNICO' };
    authSpy.getUsuario.and.returnValue(mockUser);

    const fixture = TestBed.createComponent(Inicio);
    const comp = fixture.componentInstance;

    comp.ngOnInit();

    expect(comp.usuarioActual).toEqual(mockUser);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('ngOnInit should navigate to /login when no user', () => {
    authSpy.getUsuario.and.returnValue(null);

    const fixture = TestBed.createComponent(Inicio);
    const comp = fixture.componentInstance;

    comp.ngOnInit();

    expect(comp.usuarioActual).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('esAdmin() should delegate to AuthService.isAdmin()', () => {
    authSpy.isAdmin.and.returnValue(false);

    const fixture = TestBed.createComponent(Inicio);
    const comp = fixture.componentInstance;

    expect(comp.esAdmin()).toBeFalse();
    expect(authSpy.isAdmin).toHaveBeenCalled();
  });
});
