require('dotenv').config();
const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const sequelize=require('./util/database');
const helmet=require('helmet');
const morgan=require('morgan');
const fs=require('fs');
const socketio=require('socket.io');
const http=require('http');
const users={};

const userRoute=require('./routes/user');
const messageRoute=require('./routes/message');
const groupRoute=require('./routes/group');

const User=require('./models/user');
const Message=require('./models/message');
const Group=require('./models/group');
const UserGroup=require('./models/userGroup');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});

app.use(helmet({contentSecurityPolicy: false}));  
app.use(morgan('combined',{stream:accessLogStream}));
 
app.use(cors(
    // {
    //     origin:"http://127.0.0.1:5500"
    // }
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
    .then(()=>{
      server.listen(process.env.PORT);
      
      io.on('connection', socket => {
        socket.on('new-user', data => {
          io.emit('user-connected', data);
        })
        socket.on('send-chat-message', data => {
          socket.broadcast.emit('chat-message', data);
        })
      }) 
    })
    .catch(err=>console.log(err));  
     
    