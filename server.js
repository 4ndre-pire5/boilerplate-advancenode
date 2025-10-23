'use strict';
require('dotenv').config();
const express = require('express');
const myDB = require('./connection');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const session = require('express-session');
const passport = require('passport');
const { ObjectID } = require('mongodb');
const LocalStategy =  require('passport-local');

const app = express();

// add this CORS header to pass the first challenge
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
})

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

myDB(async client => {
  const myDB = await client.db('persondb').collection('people');

  app.route('/').get((req, res) => {
    res.render('index', { 
      title: 'Connected to Database', 
      message: 'Please log in' 
    });
  });
  
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  
  passport.deserializeUser((id, done) => {
    myDB.findOne({ _id: new ObjectID(id) }, (err, doc) => {
      done(null, doc);
    });
  });

  passport.use(new LocalStategy((username, password, done) => {
    myDB.findOne({ username: username }, (err, user) => {
      console.log(`User ${username} attempted to log in`);
      if (err) return done(err);
      if (!user) return done(null, false);
      if (password !== user.password) return done(null, false);
      return done(null, user);
    });
  }));

}).catch( e => {
  app.route('/').get((req, res) => {
    res.render('index', { 
      title: e, 
      message: 'Unable to connect to database'
    });
  });
});

app.set('view engine', 'pug');
app.set('views', './views/pug');
fccTesting(app); //For FCC testing purposes

app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
