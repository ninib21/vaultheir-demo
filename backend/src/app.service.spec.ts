import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(() => {
    service = new AppService();
  });

  it('returns the Vaultheir greeting message', () => {
    expect(service.getHello()).toBe('Vaultheir™ Backend API - Powered by BidayaX LLC');
  });
});

