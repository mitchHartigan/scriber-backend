const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const dbPassword = process.env.DB_ADMIN_PASS;
const dbUrl = `mongodb://localhost:27017/mydb`
               
const app = express();

const PORT = 9000;

const register = require('./routes/register');
const login = require('./routes/login');
const postNotes = require('./routes/postNotes');
const fetchNotes = require('./routes/fetchNotes');

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

app.use(cors());


// IIFE to check server connection to database
(function checkAtlasDbConnection () {
  MongoClient.connect(dbUrl, {useNewUrlParser: true}, (err, db)=> {
    if (err) throw err;
    console.log('Connection established with MongoDB');
  })
}) ();

app.use('/register', register);
app.use('/login', login);
app.use('/postNotes', postNotes);
app.use('/fetchNotes', fetchNotes);

app.listen(PORT, () => console.log(
  `Server started on http://localhost:${PORT}`
));