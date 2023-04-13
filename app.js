const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const appError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");

// ROUTES
const itemRouter = require("./routes/itemRouter");
const userRouter = require("./routes/userRouter");
const reviewRouter = require("./routes/reviewRouter");
const cartItemRouter = require("./routes/cartItemRouter");
const addressRouter = require("./routes/addressRouter");
const orderRouter = require("./routes/orderRouter");
const wishlistRouter = require("./routes/wishlistRouter");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(helmet());

process.env.NODE_ENV === "dev" && app.use(morgan("dev"));

app.use(express.json());
app.use(cors());
app.use(express.static(`${__dirname}/public`));

const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP Address",
});
app.use("/api", limiter);

app.use(mongoSanitize());

app.use(xss());

app.use(
  hpp({
    whitelist: ["duration", "ratingsQuantity", "ratingsAverage", "price"],
  })
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/items", itemRouter);
app.use("/api/users", userRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/cartItems", cartItemRouter);
app.use("/api/addresses", addressRouter);
app.use("/api/orders", orderRouter);
app.use("/api/wishlist", wishlistRouter);

app.all("*", (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
