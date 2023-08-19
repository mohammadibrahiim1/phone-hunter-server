// phone-hunter
// y0XFIqtf8Nx1EaZo

require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

// connect to mongodb database

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wuwpwwx.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  const db = client.db("phone-hunter");
  const productsCollection = db.collection("products");

  try {
    // get data from database
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const product = await cursor.toArray();
      res.send({
        status: true,
        data: product,
      });
    });

    app.post("/product", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });  

    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const result = await productsCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result); 
    });

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally { 
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
// run().catch(console.dir);
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World! phone-hunter web-server is running ");
}); 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
 