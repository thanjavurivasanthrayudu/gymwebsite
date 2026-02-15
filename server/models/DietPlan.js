const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema({
    title: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    meals: [{
        name: { type: String, required: true },
        time: { type: String, required: true },
        items: [{ type: String }],
        calories: { type: Number, default: 0 },
        protein: { type: String, default: '' },
        notes: { type: String, default: '' },
    }],
    totalCalories: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('DietPlan', dietPlanSchema);
