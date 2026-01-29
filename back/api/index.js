const serverless = require("serverless-http");
const express = require("express");

const app = express();

app.get("/", (req, res) => res.json({ message: "Estou vivo!" }));

module.exports.handler = serverless(app);
