const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    muscleGroup: {
        type: String,
        required: true,
        enum: ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'full-body', 'cardio']
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['beginner', 'intermediate', 'advanced']
    },
    videoUrl: { type: String, default: '' },
    gifUrl: { type: String, default: '' },
    sets: { type: Number, default: 3 },
    reps: { type: String, default: '10-12' },
    restTime: { type: String, default: '60s' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPrebuilt: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
