import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';
import { BaseModel } from 'src/common/models/base.model';

@ObjectType()
export class Family extends BaseModel {
  @Field()
  name: string;

  @Field(() => [User], { nullable: true })
  members?: [User] | null;
}
