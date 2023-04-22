import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from 'src/common/pagination/pagination';
import { Family } from './family.model';

@ObjectType()
export class FamilyConnection extends PaginatedResponse(Family) {}
