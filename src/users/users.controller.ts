import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Post(':userId/follow/:restaurantId')
  @ApiOperation({ summary: 'Follow a restaurant' })
  @ApiParam({ name: 'userId', description: 'MongoDB ObjectId of the user' })
  @ApiParam({
    name: 'restaurantId',
    description: 'MongoDB ObjectId of the restaurant',
  })
  followRestaurant(
    @Param('userId') userId: string,
    @Param('restaurantId') restaurantId: string,
  ) {
    return this.usersService.followRestaurant(userId, restaurantId);
  }

  @Get(':userId/recommendations')
  @ApiOperation({ summary: 'Get restaurant recommendations for a user' })
  @ApiParam({ name: 'userId', description: 'MongoDB ObjectId of the user' })
  getRecommendations(@Param('userId') userId: string) {
    return this.usersService.getRecommendations(userId);
  }
}
