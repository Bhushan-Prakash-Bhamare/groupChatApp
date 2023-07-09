const userModel=require('../models/user');
const bcrypt=require('bcrypt');

function isstringinvalid(string){
    if(string==undefined||string.length==0){
        return true;
    }
    return false;
}

exports.signup=async(req,res,next)=>{
    try{
        const name=req.body.name;
        const email=req.body.email;
        const phoneNo=req.body.phoneNo;
        const password=req.body.password;
        if(isstringinvalid(name)||isstringinvalid(email)||isstringinvalid(phoneNo)||isstringinvalid(password))
        {
            return res.status(400).json({err:'Bad parameters.something is missing'});
        }
        const allData= await userModel.findAll();
        allData.forEach(element => {
           if(element.email===email) 
           {
                throw new Error('User already exists');
           }
        });
        const saltrounds=10;
        bcrypt.hash(password,saltrounds,async(err,hash)=>{
            if(err){
                console.log(err);
                throw new Error(err);    
            }
            await userModel.create({name:name,email:email,phoneNo:phoneNo,password:hash});
            res.status(201).json({message:'new user created successfully'});
        })
        
    }
    catch(err){
        res.status(500).json({err});
    }
}