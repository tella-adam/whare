import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';
import { BaseModel } from 'src/common/models/base.model';

@ObjectType()
export class Chore extends BaseModel {
  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => String, { nullable: true })
  reward?: string | null;

  @Field(() => Boolean, { defaultValue: false })
  done: boolean;

  @Field(() => User, { nullable: true })
  createdBy?: User | null;

  @Field(() => User, { nullable: true })
  assignedTo?: User | null;
}
