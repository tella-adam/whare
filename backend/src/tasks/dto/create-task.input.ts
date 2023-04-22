import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateTaskInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  description: string;

  @Field()
  @IsNotEmpty()
  done: boolean;

  @Field()
  @IsNotEmpty()
  createdById: string;

  @Field()
  @IsNotEmpty()
  assignedToId: string;
}
