const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'], credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/trainer', require('./routes/trainerRoutes'));
app.use('/api/member', require('./routes/memberRoutes'));
app.use('/api/workouts', require('./routes/workoutRoutes'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server Error', error: err.message });
});

const startServer = async () => {
    await connectDB();

    // Auto-seed data on startup
    const User = require('./models/User');
    const Workout = require('./models/Workout');
    const count = await User.countDocuments();

    if (count === 0) {
        console.log('Seeding initial data...');

        const admin = await User.create({ name: 'Admin User', email: 'admin@gym.com', password: 'admin123', role: 'admin', phone: '9876543210' });
        const trainer1 = await User.create({ name: 'Arjun Reddy', email: 'arjun@gym.com', password: 'trainer123', role: 'trainer', phone: '9876543211' });
        const trainer2 = await User.create({ name: 'Priya Sharma', email: 'priya@gym.com', password: 'trainer123', role: 'trainer', phone: '9876543212' });

        const expiry = new Date(); expiry.setMonth(expiry.getMonth() + 3);
        await User.create({ name: 'Rahul Member', email: 'rahul@gym.com', password: 'member123', role: 'member', assignedTrainer: trainer1._id, membershipPlan: 'pro', membershipExpiry: expiry });
        await User.create({ name: 'Sneha Member', email: 'sneha@gym.com', password: 'member123', role: 'member', assignedTrainer: trainer2._id, membershipPlan: 'elite', membershipExpiry: expiry });

        await Workout.insertMany([
            { title: 'Bench Press', description: 'Lie on a flat bench and press the bar upward.', muscleGroup: 'chest', difficulty: 'intermediate', sets: 4, reps: '8-12', restTime: '90s', gifUrl: 'https://media.giphy.com/media/om3IN2GviMwHvXuJ8a/giphy.gif', createdBy: admin._id },
            { title: 'Deadlift', description: 'Lift the bar from the ground to hip level.', muscleGroup: 'back', difficulty: 'advanced', sets: 4, reps: '5-8', restTime: '120s', createdBy: admin._id },
            { title: 'Squats', description: 'Stand with barbell on shoulders, squat down and up.', muscleGroup: 'legs', difficulty: 'intermediate', sets: 4, reps: '10-12', restTime: '90s', createdBy: admin._id },
            { title: 'Shoulder Press', description: 'Press dumbbells overhead.', muscleGroup: 'shoulders', difficulty: 'beginner', sets: 3, reps: '10-15', restTime: '60s', createdBy: admin._id },
            { title: 'Bicep Curls', description: 'Curl dumbbells with controlled motion.', muscleGroup: 'arms', difficulty: 'beginner', sets: 3, reps: '12-15', restTime: '45s', createdBy: admin._id },
            { title: 'Plank', description: 'Hold a forearm plank position.', muscleGroup: 'core', difficulty: 'beginner', sets: 3, reps: '30-60s', restTime: '30s', createdBy: admin._id },
            { title: 'Burpees', description: 'Full body squat, plank, jump combo.', muscleGroup: 'full-body', difficulty: 'advanced', sets: 4, reps: '15-20', restTime: '60s', createdBy: admin._id },
            { title: 'Running', description: 'Steady state or interval running.', muscleGroup: 'cardio', difficulty: 'beginner', sets: 1, reps: '20-30 min', restTime: 'N/A', createdBy: admin._id },
        ]);

        console.log('Seed data ready!');
        console.log('  Admin:   admin@gym.com / admin123');
        console.log('  Trainer: arjun@gym.com / trainer123');
        console.log('  Member:  rahul@gym.com / member123');
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`\nServer running on port ${PORT}`));
};

startServer();
