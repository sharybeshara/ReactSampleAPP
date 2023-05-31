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

app.post('/kids', async (req, res) => {
  const { parent_id } = req.body;
  userController.getKidsPerParent(parent_id).then(data => res.json(data));
});
app.get('/allKids', async (req, res) => {
  userController.getKids().then(data => res.json(data));
});
app.get('/users', async (req, res) => {
  userController.getUsers().then(data => res.json(data));
});
app.use('/login', async (req, res) => {
  const { mobileNumber, password } = req.body;
  const token = jwt.sign({ mobileNumber }, jwtSecret);
  let user = await userController.getUser(mobileNumber, password);
  if (user) {
    res.send({
      token: token,
      user: user
    });
  } else {
    res.status(400).send('Invalid mobile number or password');
  }
});
app.use('/register', async (req, res) => {
  const { name, mobileNumber, password, email, address, kids } = req.body;
console.log(req.body);
  if (!(mobileNumber && password && name && email && address)) {
    res.status(400).send("All fields are required");
  }

  if (await userController.findUser(mobileNumber)) {
    return res.status(409).send("User Already Exist. Please Login");
  }

  const token = jwt.sign({ name }, jwtSecret);

  if (req.body.adminPassword == adminPassword) {
    let user = await userController.addUser({ name: name, mobile_number: mobileNumber, password: password, email: email, address: address, user_role: "admin", token: token });
    if (user) {
      res.status(201).send({
        token: token,
        user: user
      });
    } else {
      res.status(500).send('cannot create user');
    }

  }
  else {
    let user = await userController.addUser({ name: name, mobile_number: mobileNumber, password: password, email: email, address: address, user_role: "parent", token: token});
    await kids.forEach(kid => {
      kid['parent_id'] = user['id'];
      userController.addKid({name: kid.name, parent_id: user.id, dateofbirth: new Date(kid.dateOfBirth) });
    });
    if (user) {
      res.status(201).send({
        token: token,
        user: user
      });
    } else {
      res.status(500).send('cannot create user');
    }
  }
});

app.post('/actions', async (req, res) => {
  console.log(req.body);
  const kid_id = req.body.kid_id;
  let actions = await actionController.getActionsByKidId(kid_id);
  if (actions) {
    res.status(200).send(actions);
  } else {
    res.status(400).send('Cannot get actions');
  }
});
app.post('/action', async (req, res) => {
  const { kid_id, action_type, points } = req.body;
  if (!(kid_id && action_type && points)) {
    res.status(400).send("All input is required");
  }
  let action = await actionController.addAction({ kid_id: kid_id, action_type: action_type, points: points });
  if (action) {
    res.status(201).send(action);
  } else {
    res.status(500).send('cannot add action');
  }
});
app.put('/action', async (req, res) => {
  const { id, kid_id, action_type, points } = req.body;
  if (!(id && kid_id && action_type && points )) {
    res.status(400).send("All input is required");
  }
  let action = await actionController.updateAction({kid_id: kid_id, action_type: action_type, points: points }, id);
  if (action) {
    res.sendStatus(204);
  } else {
    res.sendStatus(500);
  }
});

app.post('/user', async (req, res) => {
  const { token} = req.body;
  if (!(token  )) {
    res.status(400).send("token is required");
  }
  let user = await userController.getUserByToken(token);
  console.log("app", user);
  if (user) {
    res.status(200).send(user);
  } else {
    res.sendStatus(500);
  }
});

app.delete('/action', async (req, res) => {
  const {id ,points, kid_id} = req.body;
  if (!(id && points && kid_id)) {
    res.status(400).send("Action id is required");
  }
  let action = await actionController.deleteaction(id, points, kid_id);
  if (action) {
    res.sendStatus(204)
  } else {
    res.sendStatus(500);
  }
});



app.get('/', function (req, res) {
  res.json('Hello, world!');
});
// Start the server
const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});


module.exports = app;