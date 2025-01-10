import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/db/db.module';

import { UserModule } from 'src/user/user.module';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
