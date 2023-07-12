const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const sequelize=require('./util/database');
const app = express();

const userRoute=require('./routes/user');
const messageRoute=require('./routes/message');
const groupRoute=require('./routes/group');

const User=require('./models/user');
const Message=require('./models/message');
const Group=require('./models/group');
const UserGroup=require('./models/userGroup');

app.use(cors(
    {
        origin:"http://127.0.0.1:5500"
    }
));

app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/user',userRoute);
app.use('/message',messageRoute);
app.use('/group',groupRoute);

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