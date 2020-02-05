const MongoClient = require('mongodb').MongoClient;
const dbPassword = process.env.DB_ADMIN_PASS;
const dbUrl = `mongodb://localhost:27017/mydb`
const jwt = require('jsonwebtoken');

const fetchUsers = () => {
  return new Promise((resolve) => {
    MongoClient.connect(dbUrl, {useNewUrlParser: true}, (err, db) => {
      if (err) throw err; 
      const dbo = db.db('mydb');
      dbo.collection('customers').find({}).toArray((err, res) => {
        if (err) throw err;
        resolve(res);
        db.close();
      })
    })
  })
};

const addNewUser = (newUserObj) => {
  return new Promise((resolve)=> {
    MongoClient.connect(dbUrl, {useNewUrlParser: true}, (err, db) => {
      if (err) throw err;
      const dbo = db.db('mydb');
      dbo.collection('customers').insertOne(newUserObj, (err, res) => {
        if (err) throw err;
        console.log('1 new user added successfully to DB');
        resolve();
        db.close();
      })
    })
  })
}

const verifyUser = (req) => {
  return new Promise((resolve)=> {
    if (req.body.token) {
      
      jwt.verify(req.body.token, process.env.SECRET_OR_KEY, (err, validToken)=> {
        if(validToken) resolve(validToken.userEmail);
      });
    } else {
      resolve(false);
    }
  })
}

const fetchNotes = (email) => {
  return new Promise((resolve)=> {
    MongoClient.connect(dbUrl, {useNewUrlParser: true}, (err, db)=> {
      if (err) throw err;
      const dbo = db.db('mydb');
      dbo.collection('customers').find({email: email}).toArray((err, document)=> {
        if(err) throw err;
        if (document[0]) resolve(document[0].notes);
        db.close();
      })
    })
  })
}

const postNotes = (email, notes) => {
  return new Promise((resolve)=> {
    MongoClient.connect(dbUrl, {useNewUrlParser: true}, (err, db)=> {
      if (err) throw err;
      const dbo = db.db('mydb');
      dbo.collection('customers').updateOne({email: email}, {$set: {notes: notes}}, (err, result)=> {
        if(err) throw err;
        console.log(`updated notes for ${email}`);
        resolve(true);
        db.close();
      })
    })
  })
}

module.exports = {
  fetchUsers: fetchUsers,
  addNewUser: addNewUser,
  verifyUser: verifyUser,
  fetchNotes: fetchNotes,
  postNotes: postNotes,
}