import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { Room } from "./entities/room.entity";
import { threadId } from 'worker_threads';

@Injectable()
export class RoomsService {

  constructor (@InjectRepository(Room) private roomsRepository : Repository<Room>) {}

  async create(createRoomDto: CreateRoomDto) {
    return await this.roomsRepository.save(createRoomDto);
  }

  async findAll() {
    return await this.roomsRepository.find()
  }

  async findByName(name) {
      return await this.roomsRepository.findOne({where: {name: name}});
  }

  async findUsersInRoom(name) {
    const findName = name;

    return await this.roomsRepository.createQueryBuilder('rooms')
      .innerJoin('rooms.users', 'rooms_users')
      .where("rooms_users.name = :findName", {findName} )
      .getMany();
  }

  async findOne(id: number) {
    return await this.roomsRepository.findOne(id);
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  async updateRoom(updateRoomDto: UpdateRoomDto) {
    return await this.roomsRepository.save(updateRoomDto);
  }

  remove(id: number) {
    return this.roomsRepository.delete(id);
  }
}
