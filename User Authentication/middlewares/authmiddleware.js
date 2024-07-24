const jwt = require('jsonwebtoken')
const userModel = require('../models/user.js')

const requireAuth = (req,res, next)=>{
    const token = req.cookies.jwt

    if(token){
        jwt.verify(token,'key', (err,decodedToken)=>{
            if(err){
                console.log(err.messsage)
                res.send({"status": "failed", "message": "Login again"})
            } else{
                const { userId } = jwt.verify(token,'key')
                req.user = userId;
                // const data = userModel.findOne({_id:userId}).select('-password').then(
                //     data => {req.user = data
                //     console.log(req.user)}
                //   );
                // console.log(x.name)
                // console.log(userModel.findOne({_id:userId}))
                next();
            }
        })
    }
    else{
        res.send({"status": "failed", "message": "Login again"})
    }
}
module.exports = { requireAuth }