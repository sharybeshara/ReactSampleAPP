'use strict';

// [START gae_node_request_example]
const express = require('express');
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
app.use('/login', (req, res) => {
  res.send({
    token: 'test123'
  });
});
app.use('/register', (req, res) => {
  console.log(req.body);
  if(req.body.adminPassword == adminPassword){
    console.log("admin");
    userController.addUser({name:req.body.name, email: req.body.email, password: req.body.password, user_role:"admin"});

  }
  else{
    console.log("amshdmin");
    userController.addUser({name:req.body.name, email: req.body.email, password: req.body.password, user_role:"kid"});
  }
  res.send({
    token: 'test123'
  });
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