const User = require('../models/User');
const Payment = require('../models/Payment');
const Workout = require('../models/Workout');
const WorkoutPlan = require('../models/WorkoutPlan');
const DietPlan = require('../models/DietPlan');

exports.getAnalytics = async (req, res) => {
    try {
        const totalMembers = await User.countDocuments({ role: 'member' });
        const totalTrainers = await User.countDocuments({ role: 'trainer' });
        const totalPayments = await Payment.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
        const totalWorkouts = await Workout.countDocuments();
        const recentPayments = await Payment.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email');
        const recentMembers = await User.find({ role: 'member' }).sort({ createdAt: -1 }).limit(5).select('-password');

        res.json({
            totalMembers, totalTrainers, totalWorkouts,
            totalRevenue: totalPayments[0]?.total || 0,
            recentPayments, recentMembers,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllTrainers = async (req, res) => {
    try {
        const trainers = await User.find({ role: 'trainer' }).select('-password').sort({ createdAt: -1 });
        res.json(trainers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createTrainer = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email already registered' });
        const trainer = await User.create({ name, email, password, phone, role: 'trainer' });
        res.status(201).json({ _id: trainer._id, name: trainer.name, email: trainer.email, phone: trainer.phone, role: trainer.role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTrainer = async (req, res) => {
    try {
        const trainer = await User.findById(req.params.id);
        if (!trainer || trainer.role !== 'trainer') return res.status(404).json({ message: 'Trainer not found' });
        trainer.name = req.body.name || trainer.name;
        trainer.email = req.body.email || trainer.email;
        trainer.phone = req.body.phone || trainer.phone;
        const updated = await trainer.save();
        res.json({ _id: updated._id, name: updated.name, email: updated.email, phone: updated.phone });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteTrainer = async (req, res) => {
    try {
        const trainer = await User.findById(req.params.id);
        if (!trainer || trainer.role !== 'trainer') return res.status(404).json({ message: 'Trainer not found' });
        await User.updateMany({ assignedTrainer: trainer._id }, { assignedTrainer: null });
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Trainer deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllMembers = async (req, res) => {
    try {
        const members = await User.find({ role: 'member' }).select('-password').populate('assignedTrainer', 'name email').sort({ createdAt: -1 });
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createMember = async (req, res) => {
    try {
        const { name, email, password, phone, membershipPlan, assignedTrainer } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email already registered' });

        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + 1);
        const member = await User.create({ name, email, password, phone, role: 'member', membershipPlan, assignedTrainer, membershipExpiry: expiry });
        res.status(201).json({ _id: member._id, name: member.name, email: member.email });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateMember = async (req, res) => {
    try {
        const member = await User.findById(req.params.id);
        if (!member || member.role !== 'member') return res.status(404).json({ message: 'Member not found' });
        Object.assign(member, { name: req.body.name || member.name, email: req.body.email || member.email, phone: req.body.phone || member.phone, membershipPlan: req.body.membershipPlan || member.membershipPlan, assignedTrainer: req.body.assignedTrainer || member.assignedTrainer, membershipExpiry: req.body.membershipExpiry || member.membershipExpiry });
        const updated = await member.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteMember = async (req, res) => {
    try {
        await WorkoutPlan.deleteMany({ assignedTo: req.params.id });
        await DietPlan.deleteMany({ assignedTo: req.params.id });
        await Payment.deleteMany({ user: req.params.id });
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Member deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createPayment = async (req, res) => {
    try {
        const { userId, amount, plan, duration, status, notes } = req.body;
        const payment = await Payment.create({ user: userId, amount, plan, duration, status, notes, receiptId: `REC-${Date.now()}` });

        const member = await User.findById(userId);
        if (member) {
            member.membershipPlan = plan;
            const expiry = new Date();
            expiry.setMonth(expiry.getMonth() + (duration || 1));
            member.membershipExpiry = expiry;
            await member.save();
        }
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
