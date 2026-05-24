import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: [String], default: [] })
  favouriteCuisines!: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
