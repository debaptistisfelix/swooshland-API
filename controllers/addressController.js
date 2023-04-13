const Address = require("../models/addressModel");
const factory = require("./factoryHandler");
const catchAsync = require("../utils/catchAsync");

exports.setAddressUserIds = (req, res, next) => {
  if (!req.body.address) req.body.address = req.params.addressId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllAddresses = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const addresses = await Address.find({ user: userId });

  res.status(200).json({
    status: "success",
    data: {
      addresses,
    },
  });
});

exports.deleteAll = catchAsync(async (req, res) => {
  const userId = req.user.id;
  await Address.deleteMany({ user: { _id: userId } });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getAddress = factory.getOne(Address);
exports.createAddress = factory.createOne(Address);
exports.updateAddress = factory.updateOne(Address);
exports.deleteAddress = factory.deleteOne(Address);
