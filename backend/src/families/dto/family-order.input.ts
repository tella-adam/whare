import { InputType, registerEnumType } from '@nestjs/graphql';
import { Order } from 'src/common/order/order';

export enum FamilyOrderField {
  id = 'id',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  published = 'published',
  name = 'title',
  members = 'members',
}

registerEnumType(FamilyOrderField, {
  name: 'FamilyOrderField',
  description: 'Properties by which family connections can be ordered.',
});

@InputType()
export class FamilyOrder extends Order {
  field: FamilyOrderField;
}
