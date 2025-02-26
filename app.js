const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const Pizza = require("./models/Pizza.model");

const app = express();
const PORT = 3000;

app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.json());

//connect to DB

mongoose
  .connect("mongodb://127.0.0.1:27017/express-restaurant")
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));

function customMiddleware(req, res, next) {
  console.log("example of a custom middleware function...");
  next();
}
app.use(customMiddleware);

app.get("/", (req, res, next) => {
  console.log("inside ////// ....");
  //   res.send("homepage");

  res.sendFile(__dirname + "/views/home.html");
});

app.get("/contact", (req, res, next) => {
  res.sendFile(__dirname + "/views/contact.html");
});

//POST/pizzas
app.post("/pizzas", (req, res, next) => {
  const newPizza = req.body;

  Pizza.create(newPizza)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch(() => res.status(500).send("Failed"));
});

//query string

app.get("/pizzas", (req, res, next) => {
  const { maxPrice } = req.query;

  //to handle when maxprice is undefined
  let filter = {};

  if (maxPrice) {
    filter = { price: { $lte: maxPrice } };
  }

  Pizza.find(filter)
    .then((pizzasFromDb) => {
      res.json(pizzasFromDb);
    })
    .catch((e) => res.json({ e: "Error" }));

  // if (maxPrice === undefined) {
  //   res.json(pizzasArr);
  //   return;
  // }
  // const filteredPizzas = pizzasArr.filter((pizzaObj) => {
  //   return pizzaObj.price <= maxPrice;
  // });

  // res.json(filteredPizzas);
});

app.listen(PORT, () => {
  console.log("Server listening on port..." + PORT);
});
