const Workout = require('../models/Workout');

exports.getAllWorkouts = async (req, res) => {
    try {
        const { muscleGroup, difficulty } = req.query;
        const filter = {};
        if (muscleGroup) filter.muscleGroup = muscleGroup;
        if (difficulty) filter.difficulty = difficulty;
        const workouts = await Workout.find(filter).populate('createdBy', 'name').sort({ createdAt: -1 });
        res.json(workouts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getWorkoutById = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id).populate('createdBy', 'name');
        if (!workout) return res.status(404).json({ message: 'Workout not found' });
        res.json(workout);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createWorkout = async (req, res) => {
    try {
        const workout = await Workout.create({ ...req.body, createdBy: req.user._id });
        res.status(201).json(workout);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateWorkout = async (req, res) => {
    try {
        const workout = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!workout) return res.status(404).json({ message: 'Workout not found' });
        res.json(workout);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteWorkout = async (req, res) => {
    try {
        await Workout.findByIdAndDelete(req.params.id);
        res.json({ message: 'Workout deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
