const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    plan: { type: String, enum: ['basic', 'pro', 'elite'], required: true },
    duration: { type: Number, default: 1 },
    status: { type: String, enum: ['paid', 'pending', 'overdue'], default: 'paid' },
    paymentDate: { type: Date, default: Date.now },
    receiptId: { type: String, default: '' },
    notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
