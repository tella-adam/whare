import { Module } from '@nestjs/common';
import { CalendarsResolver } from './calendars.resolver';

@Module({
  providers: [CalendarsResolver]
})
export class CalendarsModule {}
