const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
// const { printNetwork } = require("./printNetwork.js");
// const { printUSB } = require("./printUSB.js");
const { printCanvas } = require("./printCanvas.js");
const app = express();

const options = {
  origin: true,
};
app.use(cors(options));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Booktree thermal printing service");
});

app.post("/print", async (req, res) => {
  const data = req.body;
  try {
    console.log(new Date().toLocaleString("en-GB"), " Starting print...");
    printCanvas(data);
    console.log(new Date().toLocaleString("en-GB"), " Print successful");
    res.sendStatus(200);
  } catch (err) {
    console.error(new Date().toLocaleString("en-GB"), err);
    console.log(new Date().toLocaleString("en-GB"), err);
    res.sendStatus(500);
  }
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log("running on port " + PORT);
});
