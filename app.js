if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local");

const booksRoutes = require("./router/book");
const reviewsRoutes = require("./router/review");
const userRoutes = require("./router/users");
const User = require("./models/user");
const mongoSanitize = require('express-mongo-sanitize')

main().catch((err) => {
  console.log("error");
  console.log(err);
});

async function main() {
  await mongoose.connect("mongodb://localhost:27017/Book-Store");
  console.log("Database Connected");
}

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
app.use(mongoSanitize())

passport.serializeUser(User.serializeUser()); //store user in session
passport.deserializeUser(User.deserializeUser()); //get out the user from session

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.use("/bookStore", booksRoutes);
app.use("/bookStore/:id/reviews", reviewsRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "something went wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(4000, () => {
  console.log("serving on port 4000");
});
