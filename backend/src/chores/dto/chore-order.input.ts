import { InputType, registerEnumType } from '@nestjs/graphql';
import { Order } from 'src/common/order/order';

export enum ChoreOrderField {
  id = 'id',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  published = 'published',
  name = 'name',
  done = 'done',
  description = 'description',
  reward = 'reward',
}

registerEnumType(ChoreOrderField, {
  name: 'ChoreOrderField',
  description: 'Properties by which chore connections can be ordered.',
});

@InputType()
export class ChoreOrder extends Order {
  field: ChoreOrderField;
}
