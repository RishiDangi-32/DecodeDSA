import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, 'backend/.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

const mongoUri = process.env.MONGO_URI || 'mongodb+srv://dangirishi32_db_user:Rishi568@cluster0.6wx9sln.mongodb.net/DSAverse?retryWrites=true&w=majority';

console.log('Testing connection to:', mongoUri.replace(/:([^@]+)@/, ':****@')); // Hides password in output

mongoose.connect(mongoUri)
  .then((conn) => {
    console.log('\x1b[32m%s\x1b[0m', '✔ SUCCESS: MongoDB is connected successfully!');
    console.log('Host connected:', conn.connection.host);
    process.exit(0);
  })
  .catch((err) => {
    console.error('\x1b[31m%s\x1b[0m', '✖ ERROR: Connection failed!');
    console.error(err);
    process.exit(1);
  });
