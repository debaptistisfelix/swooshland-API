const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("../controllers/factoryHandler");
const appError = require("../utils/appError");

const APIFeatures = require("./../utils/apiFeatures");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const Item = require("../models/itemModel");

exports.setItemUserIds = (req, res, next) => {
  if (!req.body.item) req.body.item = req.params.itemId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.checkIfReviewed = catchAsync(async (req, res, next) => {
  const itemId = req.params.itemId;
  const userId = req.user.id;

  const itemReviews = await Review.find({ item: itemId });

  const reviewUser = itemReviews.filter((review) => {
    return review.user.id === userId;
  });

  console.log(reviewUser);

  if (reviewUser.length === 0) {
    return next();
  } else {
    return next(new appError("User Has already reviewed this product.", 400));
  }
});

exports.getSpecificReviews = catchAsync(async (req, res) => {
  /*  const itemId = req.params.itemId;
  const itemReviews = await Review.find({ item: itemId });

  res.status(200).json({
    status: "success",
    results: itemReviews.length,
    data: itemReviews,
  }); */
  // To allow for nested GET reviews on tour (hack)
  let filter = {};
  if (req.params.itemId) filter = { item: req.params.itemId };

  const features = new APIFeatures(Review.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // const doc = await features.query.explain();
  const doc = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: doc.length,
    data: {
      data: doc,
    },
  });
});

exports.getRatingStats = catchAsync(async (req, res) => {
  const itemId = new mongoose.Types.ObjectId(req.params.itemId);
  const stats = await Review.aggregate([
    { $match: { item: itemId } },
    {
      $group: {
        _id: "$rating",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
  console.log(itemId);

  res.status(200).json({
    status: "success",
    data: stats,
  });
});

exports.checkIfReviewAuthor = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;

  const review = await Review.findById(id);
  const user = await User.findById(userId);

  if (!review) return;

  if (review.user.id === req.user.id || user.role === "admin") {
    return next();
  } else {
    return next(new appError("Only the Author can delete his/her review", 403));
  }
});

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.createReview = factory.createOne(Review);
