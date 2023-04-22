import { Module } from '@nestjs/common';
import { FamiliesResolver } from './families.resolver';

@Module({
  providers: [FamiliesResolver],
})
export class FamiliesModule {}
