const Order = require("../models/orderModel");
const factory = require("./factoryHandler");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Email = require("../utils/email");

exports.setOrderUserIds = (req, res, next) => {
  if (!req.body.order) req.body.order = req.params.orderId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllUsersOrders = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const orders = await Order.find({ user: userId });

  res.status(200).json({
    status: "success",
    data: {
      orders,
    },
  });
});

exports.findOrder = catchAsync(async (req, res, next) => {
  const itemIdToFind = req.params;
  const userId = req.user.id;
  const orders = await Order.find({ user: userId });
  const itemsIdsArrays = orders.map((order) => {
    return order.itemsIds;
  });
  const itemIds = itemsIdsArrays.flat();

  if (itemIds.includes(itemIdToFind.itemIdToFind)) {
    console.log("You have ordered this");
  } else {
    console.log("NEVER ORDERED");
    return next(
      new AppError("You need to buy the Item to leave a review", 400)
    );
  }

  res.status(200).json({
    status: "success",
    data: true,
    message: "User has bought this item",
  });
});

exports.getAllOrders = factory.getAll(Order);
exports.getOrder = factory.getOne(Order);
exports.createOrder = factory.createOne(Order);
exports.updateOrder = factory.updateOne(Order);
exports.deleteOrder = factory.deleteOne(Order);
