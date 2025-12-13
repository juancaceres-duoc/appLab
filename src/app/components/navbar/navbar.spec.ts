import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Navbar } from './navbar';
import { AuthService } from '../../services/auth';

describe('Navbar', () => {
  let authSpy: jasmine.SpyObj<AuthService>;
  let router: Router;
  let navigateSpy: jasmine.Spy;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj<AuthService>('AuthService', [
      'isAdmin',
      'isCliente',
      'isTecnico',
      'isLoggedIn',
      'getUsuario',
      'logout',
    ]);

    authSpy.isAdmin.and.returnValue(false);
    authSpy.isCliente.and.returnValue(false);
    authSpy.isTecnico.and.returnValue(false);
    authSpy.isLoggedIn.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authSpy },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    navigateSpy = spyOn(router, 'navigate').and.resolveTo(true);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Navbar);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('esAdmin() should delegate to AuthService.isAdmin()', () => {
    authSpy.isAdmin.and.returnValue(true);

    const fixture = TestBed.createComponent(Navbar);
    const comp = fixture.componentInstance;

    expect(comp.esAdmin()).toBeTrue();
    expect(authSpy.isAdmin).toHaveBeenCalled();
  });

  it('usuarioActual getter should return AuthService.getUsuario()', () => {
    const mockUser: any = { rut: '11111111-1', rol: 'ADMIN' };
    authSpy.getUsuario.and.returnValue(mockUser);

    const fixture = TestBed.createComponent(Navbar);
    const comp = fixture.componentInstance;

    expect(comp.usuarioActual).toEqual(mockUser);
    expect(authSpy.getUsuario).toHaveBeenCalled();
  });

  it('logout() should call auth.logout and navigate to /login', async () => {
    const fixture = TestBed.createComponent(Navbar);
    const comp = fixture.componentInstance;

    comp.logout();

    expect(authSpy.logout).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
