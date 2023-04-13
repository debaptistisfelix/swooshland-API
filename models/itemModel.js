const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
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
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      /* required: [true, "An Item must have a description"], */
    },

    images: [],
    paletteColors: [
      {
        hex: String,
        name: String,
      },
    ],
    availableSizes: [
      {
        EUSize: String,
        itemsAvailable: Number,
        reserved: {
          type: Number,
          default: 0,
        },
      },
    ],
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
    tag: {
      type: String,
      required: [true, "An item must have a tag"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

itemSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "item",
  localField: "_id",
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
