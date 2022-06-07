import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Request, Response, Query} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { of } from 'rxjs';
import { join } from 'path';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, image, cb) => {
        console.log(image, cb);
        const filename: string = path?.parse(image?.originalname).name.replace(/\s/g, '') + uuidv4();
        const extension: string = path?.parse(image?.originalname).ext;
        cb(null, `${filename}${extension}`)
      }
    })
  }))
  create(@Body() createUserDto: CreateUserDto, @UploadedFile() image) {
    console.log(createUserDto, "Image:",image)
    console.log('Post Controller #######',image);

    if(image == undefined ){
      return this.userService.create({
        createUserDto,
      });
    }
    return this.userService.create({
      createUserDto,
    }, image.filename);
  }

  @Post('login')
  async signIn(@Body() createUserDto: CreateUserDto) {
    return this.userService.signIn(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
