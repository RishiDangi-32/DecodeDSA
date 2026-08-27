const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const dns = require('dns');

// Overrides local/ISP DNS with Google's public DNS servers to resolve Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  console.log('DNS servers successfully set to Google & Cloudflare public DNS.');
} catch (e) {
  console.warn('Unable to override DNS servers programmatically, using system defaults.');
}

// Load environment variables
dotenv.config();

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
