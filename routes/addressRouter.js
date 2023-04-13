const express = require("express");
const router = express.Router({ mergeParams: true });
const addressController = require("../controllers/addressController");
const authController = require("../controllers/authController");

router.use(authController.protect);

router
  .route("/")
  .get(addressController.getAllAddresses)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    addressController.setAddressUserIds,
    addressController.createAddress
  )
  .delete(addressController.deleteAll);

router
  .route("/:id")
  .get(addressController.getAddress)
  .patch(addressController.updateAddress)
  .delete(addressController.deleteAddress);

module.exports = router;
