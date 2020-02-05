var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const dbPassword = process.env.DB_ADMIN_PASS;
const dbUrl = `mongodb://localhost:27017/mydb`
const verifyUser = require('./utilities').verifyUser;
const postNotes = require('./utilities').postNotes;

router.use(bodyParser.urlencoded({extended: true}));

router.post('/', async (req, res)=> {
  verifyUser(req)
    .then(async (verifiedEmail)=>{
      if(verifiedEmail) {
        let postSuccess = await postNotes(verifiedEmail, req.body.notes);
        if (postSuccess) { 
          res.status(200).end();
        } else {
          res.status(500).end();
        }
      } else {
        res.status(403).end();
      }
    })
});


module.exports = router;