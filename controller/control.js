const express = require("express") ;
const axios = require("axios") ;
const request = require("request") ;
const { auth } = require('express-openid-connect');
require('dotenv').config();



const authh = async (req,res) => { 

    try {
        if (req.oidc.isAuthenticated() && req.oidc.user.email_verified === true) {
          let data = JSON.stringify({
            "frontend_domain_url": "https://auth0.thenftbrewery.com"
          }); // req.oidc.isAuthenticated() check if it authenticated or not and req.oidc.user.email_verified checks if the email is verified if true then it proceeds ahead. 
       
          
          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://dev.backend.drops.thenftbrewery.com/api/frontend/frontendAccess',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          };  // the url provided generates a access token which we store it in a variable .
          
          axios.request(config)
          .then((response) => {
            const access_token =response.data.token; // stored the access token
            let data = JSON.stringify({
              "email": req.oidc.user.email, //email of the user logged in
              "login_type": "auth0" // by default it will be auth0
            });
            
            let config = {
              method: 'post',
              maxBodyLength: Infinity,
              url: 'https://dev.backend.drops.thenftbrewery.com/api/frontend/oneOf/oneOfLogin',
              headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${access_token}`
              },
              data : data
            };//the url makes the smart wallet in which we will pass access token in it .
            
            axios.request(config)//make a request to the api we will give us a response
            .then((response) => {
              

              const responseMessage = "Congratulations you have successfully logged in!";
              const responseData = response.data;

              
              const jsonResponse = {
                message: responseMessage,
                data: responseData
              };
              res.json(jsonResponse) // we return the wallet here 
            })
            .catch((error) => {
              res.status(401).json(error.message)
              console.log(error);
            });
          }).catch((error) => {
            res.status(400).json(error.message)
            console.log(error);
          });
          
    
      }
      else{
        res.render("emailverify") // views is shown if the email is not verified
        
      }} catch (error) {
    
        res.status(500).send(error);
      }
}



const resend = async (req,res) => { 
    try {
        const userid = req.oidc.user.sub // int the form of auth0|42652562263
        const inputString = userid;
    
        const indexOfPipe = inputString.indexOf("|");
    
        const userid2 = inputString.slice(indexOfPipe + 1); // we need to get the second half after auth0|42652562263 which is 42652562263
    
        var options = {
          method: 'POST',
          url: 'https://dev-8beoovnx71u7swwn.us.auth0.com/oauth/token',
          headers: {'content-type': 'application/x-www-form-urlencoded'},
          data: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id:process.env.clientID,
            client_secret: process.env.clientsecret,
            audience: process.env.audience
          })
        };// this will give a access token in response to send resend email .
        
        axios.request(options).then(function (response) {
          const access_token = response.data.access_token; //stored the access token 
    
          var options = {
            method: 'POST',
            url: 'https://dev-8beoovnx71u7swwn.us.auth0.com/api/v2/jobs/verification-email',
            headers: {
              'content-type': 'application/json',
              authorization: `Bearer ${access_token}`//we got this from above
            },
            data: {
              user_id: userid,
              client_id: 'LHiFBez6fTgfaFSzVwV76NSVwFvz7vFu',
              identity: {user_id: userid2, provider: 'auth0'}//number part we use we got above by slicing
            }
          };
          
          axios.request(options).then(function (response) {
            console.log(response.data);
        })
        
      })}catch(error) {
        console.error('Error sending verification email');
        res.status(500).send('Error sending verification email');
        res.send("error")  
      }
}




module.exports = {authh,resend}