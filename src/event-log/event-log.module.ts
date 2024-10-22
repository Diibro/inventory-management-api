import { Module } from '@nestjs/common';
import { EventLogService } from './event-log.service';
import { EventLogController } from './event-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventLog } from './entities/event-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventLog])],
  controllers: [EventLogController],
  providers: [EventLogService],
  exports: [EventLogService]
})
export class EventLogModule {}
