import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from "./entities/message.entity";
import { Repository, UpdateResult } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class MessagesService {

  constructor (@InjectRepository(Message) private messageRepository : Repository<Message>) {}

  async create(createMessageDto: CreateMessageDto) {
    return await this.messageRepository.save(createMessageDto);
  }

  async findAll() {
    return await this.messageRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
