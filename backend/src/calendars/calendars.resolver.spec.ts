import { Test, TestingModule } from '@nestjs/testing';
import { CalendarsResolver } from './calendars.resolver';

describe('CalendarsResolver', () => {
  let resolver: CalendarsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalendarsResolver],
    }).compile();

    resolver = module.get<CalendarsResolver>(CalendarsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
