const express = require('express');
const mongoose = require('mongoose'); // MongoDB queries
const router = express.Router(); // this is the module that lets me have different routes for the router.js file


// User Login Route
router.get('/login', (req, res) => {
    res.render('users/login');
  });
  
router.get('/register', (req, res) => {
    res.render('users/register');
  });
  










module.exports = router;