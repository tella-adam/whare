import { InputType, registerEnumType } from '@nestjs/graphql';
import { Order } from 'src/common/order/order';

export enum TaskOrderField {
  id = 'id',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  published = 'published',
  name = 'name',
  done = 'done',
  description = 'description',
}

registerEnumType(TaskOrderField, {
  name: 'TaskOrderField',
  description: 'Properties by which task connections can be ordered.',
});

@InputType()
export class TaskOrder extends Order {
  field: TaskOrderField;
}
