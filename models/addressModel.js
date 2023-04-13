const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "You must submit a Name to add address"],
  },
  surname: {
    type: String,
    required: [true, "You must submit a Surname to add address"],
  },
  address: {
    type: String,
    required: [true, "You must submit an Address to add address"],
  },
  city: {
    type: String,
    required: [true, "You must submit a City to add address"],
  },
  postCode: {
    type: String,
    required: [true, "You must submit a Post Code to add address"],
  },
  region: {
    type: String,
  },
  country: {
    type: String,
    required: [true, "You must submit a Country to add address"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

addressSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "_id",
  });
  next();
});

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
