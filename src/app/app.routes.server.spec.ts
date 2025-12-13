import { RenderMode } from '@angular/ssr';
import { serverRoutes } from './app.routes.server';

describe('serverRoutes', () => {
  it('should define server routes', () => {
    expect(serverRoutes).toBeTruthy();
    expect(Array.isArray(serverRoutes)).toBeTrue();
    expect(serverRoutes.length).toBeGreaterThan(0);
  });

  it('should prerender wildcard path', () => {
    expect(serverRoutes[0]).toEqual({
      path: '**',
      renderMode: RenderMode.Prerender,
    });
  });
});