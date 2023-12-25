var mongoose = require("mongoose");
var venue = mongoose.model("venue");

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
    var lat = parseFloat(req.query.lat);
    var long = parseFloat(req.query.long);

    var point = {
        type: "Point",
        coordinates: [lat, long],
    };
    var geoOptions = {
        distanceField: "dis",
        spherical: true,
    };
    try {
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
        createResponse(res, 404, {
            status: "Enlem ve Boylam zorunlu ve sifirdan farkli olmali",
        });
    }
}

const addVenue = async (req, res) => {

    const newVenue = {
        name: req.body.name,
        address: req.body.address,
        rating: req.body.rating,
        foodanddrink: req.body.foodanddrink,
        coordinates: req.body.coordinates,
        hours: req.body.hours,
    };

    try {
        await venue.collection.insertOne(newVenue);
        createResponse(res, 200, newVenue);
    } catch (error) {
        createResponse(res, 404, { status: "Mekan Eklenmedi..." });
    }
};

const getVenue = async function (req, res) {
    try {
        await Venue.findById(req.params.venueid).exec().then(function () {
            createResponse(res, 200, venue);
        });
    } catch (error) {
        createResponse(res, 404, { status: "Boyle bir mekan yok!" });
    }
    //createResponse(res, 200, {status: "Basarili"});
}

const updateVenue = function (req, res) {
    createResponse(res, 200, { status: "Basarili" });
}

const deleteVenue = function (req, res) {
    createResponse(res, 200, { status: "Basarili" });
}

module.exports = {
    listVenues,
    addVenue,
    getVenue,
    updateVenue,
    deleteVenue,
}