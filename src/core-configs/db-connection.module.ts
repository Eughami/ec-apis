import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbConnectionService } from './db-connection.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: false }),
    TypeOrmModule.forRootAsync({
      useClass: DbConnectionService,
    }),
  ],
  controllers: [],
  providers: [],
})
export class DbConnectionModule {}
