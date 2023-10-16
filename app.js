const express = require("express");
const { handlePrint } = require("./handlePrint.js");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const options = {
  origin: true,
};
app.use(cors(options));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.post("/print", async (req, res) => {
  const data = req.body;
  handlePrint(data);
  res.sendStatus(200);
});

app.listen("3000", () => {
  console.log("running on port 3000");
});
