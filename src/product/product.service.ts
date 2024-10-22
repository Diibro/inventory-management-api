import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { LessThan, MoreThan, QueryFailedError, Repository } from 'typeorm';
import { EventLogService } from 'src/event-log/event-log.service';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly eventLogService: EventLogService
  ){}
  async create(createProductDto: CreateProductDto) {
    try {
      const product  = this.productRepo.create(createProductDto);
      await this.productRepo.save(product);
      await this.eventLogService.create({action: "Product Added", productId:product.id});
      return product;
    } catch (error) {
      return this.handleDbErrors(error);
    }
  }

  async findAll() {
    try {
      return await this.productRepo.find();
    } catch (error) {
      return this.handleDbErrors(error)
    }
  }

  async findPaged(limit:number, offset:number) {
    try {
      const [products, total] = await this.productRepo.findAndCount({take:limit, skip: offset});
      return {
        data: products,
        totalIProducts: total,
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.floor(total / limit) 
      }
    } catch (error) {
      return this.handleDbErrors(error)
    }
  }

  async findOne(id: string) {
    try {
      return await this.productRepo.findOne({where: {id}});
    } catch (error) {
      return this.handleDbErrors(error);
    }
  }

  async findByCategory(category:string){
    try {
      return this.productRepo.find({where: {category}});
    } catch (error) {
      return this.handleDbErrors(error);
    }
  }

  async findByQuantity(quantity: number, check:string){
    try {
      if(check === 'less') return this.productRepo.find({where: {quantity: LessThan(quantity)}});
      else if(check === 'more') return this.productRepo.find({where: {quantity: MoreThan(quantity)}});
      else return this.productRepo.find({where: {quantity}});
    } catch (error) {
      return this.handleDbErrors(error);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productRepo.findOne({where: {id}})
      if(!product) throw new NotFoundException("Listing not found");
      Object.assign(product, updateProductDto);
      await this.productRepo.save(product);
      await this.eventLogService.create({action: "Product Updated", productId:product.id});
      return product;
    } catch (error) {
      return this.handleDbErrors(error);
    }
  }

  async remove(id: string) {
    try {
      const product = await this.productRepo.findOne({where: {id}})
      if(!product) throw new NotFoundException("The product you are deleting does not exist.");
      if(product.quantity > 0) throw new BadRequestException("Cannot delete a product with quantity greater than 0");
      await this.productRepo.remove(product);
      await this.eventLogService.create({action: "Product Deleted", productId:product.id});
      return "Delete successfull";
    } catch (error) {
      return this.handleDbErrors(error);
    }
  }

  private handleDbErrors(error: any): void {
    if (error instanceof QueryFailedError) {
      const dbErrorCode = (error as any).code;
      const errorMessage = (error as any).detail || ''; 
      const constraint = (error as any).constraint;

      switch (dbErrorCode) {
        case '23505':
          throw new BadRequestException('Product with the same name already exists.');
        case '23514':
          
          if (errorMessage.includes('name')) {
            throw new BadRequestException('Product name cannot be null.');
          } else if (errorMessage.includes('category')) {
            throw new BadRequestException('Product category cannot be null.');
          }else if (constraint) {
            switch(constraint){
              case 'QUANTITY_NON_NEGATIVE_chk':
                throw new BadRequestException('Product quantity must be greater than or equal to 0.');
              case 'EMPTY_NAME_CHECK':
                throw new BadRequestException('Product name cannot be empty');
              case 'EMPTY_CATEGORY_CHECK':
                throw new BadRequestException('Product category cannot be emppty');
            }
          }else {
            throw new BadRequestException('A required field is missing.');
          }
        default:
          throw new BadRequestException('Database error occurred.');
      }
    }
    throw error;
  }
}
