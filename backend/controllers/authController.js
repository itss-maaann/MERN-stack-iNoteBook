require('dotenv').config({ path: '../.env.local' });
const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const signature = 'khalil$b@y';

// Wrap the route handling in an async function for cleaner error handling
const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, error: errors.array() });
    }
  
    const { email, name, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ status: false, error: 'Email address already in use' });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(password, salt);
  
      const newUser = await User.create({ name, email, password: secPass });

      const data = {
        user : {
            id : newUser.id
        }
      }

      const authToken = jwt.sign(data, signature);
  
      return res.status(201).json({ status: true, authToken });
    } catch (error) {
      return res.status(500).json({ status: false, error: error.message });
    }
  };

  const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, error: errors.array() });
    }
    
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      
      // Perform comparison even if user is not found
      const isPasswordValid = user ? await bcrypt.compare(password, user.password) : false;
      
      if (!user || !isPasswordValid) {
        return res.status(401).json({ status: false, error: 'Invalid email or password' });
      }
  
      const data = {
        user: {
          id: user.id
        }
      };
  
      const authToken = jwt.sign(data, signature);
  
      return res.status(200).json({ status: true, authToken });
  
    } catch (error) {
      return res.status(500).json({ status: false, error: error.message });
    }
  };
    
  const getUserDetails = async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select('-password');
      return res.status(200).json({ status: true, user });
    } catch (error) {
      return res.status(500).json({ status: false, error: error.message });
    }
  }
  module.exports = {createUser, loginUser, getUserDetails}