'use strict';

// [START gae_node_request_example]
const express = require('express');
const cors = require('cors');
const app = express();
const taskController = require('./kid.controller')
app.use(cors());
app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});
app.get('/kids', (req, res) => {
    res.status(200).send('Hello, world!').end();
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