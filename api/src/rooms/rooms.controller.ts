import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { MakePublicRoomDto } from "./dto/make-public-room.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from "@nestjs/passport";

@Controller('rooms')
@ApiTags('room')
@UseGuards(AuthGuard('jwt'))

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

  @Get(':name/admins')
  @ApiResponse({description: 'Returns all rooms a user is admin'})
  findAdminsInRoom(@Param('name') name: string) {
    return this.roomsService.findAdminsInRoom(name);
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

  @Patch('/updateAdmins')
  @ApiResponse({description: 'Update users in room'})
  updateAdmins(@Body() updateAdminDto: UpdateAdminDto) {
    return this.roomsService.updateAdmins(updateAdminDto);
  }

  @Patch('/makePublic')
  @ApiResponse({description: 'Make a room public'})
  makePublic(@Body() makePublicRoomDto: MakePublicRoomDto) {
    return this.roomsService.makePublic(makePublicRoomDto);
  }

  @Patch('/changePassword')
  @ApiResponse({description: 'Change Password'})
  changePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.roomsService.updatePassword(updatePasswordDto);
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
