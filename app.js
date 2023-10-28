const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { printNetwork } = require("./printNetwork.js");
const { printUSB } = require("./printUSB.js");
const app = express();

const options = {
  origin: true,
};
app.use(cors(options));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("NTP-200K printing service");
});

app.post("/print", async (req, res) => {
  const data = req.body;
  try {
    //printNetwork(data);
    printUSB(data);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log("running on port " + PORT);
});
