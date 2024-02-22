const User = require("../models/User")

exports.getAllUsers = async (req, res, next) => {
    const users = await User.find({})

    res.status(200).json({
        status: 'success',
        message: `Successfully retrieved all users`,
        data: {
            documents: users
        }
    })
}

