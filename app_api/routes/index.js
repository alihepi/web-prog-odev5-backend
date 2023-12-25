var dbURL = "mongodb+srv://ali:mekan32bul@mekanbul.slhd4ok.mongodb.net/?retryWrites=true&w=majority";
var localURL = "";

var express = require("express");
var router = express.Router();

var ctrlVenues = require("../controllers/VenueController");
var crtlComments = require("../controllers/CommentController");
const { route } = require("../../routes");

router
.route("/venues")
.get(ctrlVenues.listVenues)
.post(ctrlVenues.addVenue);

router
.route("/venues/:venuesid")
.get(ctrlVenues.getVenue)
.put(ctrlVenues.updateVenue)
.delete(ctrlVenues.deleteVenue);

router
.route("/venue/:venueid/comments")
.post(crtlComments.addComment);

router
.route("/venue/:venueid/comments/:commentid")
.get(crtlComments.getComment)
.put(crtlComments.updateComment)
.delete(crtlComments.deleteCommet);

module.exports = router;