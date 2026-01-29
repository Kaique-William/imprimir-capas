const serverless = require("serverless-http");
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
app.options("*", cors());
app.use(express.json());

app.use("/registros", rotas_reg);

const MONGO_URI = "mongodb+srv://teste:TESTE222@meubanco.drgd8c5.mongodb.net/?appName=MeuBanco";

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error("Erro ao conectar no MongoDB:", err);
    res.status(500).json("Erro interno do servidor (MongoDB)");
  }
});

let cachedConn = null;

async function connectToDatabase() {
  if (cachedConn) return cachedConn;

  if (mongoose.connection.readyState === 1) {
    cachedConn = mongoose.connection;
    return cachedConn;
  }

  cachedConn = await mongoose.connect(MONGO_URI, { dbName: "COMPROVANTE" });
  console.log("Conectado ao MongoDB");
  return cachedConn;
}


module.exports.handler = serverless(app);
