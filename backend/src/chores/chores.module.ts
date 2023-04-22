import { Module } from '@nestjs/common';
import { ChoresResolver } from './chores.resolver';

@Module({
  providers: [ChoresResolver],
})
export class ChoresModule {}
