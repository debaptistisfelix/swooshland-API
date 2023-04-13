const express = require("express");
const router = express.Router({ mergeParams: true });
const cartItemController = require("../controllers/cartItemController");
const authController = require("../controllers/authController");

router.use(authController.protect);

router
  .route("/")
  .get(cartItemController.getAllItems)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    cartItemController.setCartItemUserIds,
    cartItemController.checkSizesAvailability,
    cartItemController.createItem
  )
  .delete(
    cartItemController.updateItemsAfterCartItemsDeletion,
    cartItemController.deleteAll
  );

router
  .route("/:id")
  .get(cartItemController.getItem)
  .patch(cartItemController.updateItem)
  .delete(
    cartItemController.updateItemAfterCartItemDeletion,
    cartItemController.deleteItem
  );

module.exports = router;
