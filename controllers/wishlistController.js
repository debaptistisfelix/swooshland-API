const Wishlist = require("../models/wishlistModel");
const factory = require("./factoryHandler");
const catchAsync = require("../utils/catchAsync");

exports.setWishlistUserIds = (req, res, next) => {
  if (!req.body.wishlist) req.body.wishlist = req.params.wishlistId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllWishlistItems = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const wishlistItems = await Wishlist.find({ user: userId });

  res.status(200).json({
    status: "success",
    data: {
      wishlistItems,
    },
  });
});

exports.getWishlistItem = factory.getOne(Wishlist);
exports.createWishlistItem = factory.createOne(Wishlist);
exports.updateWishlistItem = factory.updateOne(Wishlist);
exports.deleteWishlistItem = factory.deleteOne(Wishlist);
