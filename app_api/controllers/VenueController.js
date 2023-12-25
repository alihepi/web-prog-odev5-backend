var mongoose=require("mongoose");
var Venue =mongoose.model("venue");

var converter=(function(){
    var earthRadius=6371; //km
    var radian2Kilometer =function (radian){
        return parseFloat(radian * earthRadius);
    };
    var kilometre2Radian=function(distance){
        return parseFloat(distance/earthRadius);
    };
    return{
        radian2Kilometer,
        kilometre2Radian,
    };
})();

const createResponse=function(res,status,content){
    res.status(status).json(content);
}
const listVenues= async function(req,res){
    var lat =parseFloat(req.query.lat);
    var long=parseFloat(req.query.long);
    var point={
        type:"Point",
        coordinates:[lat,long],
    };
    var geoOptions={
        distanceField:"dis",
        spherical:true,
    };
    try{
        const result= await Venue.aggregate([
            {
                $geoNear:{
                    near:point,
                    ...geoOptions,
                },
            },
        ]);
        const venues=result.map((venue) => {
            return{
                distance:converter.kilometre2Radian(venue.dis),
                name:venue.name,
                address:venue.address,
                rating:venue.rating,
                foodanddrink:venue.foodanddrink,
                id:venue._id,
            };
        });
        createResponse(res,200,venues);

    }
    catch(e){
        createResponse(res,404,{
            e,
        });
    }

};
const addVenue=function(req,res){
    createResponse(res,200,{"status":"Başarılı"});
}
const getVenue= async function(req,res){
    try{
        await Venue.findById(req.params.venueid).exec()
        .then(function(venue){
            createResponse(res,200,venue);

        });

    }catch(error){
        createResponse(res,404,{status:"Böyle Bir mekan yok"});

    }
};
const updateVenue=function(req,res){
    createResponse(res,200,{"status":"Başarılı"});
}
const deleteVenue= async function(req,res){
    try{
        await Venue.findByIdAndDelete(req.params.venueid).exec()
        .then(function(venue){
            createResponse(res,200,venue)
        });

    }catch(error){
        createResponse(res,404,{status:"Böyle Bir mekan yok"});
    }
}
module.exports={
    listVenues,
    addVenue,
    updateVenue,
    deleteVenue,
    getVenue
}
