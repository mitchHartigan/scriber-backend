const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fetchUsers = require('./utilities').fetchUsers;
  

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

router.post('/', (req, res)=> {
  let { email, password } = req.body;

  if (email && password) {
    (async ()=> {
      const existingUsers = await fetchUsers();
      const user = existingUsers.find(user => user.email === email)

      if (user) {
        bcrypt.compare(password, user.password, (err, passwordsMatch)=> { 
          if (err) throw err;
          if (passwordsMatch) {
            const payload = { userEmail: user.email }
            const token = jwt.sign(payload, process.env.SECRET_OR_KEY);
            res.status(200).json(token);
            console.log(`${email} logged in successfully`);
          } else {
            res.status(403).json('Password incorrect.')
          }
        })
      } else {
        res.status(403).json('User does not exist.');

      }
    }) ();
  }
});

module.exports = router;