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
  Response,
  Query,
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

  @Get('/find/:id')
  findOne(@Param('id') id: number) {
    return this.productService.findOne(id);
  }

  @Post('/update/:id')
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
  update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto, @UploadedFile() image) {
    console.log(updateProductDto, "Image:",image)
    console.log('Post Controller #######',image);
    if(image == undefined ){
      return this.productService.update(id,{
        updateProductDto });
    }
    return this.productService.update(id,{
      updateProductDto }, image.filename);
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: number) {
    return this.productService.remove(id);
  }

  @Get('/image/:image')
  postImage(@Param('image') image: string, @Response() res) {
    return of(res.sendFile(join(process.cwd(), 'uploads', image)));
  }

  @Get('paginate')
  async postPaginate(@Query('skip') skip: string, @Query('take') take: string,  @Query('search') search: string) {
    return await this.productService.postPaginate(
      {
        skip: Number(skip), 
        take: Number(take),
        search: String(search)
      });
  }
}
