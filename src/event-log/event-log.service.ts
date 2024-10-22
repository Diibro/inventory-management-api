import { Injectable } from '@nestjs/common';
import { CreateEventLogDto } from './dto/create-event-log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EventLog } from './entities/event-log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EventLogService {

  constructor(
    @InjectRepository(EventLog)
    private readonly eventLogRepo: Repository<EventLog>
  ){}
  async create(createEventLogDto: CreateEventLogDto) {
    const eventLog = this.eventLogRepo.create(createEventLogDto);
    return await this.eventLogRepo.save(eventLog);
  }

  async findAll() {
    return await this.eventLogRepo.find();
  }

  async findByProduct(productId: string) {
    return await this.eventLogRepo.find({where: {productId}});
  }
}
