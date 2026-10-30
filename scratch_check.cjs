const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://dangirishi32_db_user:Rishi568@cluster0.6wx9sln.mongodb.net/DSAverse?retryWrites=true&w=majority';

async function check() {
  await mongoose.connect(MONGO_URI);
  const lessons = await mongoose.connection.collection('lessons').find({}).toArray();
  console.log(`Found ${lessons.length} lessons`);
  for (const l of lessons) {
    console.log('--- Lesson ---');
    console.log('ID:', l._id.toString());
    console.log('Title:', l.title);
    console.log('Status:', l.status);
    console.log('Type of content:', typeof l.content);
    console.log('Content preview:', JSON.stringify(l.content)?.slice(0, 300));
    console.log('simulationHtml length:', l.simulationHtml ? l.simulationHtml.length : 0);
  }
  await mongoose.disconnect();
}

check().catch(console.error);
