const express = require("express");
require('dotenv').config();
const schema = require('./schema/schema')
const port = process.env.PORT || 5000;
const cors = require('cors');
const {graphqlHTTP} = require("express-graphql")

const connectDB = require('./config/db')

const app = express();

//connect to database
connectDB(); 

app.use(cors());

app.use('/graphql',graphqlHTTP({
schema,
graphiql: process.env.NODE_ENV === 'development'
}));

app.listen(port,()=>{
    console.log(`server is runnning on port ${port}`)
})