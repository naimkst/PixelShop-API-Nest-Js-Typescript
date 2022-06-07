import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { of } from 'rxjs';
import { join } from 'path';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, image, cb) => {
          console.log(image, cb);
          const filename: string =
            path?.parse(image?.originalname).name.replace(/\s/g, '') + uuidv4();
          const extension: string = path?.parse(image?.originalname).ext;
          cb(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  create(@Body() createProductDto: CreateProductDto, @UploadedFile() image) {
    console.log(createProductDto, 'Image:', image);
    console.log('Post Controller #######', image);

    if (image == undefined) {
      return this.productService.create({
        createProductDto,
      });
    }else{
      return this.productService.create({
        createProductDto
      }, image.filename);
    }
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
