'use strict';

// [START gae_node_request_example]
const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// const createTcpPool = require('./db/connect-tcp.js');
const userController = require('./user_controller');
const actionController = require('./action_controller');
require('dotenv').config()

const adminPassword ="#Summer23#"
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
  const { email, password } = req.body;
  const token = jwt.sign({email}, "secret");
  let user = await userController.getUser(email, password);
  if(user){
    res.send({
        token: token,
        user: user
      });
  }else{
    res.status(400).send('Invalid email or password');
  }
});
app.use('/register', async(req, res) => {
  const {name, email, password } = req.body;
  if (!(email && password && name)) {
    res.status(400).send("All input is required");
  }

  if ( await userController.findUser(email)) {
    return res.status(409).send("User Already Exist. Please Login");
  }

  const token = jwt.sign({email}, "secret");
  
  if(req.body.adminPassword == adminPassword){
    let user = await userController.addUser({name:req.body.name, email: req.body.email, password: req.body.password, user_role:"admin"});
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
    let user = await userController.addUser({name:req.body.name, email: req.body.email, password: req.body.password, user_role:"kid"});
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
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});
// Start the server
const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

// [END gae_node_request_example]

module.exports = app;