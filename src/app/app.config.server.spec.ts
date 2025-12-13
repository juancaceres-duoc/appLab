import { config } from './app.config.server';
import { appConfig } from './app.config';

describe('server app config', () => {
  it('should export merged config', () => {
    expect(config).toBeTruthy();
    expect(config.providers).toBeTruthy();
    expect(Array.isArray(config.providers)).toBeTrue();
  });

  it('should include at least the client providers after merge', () => {
    expect(config.providers!.length).toBeGreaterThanOrEqual(appConfig.providers!.length);
  });
});