const express = require("express");
const cors = require("cors");
require('dotenv').config()
const app = express();
const port =  5000;

// middleware

app.use(cors());
app.use(express.json());


// mongodb connection


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.u69fsfj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // user related api
    const userCollection = client.db("restaurant_DB").collection("users");

    // menu related api
    const collectionDB = client.db("restaurant_DB").collection('menu1');

    // reviews related api
    const reviewsCollection = client.db("restaurant_DB").collection("reviews");


    // cart related api
    const cartCollection = client.db("restaurant_DB").collection("carts");

    //user collection
    // check whether the email exist or not
    app.post('/users', async(req, res) => {
      const user = req.body;
      const query = {email : user.email}
      const existingUser = await userCollection.findOne(query);
      if(existingUser){
        return res.send({message: 'user already-exist', insertedId: null})
      }
      const result = await userCollection.insertOne(body);
      res.send(result)
    }) 

    
  // menu collection
    app.get('/menu', async(req, res) => {
      const result = await collectionDB.find().toArray();
      res.send(result);  
    })


  // review collection
    app.get('/reviews', async(req, res) => {
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    })


//cart collection 
    app.get('/carts', async(req, res) => {
      const email = req.query.email;
      const query = {email : email}
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    })


    // app.post('/carts', async(req, res) =>{
    //   const cartItem = req.body;
    //   const result = await cartCollection.insertOne(cartItem);
    //   res.send(result);
    // })

    app.post('/carts', async(req, res) => {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    })


    app.delete('/carts/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await cartCollection.deleteOne(query)
      res.send(result)
    })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



// server
app.get("/", (req, res) => {
    res.send("Server is running");
})

app.listen(port, () => {
    console.log("server is running")
})