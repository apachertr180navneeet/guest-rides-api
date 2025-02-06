import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GuestRidesService } from './guest-rides.service';
import { GuestRidesController } from './guest-rides.controller';

@Module({
  imports: [HttpModule],
  controllers: [GuestRidesController],
  providers: [GuestRidesService],
})
export class GuestRidesModule {}
