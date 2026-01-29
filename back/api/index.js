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

mongoose.connect(
  "mongodb+srv://teste:TESTE222@meubanco.drgd8c5.mongodb.net/?appName=MeuBanco",
  {
    dbName: "COMPROVANTE"
  }
)
.then(async (conn) => {
  await conn.connection.db.admin().ping();
  console.log("Conectado ao banco");
})
.catch((err) => {
  console.error("Erro ao conectar no banco", err);
});

module.exports = serverless(app);
