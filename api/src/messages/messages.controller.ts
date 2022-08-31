import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from "@nestjs/passport";

@Controller('messages')
@ApiTags('message')
@UseGuards(AuthGuard('jwt'))

export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('create')
  @ApiResponse({description: 'Create a message'})
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Get()
  @ApiResponse({description: 'Return all messages'})
  findAll() {
    return this.messagesService.findAll();
  }

  @Get(':name/room')
  @ApiResponse({description: 'Return all messages from one room, finding it by name'})
  findByRoom(@Param('name') name: string) {
      return this.messagesService.findByRoom(name)
  }

  @Get(':id')
  @ApiResponse({description: 'Return a message finding it by name'})
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({description: 'Update a message'})
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  @ApiResponse({description: 'Delete a message'})
  remove(@Param('id') id: string) {
    return this.messagesService.remove(+id);
  }
}
