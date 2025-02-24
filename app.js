const express = require("express");

const pizzasArr = require("./data/pizzas");
const app = express();
const PORT = 3000;

app.use(express.static("public"));

app.get("/", (req, res, next) => {
  console.log("inside ////// ....");
  //   res.send("homepage");

  res.sendFile(__dirname + "/views/home.html");
});

app.get("/contact", (req, res, next) => {
  res.sendFile(__dirname + "/views/contact.html");
});

app.get("/pizzas", (req, res, next) => {
  res.send(pizzasArr);
});

app.listen(PORT, () => {
  console.log("Server listening on port..." + PORT);
});
