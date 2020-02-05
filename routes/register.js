const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const dbPassword = process.env.DB_ADMIN_PASS;
const dbUrl = `mongodb+srv://admin:${dbPassword}@cluster0-vl3pn.mongodb.net/
               test?retryWrites=true&w=majority`
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchUsers = require('./utilities').fetchUsers;
const addNewUser = require('./utilities').addNewUser;

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', (req, res)=> {
  let { firstName, lastName, email, password } = req.body;

  // Checks to see if the user exists already.
  if(email && password) {
    (async () => {
      const existingUsers = await fetchUsers();
      const userExistsAlready = existingUsers.some(
        user => user.firstName === firstName && user.email === email
      )

      if (userExistsAlready) {
        res.status(403).end();
    
        } else {
          // Creates a hashed password.
          bcrypt.hash(password, 10, function(err, hash) {
            if (err) {
              throw err;
            } else {
              password = hash;
    
              // Creates a user object to be stored in db.
              const user = {
              firstName: firstName,
              lastName: lastName,
              email: email,
              password: password,
              notes:[],
            }
  
            // Connects to db and adds user.
            addNewUser(user);
  
          }
        });
        const payload = { userEmail: email };
        const token = jwt.sign(payload, process.env.SECRET_OR_KEY);
        res.status(200).json(token);
      }
    }) ();
  }
})

module.exports = router;