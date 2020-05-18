// Make the comunication with a server to create petitions
const express = require('express');
// Make the paths for the paths to create the petitions
const path = require('path');
// Parses the information in the body of petitions
const bodyParser = require('body-parser');
// Cross-Origin Resource Sharing needed for express to get headers
const cors = require('cors');
// Strategy for authenticating with a JSON Web Token.
const passport = require('passport');
// MongoDB object modeling tool designed to work in an asynchronous environment.
const mongoose = require('mongoose');
// Configuration of the database
const config = require('./config/database');
// Hidden variables
require('dotenv').config();
// Connect to the database
mongoose.connect(config.database, {
  useNewUrlParser: true
});

// Connect to the database and log out if it was successful
mongoose.connection.on('connected', () => {
  console.log('Connected to the database');
});

// Logout if the connect was failed
mongoose.connection.on('error', (err) => {
  console.log('Database error: ' + err);
});

mongoose.set('useFindAndModify', false);

// Initialize Express
const app = express();

// CORS
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE'); 
  res.setHeader('Access-Control-Allow-Credentials', true); 
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, X-Requested-With');
  next();
})


// Create the routing for the petitions in users URL
const users = require('./routes/users');
const egresos = require('./routes/savings');

// CORS Middleware added to express
// Serve only the static files form the dist directory
app.use(cors())
app.use(express.static(__dirname + 'front/dist'));
app.use(bodyParser.urlencoded({ extended: true }));

// Body parser Middleware
app.use(bodyParser.json());

// Passport strategy for authenticating with a JSON Web Token.
app.use(passport.initialize());
app.use(passport.session());

// Get the code of the settings for the passport
require('./config/passport')(passport);

// Use users as the domain to make the petitions
app.use('/users', users);
app.use('/savings', egresos);

// Index Route / show as invalid end point
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'front/dist/index.html'));
// });

// Start Server on the port setted
app.listen(process.env.PORT || 8081, () => {
  console.log('Server started on port ' + process.env.PORT || 8081);
});
