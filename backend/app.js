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
app.post('/kid', async (req, res) => {
  const {parent_id,first_name, last_name, dateofbirth } = req.body;
  console.log(parent_id,first_name, last_name, dateofbirth );
  if (!(first_name && last_name && dateofbirth))
    return res.status(400).send("All kids are required");

  let kid = await userController.addKid({parent_id: parent_id, first_name: first_name, last_name: last_name, dateofbirth: new Date(dateofbirth) });
  if (kid)
    return res.status(200).send(kid);
  else
    return res.sendStatus(500);
});
app.put('/kid', async (req, res) => {
  const {id,first_name, last_name, dateofbirth } = req.body;
  console.log(id,first_name, last_name, dateofbirth );
  if (!(first_name && last_name && dateofbirth))
    return res.status(400).send("All kids are required");

  let kid = await userController.updateKid({first_name: first_name, last_name: last_name, dateofbirth: new Date(dateofbirth) }, id);
  if (kid)
    return res.status(200).send(kid);
  else
    return res.sendStatus(500);
});

app.get('/users', async (req, res) => {
  userController.getUsers().then(data => res.json(data));
});
app.use('/login', async (req, res) => {
  const { mobileNumber, password } = req.body;

  let user = await userController.getUser(mobileNumber, password);
  if (user) {
    res.send({
      token: user.token,
      user: user
    });
  } else {
    res.status(400).send('Invalid mobile number or password');
  }
});
app.use('/register', async (req, res) => {
  const { firstName, lastName, mobileNumber, password, email, address, kids, paymentOption, admin } = req.body;
  if (!(mobileNumber && password && firstName && lastName && email && address)) {
    return res.status(400).send("All fields are required");
  }

  if (await userController.findUser(mobileNumber)) {
    return res.status(409).send("User Already Exist. Please Login");
  }

  const token = jwt.sign({ mobileNumber }, jwtSecret);
  if (admin) {
    if (req.body.adminPassword == adminPassword) {
      let user = await userController.addUser({ first_name: firstName, last_name: lastName, mobile_number: mobileNumber, password: password, email: email, address: address, user_role: "admin", token: token });
      if (user) {
        return res.status(201).send({
          token: token,
          user: user
        });
      } else {
        return res.status(500).send('Cannot create user');
      }
    }
    else {
      return res.status(401).send('Admin passowrd is not correct.');
    }
  }
  else {
    if (!paymentOption) {
      return res.status(402).send("Please select your preferred payment method")
    }
    for (let i = 0; i < kids.length; i++) {
      let kid = kids[i];
      if (kid.first_name === "" || kid.last_name === "") {
        return res.status(418).send("Please add your kids.")
      }
    }
    let user = await userController.addUser({ first_name: firstName, last_name: lastName, mobile_number: mobileNumber, password: password, email: email, address: address, user_role: "parent", token: token, payment_method: paymentOption });
    await kids.forEach(kid => {
      kid['parent_id'] = user['id'];
      userController.addKid({ first_name: kid.first_name, last_name: kid.last_name, parent_id: user.id, dateofbirth: new Date(kid.dateOfBirth) });
    });
    if (user) {
      return res.status(201).send({
        token: token,
        user: user
      });
    } else {
      return res.status(500).send('cannot create user');
    }
  }
});

app.post('/actions', async (req, res) => {
  const kid_id = req.body.kid_id;
  let actions = await actionController.getActionsByKidId(kid_id);
  if (actions) {
    return res.status(200).send(actions);
  } else {
    return res.status(400).send('Cannot get actions');
  }
});
app.post('/action', async (req, res) => {
  const { kid_id, action_type, points } = req.body;
  if (!(kid_id && action_type && points)) {
    return res.status(400).send("All input is required");
  }
  let action = await actionController.addAction({ kid_id: kid_id, action_type: action_type, points: points });
  if (action) {
    return res.status(201).send(action);
  } else {
    return res.status(500).send('cannot add action');
  }
});
app.put('/action', async (req, res) => {
  const { id, kid_id, action_type, points } = req.body;
  if (!(id && kid_id && action_type && points)) {
    return res.status(400).send("All input is required");
  }
  let action = await actionController.updateAction({ kid_id: kid_id, action_type: action_type, points: points }, id);
  if (action) {
    return res.sendStatus(204);
  } else {
    return res.sendStatus(500);
  }
});

app.post('/user', async (req, res) => {
  const { token } = req.body;
  if (!(token)) {
    return res.status(400).send("token is required");
  }
  let user = await userController.getUserByToken(token);

  if (user) {
    return res.status(200).send(user);
  } else {
    return res.sendStatus(500);
  }
});
app.post('/userById', async (req, res) => {
  const { id } = req.body;
  if (!(id)) {
    return res.status(400).send("Id is required");
  }
  let user = await userController.getUserById(id);
  if (user) {
    return res.status(200).send(user);
  } else {
    return res.sendStatus(500);
  }

});

app.post('/reset', async (req, res) => {
  const { email, mobile, password } = req.body;
  if (!(email && mobile && password)) {
    return res.status(400).send("All input is required");
  }

  let user = await userController.resetPassword(mobile, email, password);
  if (user) {
    return res.status(200).send(user);
  } else {
    return res.status(400).send("Invalid mobile number or email");
  }

});


app.put('/user', async (req, res) => {
  const { id, email, first_name, last_name, mobile, address } = req.body;
  if (!(id && email && first_name && last_name && mobile && address)) {
    return res.status(400).send("All input is required");
  }
  let user = await userController.updateUser({ first_name: first_name, last_name: last_name, email: email, address: address, mobile_number: mobile }, id);
  if (user) {
    return res.status(200).send(user);
  } else {
    return res.sendStatus(500);
  }
});

app.delete('/action', async (req, res) => {
  const { id, points, kid_id } = req.body;
  if (!(id && points && kid_id)) {
    return res.status(400).send("Action id is required");
  }
  let action = await actionController.deleteaction(id, points, kid_id);
  if (action) {
    return res.sendStatus(204)
  } else {
    return res.sendStatus(500);
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