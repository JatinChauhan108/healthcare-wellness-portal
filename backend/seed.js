import mongoose from 'mongoose';
import dotenv from 'dotenv';
import HealthTip from './models/HealthTip.js';

dotenv.config();

// Sample health tips to seed the database
const healthTips = [
  {
    title: "Stay Hydrated",
    content: "Drink at least 8 glasses of water daily. Proper hydration helps maintain body temperature, aids digestion, and keeps your skin healthy.",
    category: "general"
  },
  {
    title: "Get 7-9 Hours of Sleep",
    content: "Quality sleep is essential for physical health, mental clarity, and emotional well-being. Maintain a consistent sleep schedule for best results.",
    category: "sleep"
  },
  {
    title: "Eat a Balanced Diet",
    content: "Include plenty of fruits, vegetables, whole grains, and lean proteins in your diet. A balanced diet provides essential nutrients for optimal health.",
    category: "nutrition"
  },
  {
    title: "Exercise Regularly",
    content: "Aim for at least 30 minutes of moderate exercise most days of the week. Regular physical activity strengthens your heart, muscles, and bones.",
    category: "exercise"
  },
  {
    title: "Practice Mindfulness",
    content: "Take 10 minutes daily for meditation or deep breathing. Mindfulness reduces stress, improves focus, and enhances overall mental health.",
    category: "mental-health"
  },
  {
    title: "Walk After Meals",
    content: "A 15-minute walk after meals can improve digestion, regulate blood sugar levels, and boost your energy.",
    category: "exercise"
  },
  {
    title: "Limit Processed Foods",
    content: "Reduce consumption of processed foods high in sugar, salt, and unhealthy fats. Choose whole, natural foods whenever possible.",
    category: "nutrition"
  },
  {
    title: "Take Regular Breaks",
    content: "If you work at a desk, take a 5-minute break every hour to stretch and rest your eyes. This prevents strain and improves productivity.",
    category: "general"
  },
  {
    title: "Connect with Others",
    content: "Maintain strong social connections. Regular interaction with friends and family supports mental health and provides emotional support.",
    category: "mental-health"
  },
  {
    title: "Maintain Good Posture",
    content: "Keep your back straight and shoulders relaxed, especially when sitting. Good posture prevents back pain and improves breathing.",
    category: "general"
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare-wellness');
    console.log('MongoDB Connected');

    // Clear existing health tips
    await HealthTip.deleteMany({});
    console.log('Cleared existing health tips');

    // Insert sample health tips
    await HealthTip.insertMany(healthTips);
    console.log('Health tips seeded successfully');

    console.log('\n✅ Database seeded successfully!');
    console.log('Sample data added:');
    console.log('- 10 Health Tips');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
