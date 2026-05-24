import { IsString, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: ['Seafood', 'Italian'] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  favouriteCuisines!: string[];
}
