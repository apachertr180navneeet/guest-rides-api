import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GuestRidesModule } from './guest-rides/guest-rides.module';

@Module({
  imports: [GuestRidesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
