import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { PrismaService } from 'nestjs-prisma';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { PaginationArgs } from 'src/common/pagination/pagination.args';
import { User } from 'src/users/models/user.model';
import { ChoreIdArgs } from './args/chore-id.args';
import { UserIdArgs } from './args/user-id.args';
import { ChoreOrder } from './dto/chore-order.input';
import { CreateChoreInput } from './dto/create-chore.input';
import { ChoreConnection } from './models/chore-connection.model';
import { Chore } from './models/chore.model';

const pubSub = new PubSub();

@Resolver(() => Chore)
export class ChoresResolver {
  constructor(private prismaService: PrismaService) {}

  @Subscription(() => Chore)
  choreCreated() {
    return pubSub.asyncIterator('choreCreated');
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Chore)
  async createChore(@Args('data') data: CreateChoreInput) {
    const newTask = this.prismaService.chore.create({
      data: {
        name: data.name,
        description: data.description,
        reward: data.reward,
        createdById: data.createdById,
        assignedToId: data.assignedToId,
        done: data.done,
      },
    });
    pubSub.publish('choreCreated', { taskCreated: newTask });
    return newTask;
  }

  @Query(() => ChoreConnection)
  async unfinishedChores(
    @Args() { after, before, first, last }: PaginationArgs,
    @Args({ name: 'query', type: () => String, nullable: true })
    query: string,
    @Args({
      name: 'orderBy',
      type: () => ChoreOrder,
      nullable: true,
    })
    orderBy: ChoreOrder
  ) {
    const a = await findManyCursorConnection(
      (args) =>
        this.prismaService.chore.findMany({
          include: { assignedTo: true, createdBy: true },
          where: {
            done: false,
            name: { contains: query || '' },
            description: { contains: query || '' },
            reward: { contains: query || '' },
          },
          orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : undefined,
          ...args,
        }),
      () =>
        this.prismaService.chore.count({
          where: {
            done: false,
            name: { contains: query || '' },
            description: { contains: query || '' },
            reward: { contains: query || '' },
          },
        }),
      { first, last, before, after }
    );
    return a;
  }

  @Query(() => [Chore])
  userChores(@Args() id: UserIdArgs) {
    return this.prismaService.chore.findMany({
      where: {
        done: false,
        assignedTo: { id: id.userId },
      },
    });
  }

  @Query(() => Chore)
  async chore(@Args() args: ChoreIdArgs) {
    return this.prismaService.chore.findUnique({ where: { id: args.choreId } });
  }

  @Mutation(() => Chore)
  async updateChore(
    @Args('id') id: string,
    @Args('data') data: CreateChoreInput
  ) {
    return this.prismaService.chore.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        reward: data.reward,
        createdById: data.createdById,
        assignedToId: data.assignedToId,
        done: data.done,
      },
    });
  }

  @Mutation(() => Chore)
  async deleteChore(@Args('id') id: string) {
    return this.prismaService.chore.delete({ where: { id } });
  }

  @Mutation(() => Chore)
  async markChoreAsDone(@Args('id') id: string) {
    return this.prismaService.chore.update({
      where: { id },
      data: {
        done: true,
      },
    });
  }

  @Mutation(() => Chore)
  async markChoreAsUndone(@Args('id') id: string) {
    return this.prismaService.chore.update({
      where: { id },
      data: {
        done: false,
      },
    });
  }

  @ResolveField('assignedTo', () => User)
  async assignedTo(@Parent() chore: Chore) {
    return this.prismaService.chore
      .findUnique({ where: { id: chore.id } })
      .assignedTo();
  }

  @ResolveField('createdBy', () => User)
  async createdBy(@Parent() chore: Chore) {
    return this.prismaService.chore
      .findUnique({ where: { id: chore.id } })
      .createdBy();
  }
}
