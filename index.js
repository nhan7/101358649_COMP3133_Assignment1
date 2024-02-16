
var express = require('express')
var  {graphqlHTTP } = require('express-graphql')
var { buildSchema } = require('graphql')
var mongoose = require('mongoose')
const User = require('./models/Users')
const Employee = require('./models/Employee')
const bcrypt = require('bcrypt')

const uri = "mongodb+srv://dbUser:nguyenvan2W@cluster0.ujphzpd.mongodb.net/comp3133_assignment1?retryWrites=true&w=majority"

mongoose.connect(uri, {
    useNewUrlParser:true,
    useUnifiedTopology:true})
    .then(()=> console.log('MongoDB Connected'))
    .catch(err=>console.error('MongoDB connection error:', err))


var schema = buildSchema(
    `type Mutation{
        signUp(username: String!, email:String!, password: String!) : User!
        
        createEmployee(first_name:String!, last_name:String!, email:String!, gender: String! ,salary: Float!) : Employee!
        updateEmployee(eid: ID!, first_name:String!, last_name:String!, email:String!, gender:String!, salary:Float! ): Employee!
        deleteEmployee(eid: ID!): Employee!

    }
    type User{
    
        username:String!
        email:String!
        password:String!
    }
    type Query{
        login(email:String!, password:String!): User!
        getAllEmployees: [Employee]
        getEmployeeById(eid: ID!): Employee!

    }
    type Employee{
        eid:ID!
        first_name:String!
        last_name:String!
        email:String!
        gender:String!
        salary: Float!

    }
 
 
   

    `
);



var root = {
    // mutation
    signUp:async ({username, email, password}) =>{
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username, 
            email,
            password: hashedPassword
        })
        return newUser.save()
    },
    // query
    login:async ({email, password}) =>{
        const user = await User.findOne({email})

        if(!user){
            throw new Error("user not found")
        }
        console.log("Plain-text password:", password);
        console.log("Hashed password from database:", user.password);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch)


        if (!isMatch) {
            throw new Error("Incorrect password");
        }
        return user.toJSON()
    },
    // mutation
    createEmployee:async({first_name, last_name, email, gender, salary}) => {
        const newEmployee = new Employee({
            first_name, last_name, email, gender, salary
        })

        const savedEmployee = await newEmployee.save()
        return savedEmployee

    },
        // mutation

    updateEmployee:async ({eid, first_name, last_name, email, gender, salary}) => {
        const employee = await Employee.findByIdAndUpdate(eid, {first_name, last_name, email, gender, salary}, {new: true})
        if(!employee){
            throw new Error("Employee not found")
        }
        return employee
    },
        // mutation

    deleteEmployee: async({eid}) => {
        const employee = await Employee.findByIdAndDelete(eid)
        if(!employee){
            throw new Error("Employee not found")
        }
        return employee
    },
    // query
    getAllEmployees:async () => {
        const employees = await Employee.find()
        return employees
    },
    getEmployeeById: async ({eid}) => {
        const employee = await Employee.findById(eid)
        console.log(employee)
        if(!employee){
            throw new Error("ID does not exist")
        }
        return employee
    }
}

var app = express()

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))

app.listen(4000, () => console.log("Express GraphQL Server Now Running On http://localhost:4000/graphql"))