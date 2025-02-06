import { Test, TestingModule } from '@nestjs/testing';
import { GuestRidesController } from './guest-rides.controller';

describe('GuestRidesController', () => {
  let controller: GuestRidesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuestRidesController],
    }).compile();

    controller = module.get<GuestRidesController>(GuestRidesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
