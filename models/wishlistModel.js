const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      required: [true, "An Wishlist item must have a model"],
    },
    category: {
      type: String,
      required: [true, "An Wishlist item must have a category"],
    },
    name: {
      type: String,
      required: [true, "An Wishlist item must have a name"],
      trim: true,
      maxlength: [50, "An Wishlist item must have less than 50 characters"],
      minlength: [2, "An Wishlist item must have more than 2 characters"],
    },
    price: {
      type: Number,
      required: [true, "An Wishlist item must have a price"],
    },
    images: {
      type: String,
      require: [true, "Cart Wishlist item needs an image"],
    },
    itemId: {
      type: String,
      require: true,
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
    chosenSize: {
      type: String,
      require: [true, "A Wishlist Item must have a chosen size"],
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

wishlistSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "_id",
  });
  next();
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;
