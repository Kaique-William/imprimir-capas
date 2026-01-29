const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const rotas_reg = require("./routes");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.options("*", cors());
app.use(express.json());

const MONGO_URI = "mongodb+srv://teste:TESTE222@meubanco.drgd8c5.mongodb.net/COMPROVANTE";
let cachedConn = null;

app.use(async (req, res, next) => {
  try {
    if (!cachedConn) {
      cachedConn = await mongoose.connect(MONGO_URI, { dbName: "COMPROVANTE" });
      console.log("Conectado ao MongoDB");
    }
    next();
  } catch (err) {
    console.error("Erro MongoDB:", err);
    res.status(500).json("Erro interno do servidor (MongoDB)");
  }
});

app.use("/registros", rotas_reg);

module.exports.handler = serverless(app);
