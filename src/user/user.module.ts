import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/db/db.module';
import { UserController } from './user.controller';
import { UserServiceDB } from './user-db.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserServiceDB],
})
export class UserModule {}
