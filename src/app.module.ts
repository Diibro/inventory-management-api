import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { EventLogModule } from './event-log/event-log.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (ConfigService:ConfigService) => ({
        type: 'postgres',
        host: ConfigService.get('DB_HOST'),
        port: +ConfigService.get('DB_PORT'),
        // username: ConfigService.get('DB_USERNAME'),
        username: "postgres",
        password: ConfigService.get('DB_PASSWORD'),
        database: ConfigService.get('DB_NAME'),
        entities: [join(process.cwd(), "dist/**/*.entity.js")],
        synchronize: true
      })
    }),
    ProductModule,
    EventLogModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
