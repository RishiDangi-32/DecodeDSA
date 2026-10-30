import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dsaverse';

async function migrate() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    const collection = mongoose.connection.collection('lessons');

    // Drop slug index if it exists
    try {
      const indexes = await collection.indexes();
      const slugIndex = indexes.find(idx => idx.name === 'slug_1' || (idx.key && idx.key.slug));
      if (slugIndex && slugIndex.name) {
        console.log(`Dropping index ${slugIndex.name}...`);
        await collection.dropIndex(slugIndex.name);
        console.log('Index dropped successfully.');
      }
    } catch (idxErr: any) {
      console.log('Index drop notice:', idxErr.message);
    }

    // Unset slug, shortDescription, featuredImage from all documents
    const result = await collection.updateMany(
      {},
      {
        $unset: {
          slug: 1,
          shortDescription: 1,
          featuredImage: 1
        }
      }
    );

    console.log(`Updated ${result.modifiedCount} lesson document(s).`);
    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

migrate();
