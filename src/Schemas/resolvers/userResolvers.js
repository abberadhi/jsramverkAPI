const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const User = require('../../models/User');


module.exports = {
    register: async (parent, args) => {
      const { email, password } = args;

      // Simple validation
      if (!email || !password) {
        console.log("enter try");
        return { msg: 'Please enter all fields', success: false };
      }
    
      try {
        console.log("enter try");
        const user = await User.findOne({ email });
        if (user) throw Error('User already exists');
    
        const salt = await bcrypt.genSalt(10);
        if (!salt) throw Error('Something went wrong with bcrypt');
    
        const hash = await bcrypt.hash(password, salt);
        if (!hash) throw Error('Something went wrong hashing the password');
    
        const newUser = new User({
          email,
          password: hash
        });
    
        console.log("enter try2");
    
        const savedUser = await newUser.save();
        if (!savedUser) throw Error('Something went wrong saving the user');
    
        const token = jwt.sign({ id: savedUser._id }, "JWT_SECRET", {
          expiresIn: 3600
        });
    
        console.log("enter try3");
    
        return {
          token,
          id: savedUser.id,
          email: savedUser.email
        };
      } catch (e) {
        console.log("fail", e);
        return { msg: e.message, success: false };
      }
    }
}
