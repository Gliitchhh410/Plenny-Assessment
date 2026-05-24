import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  ParseFloatPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDTO } from './dto/create-restaurant.dto';

@Controller('restaurants')
@ApiTags('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new restaurant' })
  create(@Body() createRestaurantDto: CreateRestaurantDTO) {
    return this.restaurantsService.create(createRestaurantDto);
  }

  @Get()
  @ApiOperation({ summary: 'List restaurants with optional cuisine filtering' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Default is 1',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Default is 10',
  })
  @ApiQuery({
    name: 'cuisine',
    required: false,
    type: String,
    description: 'Filter by cuisine type',
  })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('cuisine') cuisine?: string,
  ) {
    return this.restaurantsService.findAll(page, limit, cuisine);
  }
  @Get('nearby')
  @ApiOperation({ summary: 'Find restaurants within a 1KM radius' })
  @ApiQuery({
    name: 'lng',
    required: true,
    type: Number,
    description: 'Longitude',
  })
  @ApiQuery({
    name: 'lat',
    required: true,
    type: Number,
    description: 'Latitude',
  })
  findNearby(
    @Query('lng', ParseFloatPipe) lng: number,
    @Query('lat', ParseFloatPipe) lat: number,
  ) {
    return this.restaurantsService.findNearby(lng, lat);
  }

  @Get(':id')
  @ApiOperation({ summary: 'find a restaurant by id or slug' })
  @ApiParam({
    name: 'id',
    description: 'Valid MongoDB ObjectId or slug string',
  })
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(id);
  }
}
