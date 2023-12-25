var mongoose = require("mongoose");
var Venue = mongoose.model("venue");

const createResponse = function (res, status, content) {
    res.status(status).json(content);
}

var converter = (function () {
    var earthRadius = 6371;
    var radian2Kilometer = function (radian) {
        return parseFloat(radian * earthRadius);
    };
    var kilometer2Radian = function (distance) {
        return parseFloat(distance / earthRadius);
    };
    return {
        radian2Kilometer,
        kilometer2Radian,
    };
})();

const listVenues = async function (req, res) {
    try {
        var lat = parseFloat(req.query.lat);
        var long = parseFloat(req.query.long);

        if (isNaN(lat) || isNaN(long)) {
            throw new Error("Latitude and longitude are required and must be valid numbers.");
        }

        var point = {
            type: "Point",
            coordinates: [lat, long],
        };
        var geoOptions = {
            distanceField: "dis",
            spherical: true,
        };

        const result = await Venue.aggregate([
            {
                $geoNear: {
                    near: point,
                    ...geoOptions,
                },
            },
        ]);

        const venues = result.map((venue) => {
            return {
                distance: converter.kilometer2Radian(venue.dis),
                name: venue.name,
                address: venue.address,
                rating: venue.rating,
                foodanddrink: venue.foodanddrink,
                id: venue._id,
            };
        });
        createResponse(res, 200, venues);
    } catch (e) {
        createResponse(res, 400, { status: e.message });
    }
}

const addVenue = async (req, res) => {
    const newVenue = new Venue({
        name: req.body.name,
        address: req.body.address,
        rating: req.body.rating,
        foodanddrink: req.body.foodanddrink,
        coordinates: req.body.coordinates,
        hours: req.body.hours,
    });

    try {
        await newVenue.save();
        createResponse(res, 201, newVenue);
    } catch (error) {
        createResponse(res, 500, { status: "Error adding venue." });
    }
};

const getVenue = async function (req, res) {
    try {
        const venue = await Venue.findById(req.params.venueid).exec();
        createResponse(res, 200, venue);
    } catch (error) {
        createResponse(res, 404, { status: "Venue not found." });
    }
}

const updateVenue = function (req, res) {
    createResponse(res, 200, { status: "Successful" });
}

const deleteVenue = function (req, res) {
    createResponse(res, 200, { status: "Successful" });
}

module.exports = {
    listVenues,
    addVenue,
    getVenue,
    updateVenue,
    deleteVenue,
}