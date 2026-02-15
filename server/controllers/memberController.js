const WorkoutPlan = require('../models/WorkoutPlan');
const DietPlan = require('../models/DietPlan');
const Payment = require('../models/Payment');

exports.getMyWorkoutPlan = async (req, res) => {
    try {
        const plan = await WorkoutPlan.findOne({ assignedTo: req.user._id, isActive: true }).populate('workouts.workout').populate('assignedBy', 'name');
        res.json(plan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyDietPlan = async (req, res) => {
    try {
        const plan = await DietPlan.findOne({ assignedTo: req.user._id, isActive: true }).populate('assignedBy', 'name');
        res.json(plan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
