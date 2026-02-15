const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['admin', 'trainer', 'member'], default: 'member' },
    phone: { type: String, default: '' },
    profilePic: { type: String, default: '' },
    assignedTrainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    membershipPlan: { type: String, enum: ['basic', 'pro', 'elite', ''], default: '' },
    membershipExpiry: { type: Date, default: null },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
