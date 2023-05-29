'use strict';

// [START gae_node_request_example]
const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const userController = require('./user_controller');
const actionController = require('./action_controller');
require('dotenv').config()

const adminPassword = process.env.ADMIN_PASSWORD;
const jwtSecret = process.env.JWT_SECRET;
app.use(cors());
app.use(bodyParser.json());
// app.get('/', (req, res) => {
//   res.status(200).send('Hello, world!').end();
// });
app.get('/kids', async (req, res) => {
  userController.getKids().then(data => res.json(data));
});
app.get('/users', async (req, res) => {
  userController.getUsers().then(data => res.json(data));
});
app.use('/login', async(req, res) => {
  const { mobileNumber, password } = req.body;
  const token = jwt.sign({mobileNumber}, jwtSecret);
  let user = await userController.getUser(mobileNumber, password);
  if(user){
    res.send({
        token: token,
        user: user
      });
  }else{
    res.status(400).send('Invalid mobile number or password');
  }
});
app.use('/register', async(req, res) => {
  const {name, mobileNumber, password } = req.body;
  console.log(req.body);
  if (!(mobileNumber && password && name)) {
    res.status(400).send("All input is required");
  }

  if ( await userController.findUser(mobileNumber)) {
    return res.status(409).send("User Already Exist. Please Login");
  }

  const token = jwt.sign({name}, jwtSecret);
  
  if(req.body.adminPassword == adminPassword){
    let user = await userController.addUser({name: name, mobile_number: mobileNumber, password: password, user_role:"admin"});
  if(user){
    res.status(201).send({
        token: token,
        user: user
      });
  }else{
    res.status(500).send('cannot create user');
  }
  
  }
  else{
    let user = await userController.addUser({name: name, mobile_number: mobileNumber, password: password, user_role:"kid"});
    if(user){
      res.status(201).send({
          token: token,
          user: user
        });
    }else{
      res.status(500).send('cannot create user');
    }
  }
});

app.post('/actions', async (req, res) => {
  console.log(req.body);
    const user_id = req.body.user_id;
    let actions = await actionController.getActionsByUserId(user_id);
    if(actions){
      res.status(200).send(actions);
    }else{
      res.status(400).send('Cannot get actions');
    }
});
app.post('/action', async(req, res) => {
  const {user_id, action_type, points } = req.body;
  if (!(user_id && action_type && points)) {
    res.status(400).send("All input is required");
  }
  console.log("app.js", user_id, action_type, points );
  let action = await actionController.addAction({user_id: user_id, action_type: action_type,  points: points});
  if(action){
    res.status(201).send(action);
  }else{
    res.status(500).send('cannot create user');
  }
});
// app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
    res.json('Hello, world New!');
});
// Start the server
const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});


module.exports = app;