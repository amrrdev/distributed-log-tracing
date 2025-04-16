import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { LOG_INGESTION_DB } from '../constants';
import { Pool } from 'pg';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [
    {
      provide: LOG_INGESTION_DB,
      useFactory: async (configService: ConfigService) => {
        const logIngestionConnectionString = configService.get<string>(
          'LOG_INGESTION_DATABASE',
        );
        if (!logIngestionConnectionString) {
          throw new Error('LOG_DATABASE_URL is not defined');
        }
        const pool = new Pool({
          connectionString: logIngestionConnectionString,
        });
        return drizzle(pool);
      },
      inject: [ConfigService],
    },
  ],
  exports: [LOG_INGESTION_DB],
})
export class LogIngestionDBModule {}
