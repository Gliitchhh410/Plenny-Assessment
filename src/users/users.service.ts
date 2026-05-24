import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRestaurantFollow } from '../follows/schemas/user-restaurant-follow.schema';
import { Restaurant } from './schemas/restaurant.schema';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(UserRestaurantFollow.name) private readonly followModel: Model<UserRestaurantFollow>,
    @InjectModel(Restaurant.name) private readonly restaurantModel: Model<Restaurant>,
  ) {}

  async create(dto: CreateUserDto) {
    const newUser = new this.userModel(dto);
    return await newUser.save();
  }

  async followRestaurant(userId: string, restaurantId: string) {
    if (
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(restaurantId)
    ) {
      throw new BadRequestException('Invalid user or restaurant ID');
    }

    const userExists = await this.userModel.findById(userId).lean();
    if (!userExists) {
      throw new NotFoundException('User not found.');
    }

    const restaurantExists = await this.restaurantModel
      .findById(restaurantId)
      .lean();
    if (!restaurantExists) {
      throw new NotFoundException('Restaurant not found.');
    }

    try {
      const newFollow = new this.followModel({
        userId: new Types.ObjectId(userId),
        restaurantId: new Types.ObjectId(restaurantId),
      });
      await newFollow.save();
      return { message: 'Restaurant followed successfully' };
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException(
          'user is already following this restaurant!!!',
        );
      }
      throw error; // any other error
    }
  }

  async getRecommendations(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const sourceUser = await this.userModel.findById(userId).lean();
    if (!sourceUser) {
      throw new NotFoundException('User not found.');
    }

    if (
      !sourceUser.favouriteCuisines ||
      sourceUser.favouriteCuisines.length === 0
    ) {
      return { users: [], restaurants: [] };
    }

    const result = await this.userModel.aggregate([
      {
        $match: {
          _id: { $ne: new Types.ObjectId(userId) },
          favouriteCuisines: { $in: sourceUser.favouriteCuisines },
        },
      },
      {
        $lookup: {
          from: 'userrestaurantfollows',
          localField: '_id',
          foreignField: 'userId',
          as: 'follows',
        },
      },
      {
        $unwind: '$follows',
      },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'follows.restaurantId',
          foreignField: '_id',
          as: 'restaurants',
        },
      },
      {
        $unwind: '$restaurants',
      },
      {
        $group: {
          _id: null,
          users: {
            $addToSet: {
              _id: '$_id',
              name: '$name',
            },
          },
          restaurants: {
            $addToSet: '$restaurants',
          },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);
    return result.length > 0 ? result[0] : { users: [], restaurants: [] };
  }
}
