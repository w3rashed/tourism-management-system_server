const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nrpddgz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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

    // read all collection as categories
    app.get("/countries", async (req, res) => {
      const query = countriesCollection.find();
      const result = await query.toArray();
      res.send(result);
    });
    // create a collection for country
    app.post("/countries", async (req, res) => {
      const newCountries = req.body;
      console.log(newCountries);
      const result = await countriesCollection.insertOne(newCountries);
      res.send(JSON.stringify(result));
    });

    // read a collection by country
    app.get("/destinationByCounty/:country", async (req, res) => {
      const result = await discoverCollection
        .find({
          country_name: req.params.country,
        })
        .toArray();
      console.log(result);
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // dami data
    app.get("/install", async (req, res) => {
      const check = await countriesCollection.find({}).toArray();
      if (check.length === 0) {
        const data = await countriesCollection.insertMany([
          {
            country_name: "Bangladesh",
            photo_url: "https://i.ibb.co/FHkJvJy/image.png",

            places: [
              "Sundarbans",
              "Cox’s Bazar",
              "Rangamati",
              "Bandarban",
              "Saint Martin’s Island",
            ],
          },
          {
            country_name: "Thailand",
            photo_url: "https://i.ibb.co/pzQdT4H/image.png",
            places: [
              "Bangkok",
              "Chiang Mai",
              "Ayutthaya",
              "Phuket",
              "Phi Phi Islands",
            ],
          },
          {
            country_name: "Indonesia",
            photo_url: "https://i.ibb.co/RPrZCm4/image.png",
            places: [
              "Bali",
              "Borobudur Temple",
              "Komodo National Park",
              "Raja Ampat Islands",
              "Yogyakarta",
            ],
          },
          {
            country_name: "Malaysia",
            photo_url: "https://i.ibb.co/YygysNh/image.png",
            places: [
              "Kuala Lumpur",
              "Langkawi",
              "Penang",
              "Cameron Highlands",
              "Taman Negara National Park",
            ],
          },
          {
            country_name: "Vietnam",
            photo_url: "https://i.ibb.co/8sv1kP1/image.png",
            places: [
              "Ha Long Bay",
              "Ho Chi Minh City",
              "Hoi An Ancient Town",
              "Phong Nha Caves",
              "Mekong Delta",
            ],
          },
          {
            country_name: "Cambodia",
            photo_url: "https://i.ibb.co/4PTvGmX/image.png",
            places: [
              "Angkor Wat",
              "Siem Reap",
              "Phnom Penh",
              "Kep",
              "Bokor National",
            ],
          },
        ]);

        res.send(JSON.stringify(data));
      }

      res.send(JSON.stringify({ failed: "already exist" }));
    });
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
