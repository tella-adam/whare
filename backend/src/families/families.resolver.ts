import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import { PrismaService } from 'nestjs-prisma';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { CreateFamilyInput } from './dto/createFamily.input';
import { Family } from './models/family.model';

const pubSub = new PubSub();

@Resolver(() => Family)
export class FamiliesResolver {
  constructor(private readonly prismaService: PrismaService) {}

  @Subscription(() => Family)
  postCreated() {
    return pubSub.asyncIterator('familyCreated');
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Family)
  async createFamily(
    @UserEntity() user: User,
    @Args('data') data: CreateFamilyInput
  ) {
    const newFamily = this.prismaService.family.create({
      data: {
        name: data.name,
        members: {
          connect: [{ id: user.id }],
        },
      },
    });
    pubSub.publish('familyCreated', { familyCreated: newFamily });
    return newFamily;
  }

  @Mutation(() => Family)
  async addMemberToFamily(
    @Args('familyId') familyId: string,
    @Args('userId') userId: string
  ) {
    const newFamily = this.prismaService.family.update({
      where: { id: familyId },
      data: {
        members: {
          connect: [{ id: userId }],
        },
      },
    });
    return newFamily;
  }

  @Mutation(() => Family)
  async removeMemberFromFamily(
    @Args('familyId') familyId: string,
    @Args('userId') userId: string
  ) {
    const newFamily = this.prismaService.family.update({
      where: { id: familyId },
      data: {
        members: {
          disconnect: [{ id: userId }],
        },
      },
    });
    return newFamily;
  }

  @Mutation(() => Family)
  async deleteFamily(@Args('familyId') familyId: string) {
    const newFamily = this.prismaService.family.delete({
      where: { id: familyId },
    });
    return newFamily;
  }

  @Query(() => [Family])
  async myFamily(@UserEntity() user: User) {
    return this.prismaService.family.findFirst({
      where: {
        members: {
          some: {
            id: user.id,
          },
        },
      },
    });
  }
}
