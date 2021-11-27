var express = require("express");
var router = express.Router();
const User = require("../models/users");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/register", function (req, res, next) {
  // Get age, profession from req.body
  const age = req.body.age;
  const profession = req.body.profession;
  const gender = req.body.gender;
  if (!age || !profession || !gender) {
    return res.status(400).send({
      message: "failed. Age, Profession or Gender not provided",
    });
  }
  // Get all content types from users from db
  User.find({}, function (err, users) {
    if (err) {
      console.log(err);
      res.status(400).send({ failed: err });
    } else {
      let ct = [];
      users.forEach(function (user) {
        ct.push(user.content_type);
      });
      // Count all unique content types from ct
      let count = { 0: 0, 1: 0, 2: 0, 3: 0 };
      ct.forEach(function (i) {
        count[i] = (count[i] || 0) + 1;
      });
      console.log(ct);
      console.log(count);
      let least_used = 0;
      // Check if count is empty
      if (Object.keys(count).length > 0) {
        // Get the least used content type
        least_used = Object.keys(count).reduce(function (a, b) {
          return count[a] < count[b] ? a : b;
        });
        console.log(least_used);
      }
      // Save user to db
      const user = new User({
        age,
        profession,
        content_type: least_used,
        gender,
      });
      user
        .save()
        .then(() => {
          // Send user_id and content_type to client
          res.status(200).send({
            user_id: user._id,
            content_type: least_used,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send({ message: "failed" });
        });
    }
  });
});

// Submit post
router.post("/submit", function (req, res, next) {
  // Get user_id, time_taken, answers from req.body
  const user_id = req.body.user_id;
  const time_taken = req.body.time_taken;
  const answers = req.body.answers;
  if (!user_id || !time_taken || !answers) {
    return res.status(400).send({
      message: "failed. User_id, Time_taken or Answers not provided",
    });
  }
  // Get user from db
  User.findById(user_id, function (err, user) {
    if (err) {
      console.log(err);
      res.status(400).send({ failed: err });
    } else if (user) {
      // Update user with new answers and time_taken
      user.answers = answers;
      user.time_taken = time_taken;
      user.save();
      // Send success message to client
      res.send({
        success: true,
      });
    } else {
      res.status(400).send({
        message: "failed. User not found",
      });
    }
  });
});

// Get user details by id
router.get("/user/:id", function (req, res, next) {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({
      message: "failed. User_id not provided",
    });
  }
  // Get user from db
  User.findById(id, function (err, user) {
    if (err) {
      console.log(err);
      res.status(400).send({ failed: err });
    } else if (user) {
      // Send user details to client
      res.send({
        user: user,
      });
    } else {
      res.status(400).send({
        message: "failed. User not found",
      });
    }
  });
});

// Get all users
router.get("/users", function (req, res, next) {
  // Get all users from db
  User.find({}, function (err, users) {
    if (err) {
      console.log(err);
      res.status(400).send({
        message: "failed. Users not found",
      });
    } else {
      // Send users to client
      res.send({
        users: users,
      });
    }
  });
});

module.exports = router;
