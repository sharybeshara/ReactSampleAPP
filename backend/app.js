'use strict';

// [START gae_node_request_example]
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// const createTcpPool = require('./db/connect-tcp.js');
const userController = require('./user_controller')
require('dotenv').config()

const adminPassword ="#Summer23#"
app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});
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
        token: token
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
   userController.addUser({name:req.body.name, email: req.body.email, password: req.body.password, user_role:"admin"})
   .then(response => {res.send({token: token});})
   .catch(error => {res.status(500).send(error);});

  }
  else{
    userController.addUser({name:req.body.name, email: req.body.email, password: req.body.password, user_role:"kid"})
    .then(response => {res.send({token: token});})
    .catch(error => {res.status(500).send(error);});
  }
});

//   app.get('/api/tasks', (req, res) => {
//     taskController.getTasks().then(data => res.json(data));
// });

// app.post('/api/task', (req, res) => {
//     console.log(req.body);
//     taskController.createTask(req.body.task).then(data => res.json(data));
// });

// app.put('/api/task', (req, res) => {
//     taskController.updateTask(req.body.task).then(data => res.json(data));
// });

// app.delete('/api/task/:id', (req, res) => {
//     taskController.deleteTask(req.params.id).then(data => res.json(data));
// });

// Start the server
const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;