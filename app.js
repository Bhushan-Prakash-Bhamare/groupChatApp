const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const sequelize=require('./util/database');
const helmet=require('helmet');
const morgan=require('morgan');
const fs=require('fs');

const userRoute=require('./routes/user');
const messageRoute=require('./routes/message');
const groupRoute=require('./routes/group');

const User=require('./models/user');
const Message=require('./models/message');
const Group=require('./models/group');
const UserGroup=require('./models/userGroup');

const app = express();

const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});

app.use(helmet({contentSecurityPolicy: false}));  
app.use(morgan('combined',{stream:accessLogStream}));
 
app.use(cors(
    {
        origin:"http://127.0.0.1:5500"
    }
));

app.use(bodyParser.json());


app.use('/user',userRoute);
app.use('/message',messageRoute);
app.use('/group',groupRoute);

app.use((req,res)=>{
    res.sendFile(path.join(__dirname,`public/${req.url}`));
  });

User.hasMany(Message);
Message.belongsTo(User);

Group.hasMany(Message);
Message.belongsTo(Group);

User.belongsToMany(Group,{through:UserGroup});
Group.belongsToMany(User,{through:UserGroup});


sequelize
        .sync()
    // .sync({force:true})
    .then(()=>app.listen(3100))
    .catch(err=>console.log(err));  