const messageModel=require('../models/message');

exports.uploads=async(req,res,next)=>{
    try{
        const groupId=req.query.groupId;
        const userId=req.query.userId;
        const data= await messageModel.create({message:req.file.location,userId:userId,groupId:groupId});
        console.log('Successfully uploaded ' + req.file.location + ' location!');
        res.status(201).json({messageData:data,fileData:req.file.location,success:true});
    }
    catch(err)
    {
        res.status(500).json({error:err,success:false});
    }
}