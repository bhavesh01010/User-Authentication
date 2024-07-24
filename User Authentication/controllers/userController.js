const userModel = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isEmail } = require("validator");
// const { CLOSING } = require('ws');
const transporter = require("../config/emailConfig.js")

class UserController {
  static userRegistration = async (req, res) => {
    const { name, Username, email, password, password_confirmation } = req.body;
    const user = await userModel.findOne({ email: email });
    if (!isEmail(email)) {
      res.send({ "status": "failed", "message": "Please enter a valid email" });
    } else {
      if (user) {
        res.send({ "status": "failed", "message": "Email already exists" });
      } else {
        if (name && Username && email && password && password_confirmation) {
          if (password === password_confirmation) {
            try {
              const salt = await bcrypt.genSalt(10);
              const hashPassword = await bcrypt.hash(password, salt);
              const user = new userModel({
                name: name,
                Username: Username,
                email: email,
                password: hashPassword,
              });
              await user.save();
              //Generate JWT token
              const saved_user = await userModel.findOne({email:email})
              const token = jwt.sign({userId:saved_user._id}, 'key', {expiresIn: '60m'})
              res.cookie('jwt', token, { maxAge: 1000000000})
              res.send({"status": "success", "message": "Registration successs", "token": token})
            } catch (err) {
              res.send({ "status": "failed", "message": "Unable to register" });
            }
          } else {
            res.send({
              "status": "failed",
              "message": "password and password_confirmation do not match",
            });
          }
        } else {
          res.send({ "status": "failed", "message": "All fields are required" });
        }
      }
    }
  };
  static userLogin = async(req,res)=>{
    try{
        const {email, password} = req.body;
        if(email && password){
            const user = await userModel.findOne({email: email})
            if(user){
                const isMatch = await bcrypt.compare(password,user.password)
                if(isMatch){
                    const token = jwt.sign({userId:user._id}, 'key', {expiresIn: '6000d'})
                    res.cookie('jwt', token, { maxAge: 1000000000})
                    res.send({"status": "success","message": "Login succeessful", "token": token})
                }else{
                    res.send({"status": "failed", "message": "Wrong email or password"})
                }
            }else{
                res.send({"status": "failed", "message": "Wrong email or password"})
            }
        }else{
            res.send({"status": "failed", "message": "All fields are required"})
        }
    }catch(err){
        console.log(err)
        res.send({"status": "failed", "message": "Unable to login"})
    }
  }

  // change password
  static changePassword = async(req,res)=>{
    const {password,password_confirmation} = req.body;
    if(password && password_confirmation){
        if(password !== password_confirmation){
            res.send({"status": "failed", "message": "New password and Confirm new password do not match"})
        }else{
            const salt = await bcrypt.genSalt(10)
            const newHashPassword = await bcrypt.hash(password, salt)
            await userModel.findByIdAndUpdate(req.user, { $set: { password: newHashPassword } })
            res.send({"status": "success", "message": "Password successfully changes"})
        }
    }else{
        res.send({"status": "failed", "message": "All fields are required"})
    }
  }

  // logged in user details
  static loggedUser = async (req,res)=>{
    const user = await userModel.findOne({_id: req.user}).select('-password')
    res.send(user)
  }

  // forgot password
  static sendUserPasswordResetLink = async (req,res)=>{
    const { email } = req.body
    if(email){
      const user = await userModel.findOne({ email: email })
      if(user){
        const secret = user._id + 'key'
        const token = jwt.sign({userId: user._id}, secret , { expiresIn: '15m' })
        const link = `http://localhost:8080/api/user/reset-password/${user._id}/${token}`
        console.log(link)
        // send email
        let info = await transporter.sendMail({
          from: 'bhaveshgautam2302@gmail.com',
          to: user.email,
          subject: "Password reset link",
          html: `<a href=${link}>Click here</a> to reset yout password`
        })
        res.send({"status": "success", "message": "Password reset email has been sent... Please check your email"})
      }else{
        res.send({"status": "failed", "message": "Not a registered email" })
      }
    }else{
      res.send({"status": "failed", "message": "Please enter email"})
    }
  }

  // reset password link
  static userPasswordReset = async(req,res)=>{
    const {password, password_confirmation} = req.body
    const {id, token} = req.params
    const user = await userModel.findById(id)
    const new_secret = user._id + 'key'
    try{
      jwt.verify(token, new_secret)
      if(password && password_confirmation){
        if(password !== password_confirmation){
          res.send({"status": "failed", "message": "New passwprd and confirm new passwprd does not match"})
        }else{
          const salt = await bcrypt.genSalt(10)
          const newHashPassword = await bcrypt.hash(password, salt)
          await userModel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } })
          res.send({"status": "success", "message": "Password has been changed successfully"})
        }
      }
    }catch(err){
      res.send({"status": "failed" , "message":"Invalid token"})
    }
  }
}

module.exports = UserController;
