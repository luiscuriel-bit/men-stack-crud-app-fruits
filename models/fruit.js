const mongoose = require("mongoose");

const fruitSchema = new mongoose.Schema({
    name: String,
    isReadyToEat: { type: Boolean, default: false },
    color: String,
    secondaryColor: String,
});

const Fruit = mongoose.model("Fruit", fruitSchema);

module.exports = Fruit;