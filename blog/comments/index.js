const express = require("express");

const { json } = require("body-parser");

const { randomBytes } = require("crypto");
const cors = require("cors");

const app = express();
const axios = require("axios");

app.use(json());
app.use(cors());

// Torn down after every server restart for this basic application
const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ id: commentId, content, status: "pending" });
  commentsByPostId[req.params.id] = comments;

  await axios.post("http://event-bus-srv:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: "pending",
    },
  });
  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  console.log("Received Event", req.body.type);

  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { postId, id, status, content } = data;

    const comments = commentsByPostId[postId];

    const comment = comments.find((entry) => entry.id === id);

    if (comment) {
      comment.status = status;
    }

    await axios.post("http://event-bus-srv:4005/events", {
      type: "CommentUpdated",
      data: { id, status, postId, content },
    });
  }

  res.send();
});

app.listen(4001, () => {
  console.log("Listening on port 4001");
});
