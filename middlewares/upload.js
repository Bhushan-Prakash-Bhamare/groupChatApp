const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3');
require('dotenv').config();
const path = require('path');

    aws.config.update({
        secretAccessKey: process.env.AWS_SECRET_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY,
    });
    const BUCKET = process.env.AWS_BUCKET
    const s3 = new aws.S3();
    
    const upload = multer({
        storage: multerS3({
            s3: s3,
            acl: "public-read",
            bucket: BUCKET,
            key: function (req, file, cb) {
                // console.log(file);
                cb(null, `${Date.now()}${path.extname(file.originalname)}`)
            }
        })
    })
  
module.exports=upload; 
