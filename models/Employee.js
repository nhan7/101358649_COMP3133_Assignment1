const mongoose = require('mongoose')


const EmployeeSchema = mongoose.Schema({
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true
    },
    gender:{
        type:String,
        enum:["Male","Female","Other"]
    },
    salary:{
        type:Number,
        required:true
    }
    
})


const Employee = mongoose.model('Employee', EmployeeSchema)
module.exports = Employee