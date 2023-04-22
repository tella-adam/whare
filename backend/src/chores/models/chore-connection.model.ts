import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from 'src/common/pagination/pagination';
import { Chore } from './chore.model';

@ObjectType()
export class ChoreConnection extends PaginatedResponse(Chore) {}
