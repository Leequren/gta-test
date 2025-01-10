import { Global, Module } from '@nestjs/common';
import { Pool } from 'pg';
import { databaseUrl } from 'src/config/env';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: 'DB',
      useFactory: async () => {
        const pool = new Pool({
          connectionString: databaseUrl,
        });
        return pool;
      },
      inject: [],
    },
  ],
  exports: ['DB'],
})
export class DatabaseModule {}
