import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class RestaurantNameDTO {
  @ApiProperty({ example: 'The Gourmet Kitchen' })
  @IsString()
  @IsNotEmpty()
  en!: string;
  @ApiProperty({ example: 'المطبخ الراقي' })
  @IsString()
  @IsNotEmpty()
  ar!: string;
}

export class CreateRestaurantDTO {
  @ApiProperty({ type: RestaurantNameDTO })
  @ValidateNested()
  @Type(() => RestaurantNameDTO)
  name!: RestaurantNameDTO;

  @ApiProperty({ example: 'the-gourmet-kitchen' })
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @ApiProperty({ example: ['Seafood', 'Italian'], minItems: 1, maxItems: 3 })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsString({ each: true })
  cuisines!: string[];

  @ApiProperty({
    example: [31.2357, 30.0444],
    description: '[longitude, latitude]',
  })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  coordinates!: number[];
}
