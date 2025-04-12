import {
    IsNotEmpty,
    IsString,
    IsNumber,
    Min,
    MaxLength,
  } from 'class-validator';
  
  export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name!: string;
  
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    category!: string;
  
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price!: number;
  
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    stock!: number;
  
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    brand!: string;
  }
  