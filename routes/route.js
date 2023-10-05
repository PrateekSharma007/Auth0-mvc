const express = require("express") ; 
const app = express() ; 
const router = express.Router() ;
const {authh,resend} = require('../controller/control') 
const { requiresAuth } = require('express-openid-connect');
const {auth} =require("express-openid-connect")


router.get("/" , requiresAuth() , authh) ;  // requiresAuth() is passed as an middleware here


router.post("/resend-verification-email" ,requiresAuth() , resend) ; // requiresAuth() is passed as an middleware here






module.exports = router;