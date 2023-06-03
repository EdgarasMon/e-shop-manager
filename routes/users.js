const express = require("express");
const router = express.Router();
const cryptPassword = require("./utils/cryptPassword");
const validateUser = require("./utils/validateUser");
const users = require('../models/user');
const authorization = require("../routes/utils/authorization");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    const user = await users.findOne({ email });
    res.send(user);
  } catch (error) {
    console.error(error);
  }
});

router.get("/token", (req, res) => {
  const payload = {
    name: "user",
    userId: 1,
  }

  const token = jwt.sign(payload, 'secret key');
  res.send(token);
});

router.post("/addUser", async (req, res) => {
  try {
    const { name, surname, email, password, dateOfBirth, gender } = req.body;

    // check if already exist email
    const existEmail = await users.findOne({ email })
    if (existEmail) {
      res.json({ message: "that e-mail already exist", type: "warning" });
      return
    }

    if (name && surname && email && password && dateOfBirth && gender) {
      await users.insertMany({
        name,
        surname,
        email,
        password: await cryptPassword(password),
        dateOfBirth,
        gender,
      });
      res.json({ message: "succesfully saved a user", type: "success" });
    } else {
      res.json({ message: "missing some user data", type: "warning" });
    }
  } catch (error) {
    console.error(error);
    res.json({ message: error, type: "error" });
  }
});

router.post("/login", /*authorization,*/ async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.json({ message: "please provide email and password", type: "error" });
      return
    }
    const userData = await users.findOne({ email });
    const isValid = await validateUser(password, userData.password);

    if (isValid) {
      console.log(isValid);
      res.json({ message: "succesfully loged in", type: "success" });
      // return
    } else {
      res.json({ message: "cannot find user with that email or bad password", type: "error" });
    }
  } catch (error) {
    console.error(error);
    res.json({ message: error, type: "error" });
  }
});


router.put("/profile", /*authorization,*/ async (req, res) => {
  try {
    const { userId, aboutMe } = req.body;
    console.log('/////////////', userId, aboutMe);

    // const result = await users.updateOne({ _id:  }, { $set: { aboutMe } });
    const result = await users.updateOne({ _id: new ObjectId(userId) }, { $set: { aboutMe: 'aboutMe' } });
    // TODO fix this update
    console.log(result);

    if (result.modifiedCount) {
      console.log(result);
      res.json({ message: "succesfully saved info", type: "success" });
      // return
    } else {
      res.json({ message: "cannot find user with that id", type: "error" });
    }
  } catch (error) {
    console.error(error);
    res.json({ message: error, type: "error" });
  }
});

router.post("/addAvatarPhoto", /*authorization,*/ async (req, res) => {
  try {
    //   const { userId, aboutMe } = req.body;
    console.log('/////////////***********************');

    //   // const result = await users.updateOne({ _id:  }, { $set: { aboutMe } });
    //   const result = await users.updateOne({ _id: new ObjectId(userId) }, { $set: { aboutMe: 'aboutMe' } });
    //   // TODO fix this update
    //   console.log(result);

    //   if (result.modifiedCount) {
    //     console.log(result);
    //     res.json({ message: "succesfully saved info", type: "success" });
    //     // return
    //   } else {
    //     res.json({ message: "cannot find user with that id", type: "error" });
    //   }
  } catch (error) {
    console.error(error);
    res.json({ message: error, type: "error" });
  }
});

module.exports = router;
