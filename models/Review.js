const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	dome_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Dome",
		required: true,
	},
	amenities: {
		type: [String],
		required: true,
	},
	state: {
		type: String,
		required: true,
	},
	base_price_by_night: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	// Short tags used to describe a particular dome
	tags: {
		type: [String],
		required: true,
	},
	s,
});
module.exports = mongoose.Model("Review", ReviewSchema);
