import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Information from './models/mongodb/Information.js';

dotenv.config();

async function checkDatabase() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare-wellness-portal');
    console.log('✅ MongoDB connected!');

    // Check if collection has data
    const count = await Information.countDocuments();
    console.log(`📊 Total information records in database: ${count}`);

    if (count === 0) {
      console.log('⚠️  No data found! Adding sample data...');
      
      const samples = [
        {
          category: 'covid-19',
          title: 'COVID-19 Updates',
          excerpt: 'Stay informed about the latest COVID-19 guidelines and vaccination information.',
          content: 'COVID-19 is a respiratory disease caused by the SARS-CoV-2 virus.',
          isPublished: true
        },
        {
          category: 'seasonal-flu',
          title: 'Seasonal Flu Prevention',
          excerpt: 'Learn about steps to prevent seasonal flu.',
          content: 'The flu spreads through respiratory droplets.',
          isPublished: true
        },
        {
          category: 'mental-health',
          title: 'Mental Health Awareness',
          excerpt: 'Explore resources for mental health support.',
          content: 'Mental health is as important as physical health.',
          isPublished: true
        }
      ];

      await Information.insertMany(samples);
      console.log('✅ Sample data added successfully!');
    } else {
      // Show all data
      const allData = await Information.find();
      console.log('📋 Database content:');
      console.log(JSON.stringify(allData, null, 2));
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkDatabase();
