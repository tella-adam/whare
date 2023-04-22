import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from 'src/common/pagination/pagination';
import { Task } from './task.model';

@ObjectType()
export class TaskConnection extends PaginatedResponse(Task) {}
