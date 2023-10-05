const express = require("express") ; 
const app = express() ;
const axios = require("axios") ;
const router = require("./routes/route.js")
const request = require("request");
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
require('dotenv').config();



const config = {
    authRequired: true,
    auth0Logout: true,
    secret : process.env.secret,
    baseURL : process.env.baseURL,
    clientID : process.env.clientID,
    issuerBaseURL : process.env.issuerBaseURL, 

  }; //initialised according to our credentials 
  
 
  
  
app.use(auth(config));

app.set('view engine', 'ejs')

app.use('/',router)


app.listen(3000 , () => {
    console.log("Port 3000 is working") ;
})





