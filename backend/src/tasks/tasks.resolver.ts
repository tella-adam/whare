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
import { TaskIdArgs } from './args/task-id.args';
import { UserIdArgs } from './args/user-id.args';
import { CreateTaskInput } from './dto/create-task.input';
import { TaskOrder } from './dto/task-order.input';
import { TaskConnection } from './models/task-connection.model';
import { Task } from './models/task.model';

const pubSub = new PubSub();

@Resolver(() => Task)
export class TasksResolver {
  constructor(private prismaService: PrismaService) {}

  @Subscription(() => Task)
  postCreated() {
    return pubSub.asyncIterator('postCreated');
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Task)
  async createTask(@Args('data') data: CreateTaskInput) {
    const newTask = this.prismaService.task.create({
      data: {
        name: data.name,
        description: data.description,
        createdById: data.createdById,
        assignedToId: data.assignedToId,
        done: data.done,
      },
    });
    pubSub.publish('taskCreated', { taskCreated: newTask });
    return newTask;
  }

  @Query(() => TaskConnection)
  async unfinishedTasks(
    @Args() { after, before, first, last }: PaginationArgs,
    @Args({ name: 'query', type: () => String, nullable: true })
    query: string,
    @Args({
      name: 'orderBy',
      type: () => TaskOrder,
      nullable: true,
    })
    orderBy: TaskOrder
  ) {
    const a = await findManyCursorConnection(
      (args) =>
        this.prismaService.task.findMany({
          include: { assignedTo: true, createdBy: true },
          where: {
            done: false,
            name: { contains: query || '' },
          },
          orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : undefined,
          ...args,
        }),
      () =>
        this.prismaService.task.count({
          where: {
            done: false,
            name: { contains: query || '' },
          },
        }),
      { first, last, before, after }
    );
    return a;
  }

  @Query(() => [Task])
  userTasks(@Args() id: UserIdArgs) {
    return this.prismaService.task.findMany({
      where: {
        done: false,
        assignedTo: { id: id.userId },
      },
    });
  }

  @Query(() => Task)
  async post(@Args() id: TaskIdArgs) {
    return this.prismaService.task.findUnique({ where: { id: id.taskId } });
  }

  @Mutation(() => Task)
  async updateTask(
    @Args('id') id: string,
    @Args('data') data: CreateTaskInput
  ) {
    return this.prismaService.task.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        createdById: data.createdById,
        assignedToId: data.assignedToId,
        done: data.done,
      },
    });
  }

  @Mutation(() => Task)
  async deleteTask(@Args('id') id: string) {
    return this.prismaService.task.delete({ where: { id } });
  }

  @Mutation(() => Task)
  async markTaskAsDone(@Args('id') id: string) {
    return this.prismaService.task.update({
      where: { id },
      data: {
        done: true,
      },
    });
  }

  @Mutation(() => Task)
  async markTaskAsUndone(@Args('id') id: string) {
    return this.prismaService.task.update({
      where: { id },
      data: {
        done: false,
      },
    });
  }

  @ResolveField('assignedTo', () => User)
  async assignedTo(@Parent() task: Task) {
    return this.prismaService.task
      .findUnique({ where: { id: task.id } })
      .assignedTo();
  }

  @ResolveField('createdBy', () => User)
  async createdBy(@Parent() task: Task) {
    return this.prismaService.task
      .findUnique({ where: { id: task.id } })
      .createdBy();
  }
}
