const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const sequelize=require('./util/database');
const app = express();

app.use(cors(
    {
        origin:"http://127.0.0.1:5500"
    }
));

const userRoute=require('./routes/user');
 
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/user',userRoute);

sequelize
        .sync()
    // .sync({force:true})
    .then(()=>app.listen(3100))
    .catch(err=>console.log(err));  