const { Op } = require("sequelize");
const groupModel=require('../models/group');
const userGroupModel=require('../models/userGroup');
const userModel=require('../models/user');

exports.addgroup=async(req,res,next)=>{
    try{
        const userId=req.user.id;
        const groupName=req.body.groupName;
        const data=await groupModel.create({name:groupName,createdBy:userId});
        const usergroup=await userGroupModel.create({userId:userId,groupId:data.id});
        res.status(201).json({groupData:data,success:true});
    }
    catch(err){ 
        res.status(500).json({error:err,success:false});
    }
}

exports.getgroup=async(req,res,next)=>{
    try{
        const uId=req.user.id;
        const userGroup=await userGroupModel.findAll({where:{userId:uId}});
        let groups=[];
        if(userGroup.length>0)
        {
            for(let i=0;i<userGroup.length;i++)
            {
                groups.push(userGroup[i].groupId);
            }   
        }
        const data=await groupModel.findAll({where:{id:{[Op.in]:groups}}});
        // console.log(data);
        res.status(201).json({groupData:data,success:true});
    }
    catch(err){ 
        res.status(500).json({error:err,success:false});
    }
}

exports.adduser=async(req,res,next)=>{
    try{
        const phoneNo=req.query.phoneNo;
        const gId=req.query.groupId;
        const user=await userModel.findOne({where:{phoneNo:phoneNo}});
        const userGroup=await userGroupModel.create({userId:user.id,groupId:gId});
        res.status(201).json({success:true});
    }
    catch(err){ 
        res.status(500).json({error:err,success:false});
    }
}

exports.getmembers=async(req,res,next)=>{
    try{
        const gId=req.params.groupId;
        const userGroup=await userGroupModel.findAll({where:{groupId:gId}});
        // console.log(userGroup.length);
        let members=[];
        if(userGroup.length>0)
        {
            for(let i=0;i<userGroup.length;i++)
            {
                members.push(userGroup[i].userId);
            }   
        }
        // console.log(members);
        const users=await userModel.findAll({where:{id:{[Op.in]:members}}});
        res.status(201).json({members:users,success:true});
    }
    catch(err){ 
        res.status(500).json({error:err,success:false});
    }
}