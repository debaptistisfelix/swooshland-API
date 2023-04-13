const mongoose = require("mongoose");
const User = require("../models/userModel");

const cartItemSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      required: [true, "An Item must have a model"],
    },
    category: {
      type: String,
      required: [true, "An Item must have a category"],
    },
    name: {
      type: String,
      required: [true, "An Item must have a name"],
      trim: true,
      maxlength: [50, "An Item must have less than 50 characters"],
      minlength: [2, "An Item must have more than 2 characters"],
    },
    price: {
      type: Number,
      required: [true, "An Item must have a price"],
    },
    images: {
      type: String,
      require: [true, "Cart Item needs an image"],
    },
    tag: {
      type: String,
      required: true,
    },
    stripe: {
      item: {
        type: String,
      },
      quantity: {
        type: Number,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    itemId: {
      type: String,
      require: true,
    },
    chosenSize: {
      type: String,
      require: [true, "A Cart Item must have a chosen size"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    paletteColors: [
      {
        hex: String,
        name: String,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

cartItemSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "_id",
  });
  next();
});

const CartItem = mongoose.model("CartItem", cartItemSchema);

module.exports = CartItem;
