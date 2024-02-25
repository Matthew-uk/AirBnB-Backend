const Dome = require("./../models/Dome");
const Booking = require("./../models/Booking");
exports.createdome = async (req, res, next) => {
	const {
		owner,
		electrical_utility,
		furniture,
		bedroom,
		bathroom,
		kitchen,
		state,
		city,
		address,
		base_price_by_night,
		description,
		tags,
	} = req.body;
	try {
		const dome = await Dome.create({
			owner,
			amenities: {
				electrical_utility,
				furniture,
				bedroom,
				bathroom,
				kitchen,
			},
			state,
			city,
			address,
			base_price_by_night,
			description,
			tags,
		});
		return res.status(201).json({
			status: "success",
			message: "New Dome Created",
			dome,
		});
	} catch (error) {
		return res.status(500).json({
			status: "error",
			message: "An error occured",
			error: error.message,
		});
	}
};
exports.getdome = async (req, res, next) => {
	const { owner } = req.body;
	try {
		if (!owner) {
			const dome = await Dome.find();
			return res.status(200).json({
				status: "success",
				message: "All domes fetched",
				dome,
			});
		} else {
			// I get an error from this place
			const dome = await Dome.find({ owner });
			return res.status(200).json({
				status: "success",
				message: `All domes fetched from owner: ${owner}`,
				dome,
			});
		}
	} catch (error) {
		return res.status(500).json({
			status: "error",
			message: "An error occured while fetching domes",
			error: `Confirm if the id is valid, ${error.message}`,
		});
	}
};

exports.book = async (req, res, next) => {
	const { user_id, dome_id, check_in, check_out } = req.body;
	try {
		const dome = await Dome.findById(dome_id);
		if (!dome)
			return res.status(400).json({
				status: "failed",
				message: "Couldn't find dome",
			});
		const old_booking = await Booking.findOne({
			dome_id,
			$or: [{ check_in: { $gte: check_in, $lte: check_out } }],
		});
		if (old_booking)
			return res.status(400).json({
				error: "Failed",
				message: "This period is already booked.",
			});
		new_booking = await Booking.create({
			user_id,
			dome_id,
			check_in,
			check_out,
		});
		return res.status(201).json({
			status: "success",
			message: `The Dome has been booked between ${check_in} to ${check_out}`,
			dome,
			booking: new_booking,
		});
	} catch (error) {
		return res.status(500).json({
			status: "error",
			message: "An error occured",
			error,
		});
	}
};

exports.schedule = async (req, res, next) => {
	try {
		const allBookings = await Booking.find();
		return res.status(200).json({
			status: "success",
			message: "All Booked Domes Fetched",
			booking: allBookings,
		});
	} catch (error) {
		return res.status(500).json({
			status: "error",
			message: "An error occured",
			error,
		});
	}
};
