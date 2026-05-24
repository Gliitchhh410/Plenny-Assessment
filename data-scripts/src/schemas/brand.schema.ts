import mongoose, { Schema, Document } from 'mongoose';
export interface IBrand extends Document {
    name: string;
    yearFounded: number;
    numberOfLocations: number;
}

const BrandSchema: Schema = new Schema({
    name: { type: String, required: true},
    yearFounded: {type: Number},
    numberOfLocations: {type: Number},
},{
    timestamps: true
})

export const Brand = mongoose.model<IBrand>('Brand', BrandSchema);