const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        trim: true,
        required: [true]
    },
    lastname: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: 'Please enter a valid email address'
        },
        required: true
    },
    phone: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    password: {
        type: String,
        select: false,
        required: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },
    googleId: {
        type: String,
    },
    facebookId: {
        type: String,
    },
    resetToken: {
        type: String,
    },
    resetExpires: {
        type: Date
    }
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()

    try {
        this.password = await bcrypt.hash(this.password, 10);
    } catch (err) {
        throw new mongoose.Error('Error hashing the password')
    }

    next();
})

userSchema.methods.verifyPassword = async function (userPwd) {
    return await bcrypt.compare(userPwd, this.password);
}

userSchema.methods.generateToken = async function () {
    const token = await crypto.randomBytes(32).toString('hex');

    this.resetToken = crypto.createHash('sha256').update(token).digest('hex')
    this.resetExpires = Date.now() + 15 * 60 * 1000;

    return token;
}

userSchema.methods.reset = async function (password) {
    this.password = password
    this.resetToken = undefined
    this.resetExpires = undefined
}

module.exports = mongoose.model('User', userSchema)