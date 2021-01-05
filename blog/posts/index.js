const express = require("express");

const { json } = require("body-parser");

const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

// Torn down after every server restart for this basic application

const app = express();

app.use(json());

// Add cors so that we can call cross domain
app.use(cors());
const posts = {};

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  try {
    await axios.post("http://event-bus-srv:4005/events", {
      type: "PostCreated",
      data: posts[id],
    });
    res.status(201).send(posts[id]);
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
});

app.post("/events", (req, res) => {
  console.log("Recieved Event", req.body.type);

  res.send();
});

app.listen(4000, () => {
  console.log("v55");
  console.log("Listening on port 4000");
});
