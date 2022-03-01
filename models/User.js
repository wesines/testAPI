const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema({
  email: {
    type: String,
  },

      token: {
        value: {
          type: String,
         
        },
        date: {
          type: Date,
         
        },
        limit: {
          type: Number,
          
        },
      },
    
});

userSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the user
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
  user.token={
    value:token,
    date:new Date(),
    limit:0
  }
 // user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email) => {
  // Search for a user by email
 
  const user = await User.findOne({ email });
 

  if (!user) {
  
    return null;
   // throw new Error({ error: "Invalid login credentials" });
  }

  return user;
};


userSchema.methods.updateLimit = async function () {
  // Generate an auth token for the user
  const user = this;
  user.token.limit = user.token.limit +6;
  // user.tokens = user.tokens.concat({ token });
  await user.save();
  return user;
};


const User = mongoose.model("User", userSchema);

module.exports = User;
