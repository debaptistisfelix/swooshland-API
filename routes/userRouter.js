const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const cartItemRouter = require("../routes/cartItemRouter");
const addressRouter = require("../routes/addressRouter");
const wishlistRouter = require("../routes/wishlistRouter");
const orderRouter = require("./orderRouter");
const router = express.Router();

// SIGN-UP ROUTE
router.route("/signup").post(authController.singup);
// LOGIN ROUTE
router.route("/login").post(authController.login);
// FORGOT PASSWORD ROUTE
router.route("/forgotpassword").post(authController.forgotPassword);
// RESET PASSWORD ROUTE
router.route("/resetPassword/:token").patch(authController.resetPassword);

// Middleware to protect all routes from here on
router.use(authController.protect);

// SUBSCRIBE TO NEWSLETTER
router
  .route("/newsletterSub")
  .patch(userController.getMe, userController.newsletterSubscribe);

// UPDATE MY PASSWORD ROUTE
router.route("/updateMyPassword").patch(authController.updatePassword);

// GET /ME ENDPOINT
router.route("/me").get(userController.getMe, userController.getUser);

// UPDATE MY INFOS ROUTE
router.route("/updateMe").patch(userController.updateMe);

router.use("/:userId/cartItems", cartItemRouter);
router.use("/:userId/addresses", addressRouter);
router.use("/:userId/orders", orderRouter);
router.use("/userId/wishlist", wishlistRouter);

// ONLY ADMIN ACCESSIBLE ROUTES
/* router.use(authController.restrictTo("admin")); */

router.route("/").get(userController.getAllUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
