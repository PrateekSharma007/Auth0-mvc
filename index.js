const express = require("express") ; 
const app = express() ;
const axios = require("axios") ;
const router = require("./routes/route.js")
const request = require("request");
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');



const config = {
    authRequired: true,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL: 'http://localhost:3000',
    clientID: 'LHiFBez6fTgfaFSzVwV76NSVwFvz7vFu',
    issuerBaseURL: 'https://dev-8beoovnx71u7swwn.us.auth0.com'
  };
  
  
app.use(auth(config));

app.set('view engine', 'ejs')

app.use('/',router)


app.listen(3000 , () => {
    console.log("Port 3000 is working") ;
})





