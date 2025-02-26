const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pizzaSchema = new Schema({
  title: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  isVeggie: { type: Boolean, default: false },
  ingredients: [String],
  dough: { type: String, enum: ["thin", "thick"] },
});

const Pizza = mongoose.model("Pizza", pizzaSchema);
module.exports = Pizza;
