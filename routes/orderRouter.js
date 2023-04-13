const express = require("express");
const router = express.Router({ mergeParams: true });
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");

router.use(authController.protect);

router
  .route("/")
  .get(orderController.getAllUsersOrders)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    orderController.setOrderUserIds,
    orderController.createOrder
  );

router.route("/orderDetails/:itemIdToFind").get(orderController.findOrder);

router
  .route("/orderList")
  .get(authController.restrictTo("admin"), orderController.getAllOrders);

router
  .route("/:id")
  .get(orderController.getOrder)
  .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder);

module.exports = router;
