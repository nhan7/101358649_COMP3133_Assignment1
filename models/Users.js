const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    username:{
        type: String,
        required:true,
        unique:true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type:String
    }

})

const User = mongoose.model("User", UserSchema)
module.exports = User