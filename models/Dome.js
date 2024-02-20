const mongoose = require("mongoose");

const DomeSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	amenities: {
		type: [
			{
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
				number: Number,
			},
		],
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
module.exports = mongoose.Model("Dome", DomeSchema);
