const mongoose = require ('mongoose');
const bcrypt = require('bcrypt');
const validator = require ('validator');

const Schema = mongoose.Schema

const userSchema = new Schema ({
    email: {
        type: String,
        require: true,
        unique: true
    },
    fname: {
        type: String,
        require: true
    },
    lname: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    resetToken: {
        type: String,
        default: '', 
    },
})

// static signup method
userSchema.statics.signup = async function(email, fname, lname, password, cpassword) {

    // validation
    if (!email || !fname || !lname || !password || !cpassword) {
        throw Error('All fields must be filled')
    }
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid')
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough')
    }
    if (password !== cpassword) {
        throw Error('Passwords do not match')
    }
  
    const exists = await this.findOne({ email })

    if (exists) {
        throw Error('Email already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({email,fname, lname, password: hash})

    return user
}


// static login method
userSchema.statics.login = async function (email, password) {
    
    if (!email || !password) {
        throw Error('All fields must be filled')
    }

    const user = await this.findOne({ email })

    if (!user) {
        throw Error('Incorrect Email')
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        throw Error('Incorrect Password')
    }

    return user  
 
}

// static check email for pw reset method
userSchema.statics.email = async function (email) {
    
    if (!email) {
        throw Error('Please enter email address')
    }

    const user = await this.findOne({ email })

    if (!user) {
        throw Error('Email not found. Please signup')
    }

    return user  
 
}



userSchema.statics.resetpassword = async function (resetToken, newPassword, confirmPassword) {
  try {
    // Validation
    if (!resetToken) {
      throw Error('Invalid reset token');
    }

    const user = await this.findOne({ resetToken });

    if (!user) {
      throw Error('Invalid or expired reset token');
    }

    // Additional validation for new password
    if (!newPassword || !confirmPassword) {
      throw Error('All fields must be filled');
    }

    if (newPassword !== confirmPassword) {
        throw Error('Passwords do not match');
    }

    if (!validator.isStrongPassword(newPassword)) {
      throw Error('Password not strong enough');
    }

    // Check if the new password is the same as the current password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
    throw Error('New password must be different from the current password');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password with the new hashed password
    user.password = hashedPassword;

    // Clear the resetToken after password reset
    user.resetToken = null;

    // Save the user document with the updated password and resetToken
    await user.save();

    return { message: 'Password reset successful. Please login.' };
  } catch (error) {
    throw error;
  }
};





module.exports = mongoose.model('User', userSchema)