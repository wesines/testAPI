const express = require("express");
const User = require("../models/User");
const auth = require("../middelware/auth");
const justify = require("../Controller/justifyText");

const router = express.Router();
router.get("/", function (req, res) {
  console.log("get user");
  res.send(`Bienvenue Veuillez ajouter api/token à l'url pour pouvoir accéder à notre API de justification`);
})
router.post("/api/token", async (req, res, next) => {
  console.log("api/token");
  //Login a registered user && token verification
  try {
    const { email } = req.body;
    //verification of email (format & value)
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!email || !email.match(mailformat)) {
      return res.status(400).send({ error: "Email is missing or wrong" });
    }

    const user = await User.findByCredentials(email);

    if (!user) {
      // Create a new user && token generation
      try {
        const user = new User(req.body);

        await user.save();
        const token = await user.generateAuthToken();

        res.status(201).send({ token: user.token.value });
      } catch (error) {
        res.status(400).send(error);
      }
    }

    // render token
    if (user.token) {
      let currentDate = new Date();
      if (
        currentDate.toLocaleDateString() ===
        user.token.date.toLocaleDateString()
      )
        res.send({ token: user.token.value });
      else {
        const result = await user.generateAuthToken();
        res.send({ token: result.value });
      }
    } else {
      const result = await user.generateAuthToken();
      res.send({ token: result.value });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

const parseRawBody = (req, res, next) => {
  req.setEncoding("utf8");
  req.rawBody = "";

  req.on("data", (chunk) => {
    req.rawBody += chunk;
  });
  req.on("end", () => {
    next();
  });
};
router.use(parseRawBody);
router.post("/api/justify", auth, async (req, res) => {
  

  //verify input text
  if (req.is("text") === "text") {
    //ratelimit verification
   console.log("limit",req.user.token.limit);
   
   let newNumberOfWords = req.user.token.limit + req.rawBody.trim().split(" ").length;
   console.log("newNumberOfWords", newNumberOfWords);
    if (newNumberOfWords >= 700) {
      return res.status(402).send("payment required");
    } else {
      //justify text
      res.setHeader("Content-Type", "text/plain; charset=UTF-8");
      res.send(justify(req.rawBody));
     
      User.findByIdAndUpdate(
        req.user._id,
        { $set: { "token.limit": newNumberOfWords } },
        { new: true },
       (err, doc) => {
        if (!err) {
          console.log(doc);
        } else {
          console.log(  'Error in user update:');
        }
      }
      );

    }
  } else {
    return res.status(500).send("text input missing");
  }
});

module.exports = router;
