const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("../controllers/factoryHandler");
const Email = require("../utils/email");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.newsletterSubscribe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  const EmailUser = await User.findOne({ email: req.body.email });
  if (!EmailUser) {
    return next(new AppError("No user with this Email.", 400));
  } else if (EmailUser.newsletterSub === true) {
    return next(new AppError("Email Already Submitted", 400));
  } else {
    try {
      const subscribedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          newsletterSub: true,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      await new Email(EmailUser).sendNewsLetterConfirmation();
      res.status(200).json({
        status: "success",
        data: {
          user: subscribedUser,
        },
      });
    } catch (err) {
      return next(
        new AppError(
          "There was an error sending the confirmation email. Try again later!"
        ),
        500
      );
    }
  }
});

exports.getUser = factory.getOne(User);
exports.getAllUser = factory.getAll(User);
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);
