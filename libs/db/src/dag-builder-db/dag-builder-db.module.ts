import { Inject, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DAG_BUILDER_DB } from '../constants';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './../../../.env',
    }),
  ],
  providers: [
    {
      provide: DAG_BUILDER_DB,
      useFactory: async (configService: ConfigService) => {
        const dagBuilderConnectionSttring =
          configService.get<string>('DAG_DATABASE');
        if (!dagBuilderConnectionSttring) {
          throw new Error('DAG_DATABASE_URL is not defined');
        }
        const pool = new Pool({
          connectionString: dagBuilderConnectionSttring,
        });
        return drizzle(pool);
      },
      inject: [ConfigService],
    },
  ],
  exports: [DAG_BUILDER_DB],
})
export class DagBuilderDBModule {}
