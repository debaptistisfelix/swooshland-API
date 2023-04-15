const Item = require("../models/itemModel");
const appError = require("../utils/appError");

const catchAsync = require("../utils/catchAsync");
const factory = require("./factoryHandler");

exports.updateSize = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const chosenSize = req.body.EUSize;

  const item = await Item.findById(id);

  if (!item) {
    return next(new appError("No Item found", 404));
  }

  const sizeIndex = item.availableSizes.findIndex(
    (el) => el.EUSize === chosenSize
  );

  if (sizeIndex === -1) {
    return next(new appError("Size option not found for this Item", 404));
  }

  item.availableSizes[sizeIndex].itemsAvailable -= 1;
  await item.save();

  res.status(200).json({
    status: "success",
    data: item,
    message: "Inventory was succesfully updated",
  });
});

exports.createManyItems = catchAsync(async (req, res, next) => {
  const newItems = await Item.insertMany(req.body);

  if (!newItems) {
    return next(new appError("There was a problem when inserting docs", 403));
  }

  res.status(201).json({
    status: "success",
    data: {
      data: newItems,
    },
    message: "Items created",
  });
});

exports.getAllItems = factory.getAll(Item);
exports.getItem = factory.getOne(Item, { path: "reviews" });
exports.createItem = factory.createOne(Item);
exports.updateItem = factory.updateOne(Item);
exports.deleteItem = factory.deleteOne(Item);
