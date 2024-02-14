const User = require("../models/User")
const jwt = require("jsonwebtoken");

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
