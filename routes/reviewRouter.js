const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");

router.route("/specific").get(reviewController.getSpecificReviews);

router.route("/getRatingStats").get(reviewController.getRatingStats);

router.use(authController.protect);

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.setItemUserIds,
    reviewController.checkIfReviewed,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo("user", "admin"),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo("user", "admin"),
    reviewController.checkIfReviewAuthor,
    reviewController.deleteReview
  );

module.exports = router;
