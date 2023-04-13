const express = require("express");
const router = express.Router({ mergeParams: true });
const wishlistController = require("../controllers/wishlistController");
const authController = require("../controllers/authController");

router.use(authController.protect);

router
  .route("/")
  .get(wishlistController.getAllWishlistItems)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    wishlistController.setWishlistUserIds,
    wishlistController.createWishlistItem
  );

router
  .route("/:id")
  .get(wishlistController.getWishlistItem)
  .patch(wishlistController.updateWishlistItem)
  .delete(wishlistController.deleteWishlistItem);

module.exports = router;
