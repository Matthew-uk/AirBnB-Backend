const mongoose = require("mongoose");

const DomeSchema = mongoose.Schema({
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	amenities: {
		type: {
			electrical_utility: [
				{
					type: String,
					enum: ["TV", "Refrigerator", "Iron", "Heater"],
				},
			],
			furniture: Number,
			bedroom: Number,
			bathroom: Number,
			kitchen: Number,
		},
		required: true,
	},
	state: {
		type: String,
		required: true,
	},
	city: {
		type: String,
		required: true,
	},
	address: {
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
});
module.exports = mongoose.model("Dome", DomeSchema);
