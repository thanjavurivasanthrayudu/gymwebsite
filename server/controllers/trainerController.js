const User = require('../models/User');
const WorkoutPlan = require('../models/WorkoutPlan');
const DietPlan = require('../models/DietPlan');

exports.getAssignedMembers = async (req, res) => {
    try {
        const members = await User.find({ assignedTrainer: req.user._id, role: 'member' }).select('-password');
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.assignWorkoutPlan = async (req, res) => {
    try {
        const { title, memberId, workouts, notes } = req.body;
        await WorkoutPlan.updateMany({ assignedTo: memberId, isActive: true }, { isActive: false });
        const plan = await WorkoutPlan.create({ title, assignedTo: memberId, assignedBy: req.user._id, workouts, notes });
        res.status(201).json(plan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.assignDietPlan = async (req, res) => {
    try {
        const { title, memberId, meals, totalCalories, notes } = req.body;
        await DietPlan.updateMany({ assignedTo: memberId, isActive: true }, { isActive: false });
        const plan = await DietPlan.create({ title, assignedTo: memberId, assignedBy: req.user._id, meals, totalCalories, notes });
        res.status(201).json(plan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMemberWorkoutPlan = async (req, res) => {
    try {
        const plan = await WorkoutPlan.findOne({ assignedTo: req.params.memberId, isActive: true }).populate('workouts.workout').populate('assignedBy', 'name');
        res.json(plan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMemberDietPlan = async (req, res) => {
    try {
        const plan = await DietPlan.findOne({ assignedTo: req.params.memberId, isActive: true }).populate('assignedBy', 'name');
        res.json(plan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateMemberProgress = async (req, res) => {
    try {
        const { notes } = req.body;
        const plan = await WorkoutPlan.findOne({ assignedTo: req.params.memberId, isActive: true });
        if (!plan) return res.status(404).json({ message: 'No active plan found' });
        plan.notes = notes;
        await plan.save();
        res.json({ message: 'Progress updated', plan });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
