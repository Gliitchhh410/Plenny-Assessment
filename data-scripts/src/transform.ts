import { connectDB, disconnectDB } from './db'
import { Brand } from './schemas/brand.schema'

const fixName = (doc): string => {
    if (doc.brandName && typeof doc.brandName === 'string') return doc.brandName;
    if (doc.brand && typeof doc.brand === 'object' && doc.brand.name) return doc.brand.name;
    if (doc.name && typeof doc.name === 'string') return doc.name;
    return 'Unknown Brand';
}

const fixYear = (doc): number => {
    const rawYear = doc.yearFounded ?? doc.yearCreated ?? doc.yearsFounded;
    const fixedYear = parseInt(rawYear, 10);
    if (!isNaN(fixedYear) && fixedYear >= 1600 && fixedYear <= new Date().getFullYear()) {
        return fixedYear;
    }
    return 1600; // as a fallback
}

const fixLocations = (doc): number => {
    const rawLocations = doc.numberofLocations;
    const fixedLocations = parseInt(rawLocations, 10);
    if (!isNaN(fixedLocations) && fixedLocations >= 1) {
        return fixedLocations;
    }
    return 1; // as a fallback
}


const run = async () => {
    await connectDB()
    console.log('Starting transformation')


    const dirtyBrands = await Brand.find({}).lean();
    let successCount = 0;

    for (const dirtyBrand of dirtyBrands) {
        try {
            const cleanData = {
                name: fixName(dirtyBrand),
                yearFounded: fixYear(dirtyBrand),
                numberOfLocations: fixLocations(dirtyBrand)
            }

            const validationDoc = new Brand(cleanData)
            const validationError = validationDoc.validateSync();

            if (validationError) {
                console.error(`Validation failed for ID ${String(dirtyBrand._id)}:`, validationError.message);
                continue;
            }

            await Brand.replaceOne({ _id: dirtyBrand._id }, cleanData);
            console.log(`Successfully transformed brand: ${cleanData.name}`);
            successCount++;
        }
        catch (error: any) {
            console.error(`Error processing brand ID: ${String(dirtyBrand._id)}`, error);
        }
    }
    console.log(`Transformation complete. Successfully cleaned ${successCount} documents.`);
    await disconnectDB();
}

run().catch(console.error);