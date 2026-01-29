const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.json({ message: "Estou vivo!" });
});

module.exports.handler = serverless(app);
