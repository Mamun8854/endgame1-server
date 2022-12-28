const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middle Ware

app.use(cors());
app.use(express.json());

// mongodb uri and client
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nuhoilk.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    // post collection
    const postsCollection = client.db("endgame1").collection("posts");

    // comment collection

    const commentCollection = client.db("endgame1").collection("comment");

    // post data POST
    app.post("/post", async (req, res) => {
      const post = req.body;
      const result = await postsCollection.insertOne(post);
      res.send(result);
    });

    // get post data from db
    app.get("/posts", async (req, res) => {
      const query = {};
      const result = await postsCollection.find(query).toArray();
      res.send(result);
    });
    // get each data details from db
    app.get("/post/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await postsCollection.findOne(query);
      res.send(result);
    });

    // comment section

    app.post("/comment", async (req, res) => {
      const comment = req.body;
      const result = await commentCollection.insertOne(comment);
      res.send(result);
    });

    // get comment data from db
    app.get("/allComments", async (req, res) => {
      const query = {};
      const result = await commentCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/comments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { postId: id };
      const postId = commentCollection.find(query).sort({ date: -1 });
      const result = await postId.toArray();
      res.send(result);
    });

    // get 3 post from posts collection by sorting
    app.get("/homePost", async (req, res) => {
      const size = parseInt(req.query.size);
      const query = {};
      const cursor = postsCollection.find(query);
      const posts = await cursor.limit(size).sort({ date: -1 }).toArray();
      res.send(posts);
    });
  } catch {}
};

run().catch((err) => console.error(err));

app.get("/", async (req, res) => {
  res.send("endgame1 server is running");
});

app.listen(port, () => {
  console.log(`endgame1 running on port ${port}`);
});
