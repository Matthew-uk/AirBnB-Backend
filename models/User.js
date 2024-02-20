const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
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
			message: "Please enter a valid email address",
		},
	},
	password: {
		type: String,
		select: false,
	},
	role: {
		type: String,
		default: "user",
		enum: ["user", "admin"],
	},
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	this.password = await bcrypt.hash(this.password, 10);
	next();
});

userSchema.methods.pwdMatch = async function (userPwd) {
	return await bcrypt.compare(userPwd, this.password);
};

module.exports = mongoose.model("User", userSchema);
