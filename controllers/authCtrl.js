const User = require("../models/User")
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.signup = async (req, res, next) => {
    const newUser = await User.create(req.body)

    res.status(201).json({
        status: 'success',
        message: `You've successfully signed up`,
        data: {
            document: newUser
        }
    })
}

exports.login = async (req, res, next) => {
    const {email, password} = req.body;
    const user = await User.findOne({email}).select('+password');

    console.log(user)

    if (!user) {
        return res.status(401).json({
            status: "failed",
            message: "Invalid credentials"
        })
    }

    if (!user.pwdMatch(password, user.password)) {
        return res.status(401).json({
            status: "failed",
            message: "Invalid credentials"
        })
    }

    const token = jwt.sign({ Id: user._id }, `jwt-secret`, { expiresIn: '30d' });

    res.status(201).json({
        status: 'success',
        message: `You've successfully logged in`,
        data: {
            token
        }
    })
}

exports.forgetPwd = async (req, res, next) => {
    const {email} = req.body;

    const user = await User.findOne({email});

    if (!user) {
        return res.status(404).json({
            status: 'failed',
            message: 'No account with this email'
        })
    }

    const token = await user.generateToken()
    user.save();

    const resetUrl = `${req.protocol}://${req.get('host')}/reset/${token}`

    res.status(200).json({
        status: 'success',
        message: `A link will be sent to your email. ${resetUrl}`
    })
}

exports.resetPwd = async (req, res, next) => {
    const {password} = req.body
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({resetToken: hashedToken, resetExpires: {$gt: Date.now()}})

    if (!user) {
        return res.status(404).json({
            status: 'failed',
            message: `Invalid token`
        })
    }

    user.reset(password)
    user.save();

    res.status(200).json({
        status: "success",
        message: "Password successfully reset"
    })
}