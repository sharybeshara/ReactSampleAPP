'use strict';

// [START gae_node_request_example]
const express = require('express');
const cors = require('cors');
const app = express();
// const createTcpPool = require('./db/connect-tcp.js');
const kidController = require('./kid_controller')
require('dotenv').config()

// const createPool = async () => {
   
//     const config = {pool: {}};
  
//     config.pool.max = 5;
//     config.pool.min = 5;
//     config.pool.acquireTimeoutMillis = 60000; // 60 seconds
//     config.pool.createTimeoutMillis = 30000; // 30 seconds
//     config.pool.idleTimeoutMillis = 600000; // 10 minutes
//     config.pool.createRetryIntervalMillis = 200; // 0.2 seconds
//     if (process.env.INSTANCE_HOST) {
//       // Use a TCP socket when INSTANCE_HOST (e.g., 127.0.0.1) is defined
//       return createTcpPool(config);
//     } else if (process.env.INSTANCE_UNIX_SOCKET) {
//       // Use a Unix socket when INSTANCE_UNIX_SOCKET (e.g., /cloudsql/proj:region:instance) is defined.
//       return createUnixSocketPool(config);
//     } else {
//       throw 'One of INSTANCE_HOST or INSTANCE_UNIX_SOCKET` is required.';
//     }
//   };
//   let pool = createPool();
 

app.use(cors());
app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});
app.get('/kids', async (req, res) => {
    kidController.getKids().then(data => res.json(data));
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