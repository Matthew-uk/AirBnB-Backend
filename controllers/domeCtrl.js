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
