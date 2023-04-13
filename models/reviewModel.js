const mongoose = require("mongoose");
const Item = require("../models/itemModel");
const reviewSchema = new mongoose.Schema(
  {
    reviewText: {
      type: String,
      require: [true, "A review must contain text"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    item: {
      type: mongoose.Schema.ObjectId,
      ref: "Item",
      required: [true, "A review must belong to an item"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A review must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* reviewSchema.index({ tour: 1, user: 1 }, { unique: true }); */

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name _id",
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (itemId) {
  const stats = await this.aggregate([
    {
      $match: { item: itemId },
    },
    {
      $group: {
        _id: "$item",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  /*  await Item.findByIdAndUpdate(itemId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating,
  }); */
  if (stats.length > 0) {
    await Item.findByIdAndUpdate(itemId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    // Handle case where there are no reviews for the item
    await Item.findByIdAndUpdate(itemId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.item);
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    // Do something with the deleted document (e.g. log it)
    console.log(doc);

    // Call a function to perform additional operations (e.g. update item statistics)
    await this.model.calcAverageRatings(doc.item);
  }
});

/* reviewSchema.post("findOneAndDelete", function () {
  this.constructor.calcAverageRatings(this.item);
}); */

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
