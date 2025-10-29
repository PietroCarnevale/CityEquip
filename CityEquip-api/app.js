const express = require('express');
const cors = require('cors');
const equipmentRouter = require('./routes/equipmentRouter');

const app = express();

app.use(cors({
  origin: process.env.WEB_APP_URL || "http://localhost:7777",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

app.use("/equipments", equipmentRouter);

module.exports = app;
