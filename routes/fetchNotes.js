var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const verifyUser = require('./utilities').verifyUser;
const fetchNotes = require('./utilities').fetchNotes;

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

router.post('/', async (req, res)=> {
  console.log('posting to fetchNotes!');
  verifyUser(req)
    .then(async (verifiedEmail)=>{
      if(verifiedEmail){
        console.log('verifiedEmail:', verifiedEmail)
        const notes = await fetchNotes(verifiedEmail);
        console.log('notes: ', notes);
        res.status(200).json(notes);
      } else {
        res.status(403);
      }
    })
});


module.exports = router;