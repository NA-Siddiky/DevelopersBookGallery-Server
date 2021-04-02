const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
var ObjectId = require('mongodb').ObjectID;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ylija.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  // console.log('connection err', err)

  const bookCollection = client.db('DevelopersBook').collection('books');
  const orderCollection = client.db('DevelopersBook').collection('order');
  // perform actions on the collection object

  app.get('/books', (req, res) => {
    bookCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  // Get Single Book By Id
  app.get('/checkout/:id', (req, res) => {
    const id = new ObjectId(req.params.id);
    bookCollection.find({ _id: id }).toArray((err, items) => {
      res.send(items);
    });
  });

  app.post('/addBook', (req, res) => {
    const newBook = req.body;
    console.log(newBook);
    bookCollection.insertOne(newBook).then((result) => {
      console.log('inserted count', result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.delete('/deletebook/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    console.log('delete this', id);
    bookCollection
      .findOneAndDelete({ _id: id })
      .then((documents) => res.send(documents.value));
  });

  // save Order
  app.post('/saveorder', (req, res) => {
    const newOrder = req.body;
    console.log(newOrder);
    orderCollection.insertOne(newOrder).then((result) => {
      console.log('inserted count', result.insertedCount);
      if (result.insertedCount > 0) {
        res.status(200).json(result);
      }
    });
  });

  // Get All order
  app.get('/getorder', (req, res) => {
    orderCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });
  // Get Single user  Order
  app.post('/userorder', (req, res) => {
    const userEmail = req.body.email;
    orderCollection.find({ email: userEmail }).toArray((err, items) => {
      res.send(items);
    });
  });

  // Order Delete
  app.delete('/deleteorder/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    console.log('delete this', id);
    orderCollection
      .findOneAndDelete({ _id: id })
      .then((documents) => res.send(documents.value));
  });

  // client.close();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});