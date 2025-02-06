import { Test, TestingModule } from '@nestjs/testing';
import { GuestRidesService } from './guest-rides.service';

describe('GuestRidesService', () => {
  let service: GuestRidesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuestRidesService],
    }).compile();

    service = module.get<GuestRidesService>(GuestRidesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
