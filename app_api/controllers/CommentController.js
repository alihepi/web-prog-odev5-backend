var mongoose = require("mongoose");
var Venue = mongoose.model("venue");

const createResponse = function(res, status, content){
    res.status(status).json(content);
}

const addComment = async (req, res) => {

    const newComment = {
      author: req.body.author,
      rating: req.body.rating,
      text: req.body.text,
      date: req.body.date,
    };
  
    try {
      await venue.collection.insertOne(newComment);
      createResponse(res, 200, newComment);
    } catch (error) {
      createResponse(res, 404, { status: "Başarız" });
    }
  };

const getComment= async function(req,res){
    try{
        await Venue.findById(req.params.venueid)
        .select("name comments")
        .exec()
        .then(function(venue){
            var response, comment;
            if(!venue){
                createResponse(res,404,{
                    status:"venue:id bulunamadı",
                });
                return;
            } else if(venue.comments && venue.comments.length > 0){
                comment=venue.comments.id(req.params.commentid);
                if(!comment){
                    createResponse(res,404,{
                        status:"commment:id bulunamadı",
                    });
                }else {
                    response={
                        venue:{
                            name:venue.name,
                            id:req.params.venueid,
                        },
                        comment:comment,
                    };
                    createResponse(res,200,response);
                }
            }else {
                
                createResponse(res,404,{
                    status:"Hiç Yorum Yok",
                });
            }
        });
    }catch (error){
        createResponse(res,404,{
            status:"venue:id bulunamadı",
        });  
    }
};

const updateComment = function(req, res){
    createResponse(res, 200, {status: "başarılı"});
}

const deleteCommet = function(req, res){
    createResponse(res, 200, {status: "başarılı"});
}

module.exports = {
    addComment,
    getComment,
    updateComment,
    deleteCommet
}