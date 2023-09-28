const express = require("express") ;
const axios = require("axios") ;
const request = require("request") ;
const { auth } = require('express-openid-connect');



const authh = async (req,res) => { 

    try {
        if (req.oidc.isAuthenticated() && req.oidc.user.email_verified === true) {
          console.log(req.oidc.user)
          
          let data = JSON.stringify({
            "frontend_domain_url": "https://auth0.thenftbrewery.com"
          });
          
          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://dev.backend.drops.thenftbrewery.com/api/frontend/frontendAccess',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          };
          
          axios.request(config)
          .then((response) => {
            // console.log(JSON.stringify(response.data));
            const access_token =response.data.token;
            let data = JSON.stringify({
              "email": req.oidc.user.email,
              "login_type": "auth0"
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
            };
            
            axios.request(config)
            .then((response) => {
              // console.log(JSON.stringify(response.data));
              res.send(JSON.stringify(response.data))
            })
            .catch((error) => {
              res.status(401).json(error.message)
              console.log(error);
            });
    
    
    
            // res.send(response.data)
          }).catch((error) => {
            res.status(400).json(error.message)
            console.log(error);
          });
          
    
      }
      else{
        res.render("emailverify")
      }} catch (error) {
    
        res.status(500).send(error);
      }
}



const resend = async (req,res) => { 
    try {
        const userid = req.oidc.user.sub
        const inputString = userid;
        console.log(userid)
        const indexOfPipe = inputString.indexOf("|");
    
        const userid2 = inputString.slice(indexOfPipe + 1);
        console.log(userid2)
        var options = {
          method: 'POST',
          url: 'https://dev-8beoovnx71u7swwn.us.auth0.com/oauth/token',
          headers: {'content-type': 'application/x-www-form-urlencoded'},
          data: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: 'LHiFBez6fTgfaFSzVwV76NSVwFvz7vFu',
            client_secret: 'rLS9lJStnM1O55iQhAFlGdRxTuuj-lP54vzDcV0vnETCwP9vt2d1YN7KrcxJBKtP',
            audience: 'https://dev-8beoovnx71u7swwn.us.auth0.com/api/v2/'
          })
        };
        
        axios.request(options).then(function (response) {
          const access_token = response.data.access_token;
    
          var options = {
            method: 'POST',
            url: 'https://dev-8beoovnx71u7swwn.us.auth0.com/api/v2/jobs/verification-email',
            headers: {
              'content-type': 'application/json',
              authorization: `Bearer ${access_token}`
            },
            data: {
              user_id: userid,
              client_id: 'LHiFBez6fTgfaFSzVwV76NSVwFvz7vFu',
              identity: {user_id: userid2, provider: 'auth0'}
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