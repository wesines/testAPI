const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
let data=""
  const token = req.header("Authorization").replace("Bearer ", "");
  try{
    data = jwt.verify(token, process.env.JWT_KEY);
    req.token = token;
    req.id = data._id;
  
     const user = await User.findOne({ _id: data._id, "token.value": token });
      if (!user) {
        throw new Error();
      }
     req.user = user;

    next();

  }catch{
   res.status(401).send({ error: "Token invalid" });
   return null;

  }
};
module.exports = auth;
