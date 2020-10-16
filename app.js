const express = require("express");
const path = require("path");
const session = require("express-session");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const passport = require("passport");

dotenv.config({ path: "./config/config.env" });

// Passport config
require("./utils/passport")(passport);

// Models
const Place = require("./models/Place");
const User = require("./models/User");

const app = express();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected.."))
  .catch((err) => console.log(err));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// IMPORTANT TO BE IN THIS PLACE VVV
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/info", (req, res, next) => {
  if (req.isAuthenticated()) {
    return res
      .status(200)
      .json({ authenticated: true, username: req.user.username });
  }
  res.json({ authenticated: false, username: null });
});
app.get("/api/places", async (req, res) => {
  try {
    const places = await Place.find();

    return res.status(200).json({
      success: true,
      count: places.length,
      data: places,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server error" });
  }
});
app.post("/api/places", async (req, res, next) => {
  try {
    const place = await Place.create(req.body);

    return res.status(200).json({
      success: true,
      data: place,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ error: "store already exists" });
    }
    res.status(500).json({ error: "server error" });
  }
});
app.put("/api/places", async (req, res, next) => {
  const { name } = req.body;
  const { coordinates } = req.body.location;
  const place = await Place.findOne({ name: name });
  // place.reviews.map(async arrayElement => {
  //     if (arrayElement.username == req.body.pushReview.username) {
  //         return res.status(400).json({ error: 'A review of user already exists' })
  //     } else {

  //     }
  // });
  try {
    place.reviews.push({
      username: req.body.pushReview.username,
      rating: req.body.pushReview.rating,
      review: req.body.pushReview.review,
    });

    await place.save();
    res.json({ msg: "Review pushed to database" });
  } catch (err) {
    console.log(err);
  }
});

app.post("/register.html", async (req, res) => {
  const { username, email, password, password2 } = req.body;
  let errors = [];

  // Checks for different errors
  if (!username || !email || !password || !password2) {
    errors.push({ msg: "Please fill all fields" });
  }

  if (password !== password2) {
    errors.push({ msg: "Passwords don't match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password should be more than 6 characters" });
  }

  // Response
  if (errors.length > 0) {
    res.status(400).json({ success: false, errors });
  } else {
    const user = await User.findOne({ email: email });

    if (user) {
      // User exists
      errors.push({ msg: "Email is already registered" });
      res.status(403).json({ success: false, errors });
    } else {
      const newUser = new User({
        username,
        email,
        password,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;

          newUser.password = hash;

          newUser
            .save()
            .then((user) => {
              res.status(200).json({
                success: true,
                msg: "You are now registered and can log in",
              });
            })
            .catch((err) => console.log(err));
        });
      });
    }
  }
});
app.post("/login.html", passport.authenticate("local"), (req, res) => {
  res.status(200).send("Authorized");
});
app.get("/logout", (req, res) => {
  req.logout();
  res.json({ message: "User is logged out" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
