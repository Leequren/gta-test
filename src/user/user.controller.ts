import { Body, Controller, Get, Param, Post, Put, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { UserServiceDB } from './user-db.service';
import { ZodValidationPipe } from 'src/zod/zod.pipe';
import {
  takeoffBalanceBodySchema,
  topupBalanceBodySchema,
  transferBodySchema,
  TtakeoffBalanceBodySchema,
  TtopupBalanceBodySchema,
  TtransferBodySchema,
  TUserIdZod,
  userIdSchema,
} from './user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userDbService: UserServiceDB) {}

  @Put('create')
  async createUserHandler(@Res() reply: FastifyReply) {
    const newUser = await this.userDbService.createUser();
    return reply.send(newUser);
  }

  @Get(':id')
  async getUserInfoHandler(
    @Param('id', new ZodValidationPipe(userIdSchema)) id: TUserIdZod,
    @Res() reply: FastifyReply,
  ) {
    const user = await this.userDbService.getUserInfoById(id);
    return reply.send(user);
  }

  @Get(':id/checkBalance')
  async getBalanceUserHandler(
    @Param('id', new ZodValidationPipe(userIdSchema)) id: TUserIdZod,
    @Res() reply: FastifyReply,
  ) {
    const balance = await this.userDbService.getUserBalance(id);
    return reply.send(balance);
  }

  @Post(':id/topup')
  async topupUserBalanceHandler(
    @Param('id', new ZodValidationPipe(userIdSchema)) id: TUserIdZod,
    @Res() reply: FastifyReply,
    @Body(new ZodValidationPipe(topupBalanceBodySchema))
    body: TtopupBalanceBodySchema,
  ) {
    const user = await this.userDbService.topupBalance(id, body.amount);
    console.log(user);
    return reply.send(user);
  }

  @Post(':id/takeoff')
  async takeoffUserBalanceHandler(
    @Param('id', new ZodValidationPipe(userIdSchema)) id: TUserIdZod,
    @Res() reply: FastifyReply,
    @Body(new ZodValidationPipe(takeoffBalanceBodySchema))
    body: TtakeoffBalanceBodySchema,
  ) {
    const user = await this.userDbService.takeoffBalance(id, body.amount);
    console.log(user);
    return reply.send(user);
  }

  @Post(':id/transfer')
  async transferUserBalanceHandler(
    @Param('id', new ZodValidationPipe(userIdSchema)) id: TUserIdZod,
    @Res() reply: FastifyReply,
    @Body(new ZodValidationPipe(transferBodySchema))
    body: TtransferBodySchema,
  ) {
    const transferStatus = await this.userDbService.transferMoney(
      id,
      body.targetId,
      body.amount,
    );
    return reply.send({ message: transferStatus });
  }
}
