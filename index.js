const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// const uri =
//   "mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nrpddgz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = "mongodb://localhost:27017";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

    const discoverCollection = client
      .db("DiscoverHaven")
      .collection("destinations");

    const countriesCollection = client
      .db("DiscoverHaven")
      .collection("countries");

    // CRUD operations for add tourists spots

    // read all collection
    app.get("/destinations", async (req, res) => {
      const query = discoverCollection.find();
      const result = await query.toArray();
      res.send(result);
    });

    

    // read a collection by id
    app.get("/destinations/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await discoverCollection.findOne(query);
      res.send(result);
    });
    // read a collection by email
    app.get("/user/:email", async (req, res) => {
      const result = await discoverCollection
        .find({
          user_email: req.params.email,
        })
        .toArray();
      console.log(result);
      res.send(result);
    });

    // create a collection
    app.post("/destinations", async (req, res) => {
      const newDestinations = req.body;
      console.log(newDestinations);
      const result = await discoverCollection.insertOne(newDestinations);
      res.send(result);
    });

    // update a collection
    app.put("/destinations/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateSpot = req.body;
      const spot = {
        $set: {
          user_name: updateSpot.user_name,
          user_email: updateSpot.user_email,
          spot_name: updateSpot.spot_name,
          country_name: updateSpot.country_name,
          spot_location: updateSpot.spot_location,
          description: updateSpot.description,
          average_cost: updateSpot.average_cost,
          seasonality: updateSpot.seasonality,
          travel_time: updateSpot.travel_time,
          visitors_per_year: updateSpot.visitors_per_year,
          photo_url: updateSpot.photo_url,
        },
      };
      const result = await discoverCollection.updateOne(query, spot, options);
      res.send(result);
    });

    // delete a collection
    app.delete("/destinations/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await discoverCollection.deleteOne(query);
      res.send(result);
    });

    // read all collection ass categories
    app.get("/countries", async (req, res) => {
      const query = countriesCollection.find();
      const result = await query.toArray();
      res.send(result);
    });
    // create a collection
    app.post("/countries", async (req, res) => {
      const newCountries = req.body;
      console.log(newCountries);
      const result = await countriesCollection.insertOne(newCountries);
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Discover haven server is running");
});

app.listen(port, () => {
  console.log(`Discover haven server is running on port ${port}`);
});
