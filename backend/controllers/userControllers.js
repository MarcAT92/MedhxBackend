const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// create token with customizable expiration time
const createToken = (_id, secret, expiresIn) => {
  if (expiresIn === '') {
    // If expiresIn is an empty string, set the token to never expire
    return jwt.sign({ _id }, secret);
  } else {
    // Otherwise, set the specified expiration time
    return jwt.sign({ _id }, secret, { expiresIn });
  }
};

// send email function
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADD,
    pass: process.env.EMAIL_PW,
  },
});

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // create a token
    const token = createToken(user._id, process.env.SECRET, '5d');
    
    // Include the username in the response
    const responseData = {
      email,
      username: user.fname, // Add the username field
      token,
    };

    res.status(200).json(responseData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

};

// signup user
const signupUser = async (req, res) => {
  const { email, fname, lname, password, cpassword } = req.body;

  try {
    const user = await User.signup(email, fname, lname, password, cpassword);

    // create a token
    const token = createToken(user._id, process.env.SECRET, '');

    res.status(200).json({ email, fname, lname, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


//forgot password test
  const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.email(email);

      // create a token for password reset
      const resetToken = createToken(user._id, process.env.RESET_PW, '5m' );

      user.resetToken = resetToken;
      await user.save();

      // Send the reset token to the user's email
      await sendResetPasswordEmail(user.email, resetToken);
  
      res.status(200).json({ email, resetToken  });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  
  // Function to send reset password email
  const sendResetPasswordEmail = async (email, resetToken) => {
     
 // Define email content
  const mailOptions = {
    from: `${process.env.EMAIL_ADD}`,
    to: email,
    subject: 'Password Reset',
    html: `
      <h1>MedHxTT Password Reset</h1>
      <h2>Link Expires in (5) minutes</h2>
      <p>Click the following link to reset your password:</p>
      <a href="${process.env.HOST}/reset-password/${resetToken}">Click here</a>
      <p>MedhxTT Support-Team</p>
    `,
  };
  
    // Send the email
    await transporter.sendMail(mailOptions);
  };
  

//Function to reset user password 
  const resetPassword = async (req, res) => {
    const { resetToken } = req.params;
    const { newPassword, confirmPassword } = req.body

    try {
      const user = await User.resetpassword(resetToken, newPassword, confirmPassword);
    
      res.status(200).json({ user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }

  };
  

  







module.exports = { signupUser, loginUser, forgotPassword, resetPassword };
