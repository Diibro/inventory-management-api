import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(@Query('limit') limit:number = 100, @Query('offset') offset: number = 0) {

    return this.productService.findPaged(limit, offset);
  }

  @Get('category')
  findByCategory(@Query('name') name:string){
    return this.productService.findByCategory(name);
  }

  @Get('quantity')
  findByQuantity(@Query('qty') qty:string, @Query('check') check:string){
    return this.productService.findByQuantity(+qty, check);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
