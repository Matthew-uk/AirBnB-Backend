const Dome = require("./../models/Dome");
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
			error: error,
		});
	}
};
