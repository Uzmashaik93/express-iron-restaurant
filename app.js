const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const Pizza = require("./models/Pizza.model");
const Cook = require("./models/Cook.model");

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
    .populate("cook")
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

//filter individual pizza wrt id's
app.get("/pizzas/:pizzaId", (req, res, next) => {
  let { pizzaId } = req.params;
  Pizza.findById(pizzaId)
    .then((pizzaFromDb) => {
      res.json(pizzaFromDb);
    })
    .catch((e) => {
      res.status(501).json({ e: "Error" });
    });
});

//update
app.put("/pizzas/:pizzaId", (req, res, next) => {
  const { pizzaId } = req.params;
  const newDetails = req.body;

  Pizza.findByIdAndUpdate(pizzaId, newDetails)
    .then((pizzaFromDb) => {
      res.json(pizzaFromDb);
    })
    .catch((e) => {
      res.status(500).json({ e: "failed" });
    });
});

//Delete /pizzas/:pizzaId
app.delete("/pizzas/:pizzaId", (req, res, next) => {
  const { pizzaId } = req.params;

  Pizza.findByIdAndDelete(pizzaId)
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(500).json(err, "Error");
    });
});

//Post /cooks
app.post("/cooks", (req, res, next) => {
  const newCook = req.body;

  Cook.create(newCook)
    .then((cookFromDb) => {
      res.status(201).json(cookFromDb);
    })
    .catch((err) => {
      res.status(500).json(err, "Error");
    });
});

app.listen(PORT, () => {
  console.log("Server listening on port..." + PORT);
});
