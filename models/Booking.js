const mongoose = require("mongoose");

const BookingSchema = mongoose.Schema({
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
	check_in: {
		type: Date,
		required: true,
	},
	check_out: {
		type: Date,
		required: true,
	},
});
module.exports = mongoose.model("Booking", BookingSchema);
