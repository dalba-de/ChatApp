import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@Controller('rooms')
@ApiTags('room')

export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post('create')
  @ApiResponse({description: 'Create room'})
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  @ApiResponse({description: 'Return all rooms'})
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':name/name')
  @ApiResponse({description: 'Return room finding it by name'})
  findByName(@Param('name') name: string) {
    return this.roomsService.findByName(name);
  }

  @Get(':name/name/:password/password')
  @ApiResponse({description: 'Return room if authentication not fails'})
  findAuthenticatedRoom(@Param('name') name: string, @Param('password') password: string) {
    return this.roomsService.getAuthenticatedRoom(name, password);
  }

  @Get(':name/users')
  @ApiResponse({description: 'Returns all rooms a user is in'})
  findUsersInRoom(@Param('name') name: string) {
    return this.roomsService.findUsersInRoom(name);
  }

  @Get(':id')
  @ApiResponse({description: 'Return room finding it by id'})
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(+id);
  }

  @Patch('/update')
  @ApiResponse({description: 'Update users in room'})
  updateUsers(@Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.updateRoom(updateRoomDto);
  }

  @Patch(':id')
  @ApiResponse({description: 'Update Room'})
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  @ApiResponse({description: 'Delete a room'})
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }
}
