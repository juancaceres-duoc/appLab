import { routes } from './app.routes';
import { AdminGuard } from './guards/admin-guard';
import { ClienteGuard } from './guards/cliente-guard';

describe('routes', () => {
  it('should define routes array', () => {
    expect(routes).toBeTruthy();
    expect(Array.isArray(routes)).toBeTrue();
    expect(routes.length).toBeGreaterThan(0);
  });

  it('should have default redirect to login', () => {
    const r = routes.find(x => x.path === '');
    expect(r).toBeTruthy();
    expect(r!.redirectTo).toBe('login');
    expect(r!.pathMatch).toBe('full');
  });

  it('should protect resultados with ClienteGuard', () => {
    const r = routes.find(x => x.path === 'resultados');
    expect(r).toBeTruthy();
    expect(r!.canActivate).toEqual([ClienteGuard]);
  });

  it('should protect perfil with AdminGuard', () => {
    const r = routes.find(x => x.path === 'perfil');
    expect(r).toBeTruthy();
    expect(r!.canActivate).toEqual([AdminGuard]);
  });

  it('should redirect wildcard to login', () => {
    const r = routes.find(x => x.path === '**');
    expect(r).toBeTruthy();
    expect(r!.redirectTo).toBe('login');
  });
});