import { appConfig } from './app.config';

describe('appConfig', () => {
  it('should define providers', () => {
    expect(appConfig).toBeTruthy();
    expect(appConfig.providers).toBeTruthy();
    expect(Array.isArray(appConfig.providers)).toBeTrue();
  });

  it('should include the expected number of providers', () => {    
    expect(appConfig.providers!.length).toBe(5);
  });
});