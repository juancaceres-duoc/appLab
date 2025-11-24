import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { AdminGuard } from './admin-guard';
import { AuthService } from '../services/auth';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', [
      'isLoggedIn',
      'isAdmin'
    ]);

    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: AuthService, useValue: authService },
      ],
      imports: []
    });

    guard = TestBed.inject(AdminGuard);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect to /login if user is not logged in', () => {
    authService.isLoggedIn.and.returnValue(false);

    const url = router.parseUrl('/login');
    const result = guard.canActivate();

    expect(result instanceof UrlTree).toBeTrue();
    expect((result as UrlTree).toString()).toBe(url.toString());
  });

  it('should redirect to /inicio if user is logged in but not admin', () => {
    authService.isLoggedIn.and.returnValue(true);
    authService.isAdmin.and.returnValue(false);

    const url = router.parseUrl('/inicio');
    const result = guard.canActivate();

    expect(result instanceof UrlTree).toBeTrue();
    expect((result as UrlTree).toString()).toBe(url.toString());
  });

  it('should allow access if user is admin', () => {
    authService.isLoggedIn.and.returnValue(true);
    authService.isAdmin.and.returnValue(true);

    const result = guard.canActivate();
    expect(result).toBeTrue();
  });
});
