const mongoose = require('mongoose')
const { isEmail } = require('validator')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        Username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            // validate: [isEmail, 'Please enter a valid email']
        },
        password: {
            type: String,
            required: true,
        }
    }
)

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;