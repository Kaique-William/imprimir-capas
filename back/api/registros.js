const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const rotas_reg = require("../routes/routes");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.use("/api/registros", rotas_reg);


let conn = null;

async function connectDB() {
  if (conn) return conn;

  conn = await mongoose.connect(
    "mongodb+srv://teste:TESTE222@meubanco.drgd8c5.mongodb.net/COMPROVANTE",
    { bufferCommands: false }
  );

  return conn;
}

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
