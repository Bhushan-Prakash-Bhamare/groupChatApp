const messageModel=require('../models/message');
const { Op } = require("sequelize");

function isstringinvalid(string){
    if(string==undefined||string.length==0){
        return true;
    } 
    return false;
}

exports.addMsg=async(req, res, next)=>{
    try{ 
        const messageInput=req.body.messageData;
        if(isstringinvalid(messageInput))
        {
            return res.status(400).json({err:'Bad parameters.something is missing'});
        }
        const data= await messageModel.create({message:messageInput,userId:req.user.id});
        res.status(201).json({messageData:data,success:true,});
    }
    catch(err){ 
        console.log(err); 
        res.status(500).json({error:err,success:false});
    }
    
}

exports.getMsgs=async(req, res, next)=>{
    try{ 
        const lastMsgId=req.query.lastMsgID;
        console.log(lastMsgId);
        const data= await messageModel.findAll({where: {id:{[Op.gt]: lastMsgId }}});
        res.status(201).json({messageData:data,success:true,});
    }
    catch(err){ 
        console.log(err); 
        res.status(500).json({error:err,success:false});
    }
    
}