const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const User = require('../../models/User');


module.exports = {
    register: async (parent, args) => {
      const { email, password } = args;

      // Simple validation
      if (!email || !password) {
        return { msg: 'Please enter all fields', success: false };
      }
    
      try {
        const user = await User.findOne({ email });
        if (user) throw Error('User already exists');
    
        const salt = await bcrypt.genSalt(10);
        if (!salt) throw Error('Something went wrong!');
    
        const hash = await bcrypt.hash(password, salt);
        if (!hash) throw Error('Something went wrong!');
    
        const newUser = new User({
          email,
          password: hash
        });

    
        const savedUser = await newUser.save();
        if (!savedUser) throw Error('Something went wrong saving the user');
    
        const token = jwt.sign({ id: savedUser._id }, "JWT_SECRET", {
          expiresIn: 3600
        });
    
    
        return {
          token,
          id: savedUser.id,
          email: savedUser.email
        };
      } catch (e) {
        return { msg: e.message, success: false };
      }
    },
    login: async (parent, args) => {
      const { email, password } = args;

      // Simple validation
      if (!email || !password) {
        return { msg: 'Please enter all fields' };
      }
    
      try {
        // Check for existing user
        const user = await User.findOne({ email });
        if (!user) throw Error('Invalid credentials');
    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw Error('Invalid credentials');
    
        const token = jwt.sign({ id: user._id }, "JWT_SECRET", { expiresIn: 3600 });
        if (!token) throw Error('Couldnt sign the token');
    
        return {
          token,
          id: user.id,
          email: user.email
        };
      } catch (e) {
        return { msg: e.message, success: false };
      }
    },
}
