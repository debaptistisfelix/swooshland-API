const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  items: [],
  itemsIds: [],
  shippingCost: {
    type: Number,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  address: {
    type: Object,
    required: [true, "An Order must have an Address"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["Processing Order", "Order Shipped", "Order Delivered"],
    default: "Processing Order",
  },
});

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "_id",
  });
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
