import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Restaurant extends Document {
  @Prop({
    type: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    required: true,
    _id: false,
  })
  name!: { en: string; ar: string };

  @Prop({ required: true, unique: true, index: true })
  slug!: string;

  @Prop({ type: [String], default: [] })
  cuisines!: string[];

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location!: {
    type: string;
    coordinates: number[];
  };
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

RestaurantSchema.index({ location: '2dsphere' });
