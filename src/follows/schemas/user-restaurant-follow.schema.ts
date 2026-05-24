import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class UserRestaurantFollow extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Restaurant',
    required: true,
    index: true,
  })
  restaurantId!: Types.ObjectId;
}

export const UserRestaurantFollowSchema =
  SchemaFactory.createForClass(UserRestaurantFollow);

UserRestaurantFollowSchema.index(
  { userId: 1, restaurantId: 1 },
  { unique: true },
);
