import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';


dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pleny-assessment';
if (!MONGO_URI) process.exit(1);

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log('MongoDB connected by db.ts');

    }
    catch (error: any) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
}

export const disconnectDB = async () => {
    await mongoose.disconnect();
};