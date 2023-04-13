const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const authController = require("../controllers/authController");
const reviewRouter = require("../routes/reviewRouter");

router
  .route("/")
  .get(itemController.getAllItems)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    itemController.createItem
  );

router
  .route("/insertItems")
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    itemController.createManyItems
  );

router
  .route("/:id")
  .get(itemController.getItem)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    itemController.updateItem
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    itemController.deleteItem
  );

router.route("/:id/updateInventory").patch(itemController.updateSize);

router.use("/:itemId/reviews", reviewRouter);

module.exports = router;
