const CartItem = require("../models/cartItemModel");
const Item = require("../models/itemModel");
const factory = require("./factoryHandler");
const catchAsync = require("../utils/catchAsync");
const fuckError = require("../utils/fuckError");

// Function to check if you can actually add item to Cart based on Availability
exports.checkSizesAvailability = catchAsync(async (req, res, next) => {
  const itemId = req.body.itemId;
  const chosenSize = req.body.chosenSize;

  const item = await Item.findById(itemId);

  if (!item) return next(new fuckError("No item with this id was found", 404));

  const sizeIndex = item.availableSizes.findIndex(
    (el) => el.EUSize === chosenSize
  );

  if (sizeIndex === -1) return next(new fuckError("Size non found", 404));

  if (
    item.availableSizes[sizeIndex].itemsAvailable <=
    item.availableSizes[sizeIndex].reserved
  ) {
    return next(
      new fuckError(
        "All Items in this Size have been reserved. Check later if they're available again",
        403
      )
    );
  } else if (
    item.availableSizes[sizeIndex].itemsAvailable >
    item.availableSizes[sizeIndex].reserved
  ) {
    console.log("Enough availability to put in cart");
    req.item = item;
    next();
  }
});

exports.setCartItemUserIds = (req, res, next) => {
  if (!req.body.cartItem) req.body.cartItem = req.params.cartItemId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllItems = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const cartItems = await CartItem.find({ user: userId });

  res.status(200).json({
    status: "success",
    data: {
      cartItems,
    },
  });
});

exports.createItem = catchAsync(async (req, res, next) => {
  const item = req.item;
  const chosenSize = req.body.chosenSize;

  const cartItem = await CartItem.create(req.body);

  if (!cartItem) {
    return next(new fuckError("Error during creation of cartItem", 400));
  }

  const sizeIndex = item.availableSizes.findIndex(
    (el) => el.EUSize === chosenSize
  );

  if (sizeIndex === -1) {
    return next(new fuckError("Size option not found for this Item", 404));
  }

  item.availableSizes[sizeIndex].reserved += 1;
  await item.save();

  res.status(201).json({
    status: "success",
    data: {
      data: cartItem,
    },
    message:
      "Item was reserved for 10 min. Check out before reservation expires.",
  });
});

exports.updateItemAfterCartItemDeletion = catchAsync(async (req, res, next) => {
  const cartItem = await CartItem.findById(req.params.id);

  if (!cartItem) {
    return next(new fuckError("No Document with this ID", 404));
  }

  const itemId = cartItem.itemId;
  const chosenSize = cartItem.chosenSize;

  const item = await Item.findById(itemId);

  if (!item) {
    return next(new fuckError("Error during search for item", 400));
  }

  const sizeIndex = item.availableSizes.findIndex(
    (el) => el.EUSize === chosenSize
  );

  if (sizeIndex === -1) {
    return next(new fuckError("Size option not found for this Item", 404));
  }

  item.availableSizes[sizeIndex].reserved -= 1;
  await item.save();

  next();
});

exports.updateItemsAfterCartItemsDeletion = catchAsync(
  async (req, res, next) => {
    const cartItems = await CartItem.find({ user: { _id: req.user.id } });
    console.log(cartItems);

    if (!cartItems) {
      return next(new fuckError("No Documents with this ID were found", 404));
    }

    for (const cartItem of cartItems) {
      const itemId = cartItem.itemId;
      const chosenSize = cartItem.chosenSize;

      const item = await Item.findById(itemId);

      if (!item) {
        return next(new fuckError("No Document found with this Id", 404));
      }

      let sizeIndex = -1;
      for (let i = 0; i < item.availableSizes.length; i++) {
        if (item.availableSizes[i].EUSize === chosenSize) {
          sizeIndex = i;
          break;
        }
      }

      if (sizeIndex === -1) {
        return next(
          new fuckError("Size Option not available for this Product", 404)
        );
      }

      item.availableSizes[sizeIndex].reserved -= 1;
      item.availableSizes[sizeIndex].itemsAvailable -= 1;
      item.save();
    }
    next();
  }
);

exports.deleteItem = catchAsync(async (req, res, next) => {
  const doc = await CartItem.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new fuckError("No document found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
    message: "Cart item was removed and your reserved size was cancelled",
  });
});

exports.deleteAll = catchAsync(async (req, res) => {
  const userId = req.user.id;

  await CartItem.deleteMany({ user: { _id: userId } });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

const updateInventoryAfterExpiration = catchAsync(async (cartItem) => {
  const itemId = cartItem.itemId;
  const chosenSize = cartItem.chosenSize;

  const item = await Item.findById(itemId);

  if (!item) {
    return next(new fuckError("No Document found with tihs ID", 404));
  }

  const sizeIndex = item.availableSizes.findIndex(
    (el) => el.EUSize === chosenSize
  );

  if (sizeIndex === -1) {
    throw new fuckError("Size option not found for this Item", 404);
  }

  item.availableSizes[sizeIndex].reserved -= 1;
  await item.save();
});

exports.deleteExpiredCartItems = catchAsync(async (req, res, next) => {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  const cartItems = await CartItem.find({ createdAt: { $lt: tenMinutesAgo } });

  console.log(`${cartItems.length} cartItems have expired !`);
  for (const cartItem of cartItems) {
    await updateInventoryAfterExpiration(cartItem);
    await CartItem.findByIdAndDelete(cartItem._id);
  }
});

/* exports.getAllItems = factory.getAll(CartItem); */
exports.getItem = factory.getOne(CartItem);
/* exports.createItem = factory.createOne(CartItem); */
exports.updateItem = factory.updateOne(CartItem);
/* exports.deleteItem = factory.deleteOne(CartItem); */
