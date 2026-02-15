const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Workout = require('./models/Workout');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Workout.deleteMany({});

        // Create admin
        const admin = await User.create({
            name: 'Admin User', email: 'admin@gym.com', password: 'admin123',
            role: 'admin', phone: '9876543210'
        });

        // Create trainers
        const trainer1 = await User.create({
            name: 'Arjun Reddy', email: 'arjun@gym.com', password: 'trainer123',
            role: 'trainer', phone: '9876543211'
        });
        const trainer2 = await User.create({
            name: 'Priya Sharma', email: 'priya@gym.com', password: 'trainer123',
            role: 'trainer', phone: '9876543212'
        });

        // Create members
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + 3);
        await User.create({
            name: 'Rahul Member', email: 'rahul@gym.com', password: 'member123',
            role: 'member', phone: '9876543213', assignedTrainer: trainer1._id,
            membershipPlan: 'pro', membershipExpiry: expiry
        });
        await User.create({
            name: 'Sneha Member', email: 'sneha@gym.com', password: 'member123',
            role: 'member', phone: '9876543214', assignedTrainer: trainer2._id,
            membershipPlan: 'elite', membershipExpiry: expiry
        });

        // Create workouts
        const workouts = [
            { title: 'Bench Press', description: 'Lie on a flat bench and press the bar upward.', muscleGroup: 'chest', difficulty: 'intermediate', sets: 4, reps: '8-12', restTime: '90s', gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDd5bWRrZmFhYnBqOXl2NXlrOGFyMXRyMmdlYWJ6M2RyZDYxYiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/om3IN2GviMwHvXuJ8a/giphy.gif', createdBy: admin._id },
            { title: 'Deadlift', description: 'Lift the bar from the ground to hip level.', muscleGroup: 'back', difficulty: 'advanced', sets: 4, reps: '5-8', restTime: '120s', gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGRrNnJ6bWp0anB4Y2V6cGJpODFkOTR6OHlqOWkxdGNhMnlqdiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/1qfKN8Dt0CRdCRxman/giphy.gif', createdBy: admin._id },
            { title: 'Squats', description: 'Stand with barbell on shoulders, squat down and back up.', muscleGroup: 'legs', difficulty: 'intermediate', sets: 4, reps: '10-12', restTime: '90s', gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZm92MnVyOXgzYTdxajQzd3c2c2lhOWl2OWF1MW5mYmFkMHVrdSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/1qfKN8Dt0CRdCRxman/giphy.gif', createdBy: admin._id },
            { title: 'Shoulder Press', description: 'Press dumbbells overhead while seated or standing.', muscleGroup: 'shoulders', difficulty: 'beginner', sets: 3, reps: '10-15', restTime: '60s', gifUrl: '', createdBy: admin._id },
            { title: 'Bicep Curls', description: 'Curl dumbbells with controlled motion.', muscleGroup: 'arms', difficulty: 'beginner', sets: 3, reps: '12-15', restTime: '45s', gifUrl: '', createdBy: admin._id },
            { title: 'Plank', description: 'Hold a forearm plank position for time.', muscleGroup: 'core', difficulty: 'beginner', sets: 3, reps: '30-60s', restTime: '30s', gifUrl: '', createdBy: admin._id },
            { title: 'Burpees', description: 'Full body exercise combining squat, plank, and jump.', muscleGroup: 'full-body', difficulty: 'advanced', sets: 4, reps: '15-20', restTime: '60s', gifUrl: '', createdBy: admin._id },
            { title: 'Running', description: 'Steady state or interval running on treadmill.', muscleGroup: 'cardio', difficulty: 'beginner', sets: 1, reps: '20-30 min', restTime: 'N/A', gifUrl: '', createdBy: admin._id },
        ];
        await Workout.insertMany(workouts);

        console.log('Seed data inserted!');
        console.log('Admin: admin@gym.com / admin123');
        console.log('Trainer: arjun@gym.com / trainer123');
        console.log('Member: rahul@gym.com / member123');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
