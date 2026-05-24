import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import { CreateRestaurantDTO } from './dto/create-restaurant.dto';
@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<Restaurant>,
  ) {}

  async create(createDto: CreateRestaurantDTO) {
    try {
      const restaurantData = {
        ...createDto,
        location: {
          type: 'Point',
          coordinates: createDto.coordinates,
        },
      };

      const restaurant = new this.restaurantModel(restaurantData);
      return await restaurant.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException(
          'A restaurant with this slug already exists.',
        );
      }
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10, cuisine?: string) {
    const skip = (page - 1) * limit;
    const filter: Record<string, string> = {};

    if (cuisine) {
      filter.cuisines = cuisine;
    }

    const [data, total] = await Promise.all([
      this.restaurantModel.find(filter).skip(skip).limit(limit).exec(),
      this.restaurantModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(idOrSlug: string) {
    const isId = isValidObjectId(idOrSlug);
    const filter = isId ? { _id: idOrSlug } : { slug: idOrSlug };
    const restaurant = await this.restaurantModel.findOne(filter).exec();
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    return restaurant;
  }

  async findNearby(lng: number, lat: number) {
    return this.restaurantModel
      .find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
            $maxDistance: 1000,
          },
        },
      })
      .exec();
  }
}
