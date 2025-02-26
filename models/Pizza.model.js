const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pizzaSchema = new Schema({
  title: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  isVeggie: { type: Boolean, default: false },
  ingredients: [String],
  dough: { type: String, enum: ["thin", "thick"] },
  cook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cook",
    required: true,
  },
});

const Pizza = mongoose.model("Pizza", pizzaSchema);
module.exports = Pizza;
