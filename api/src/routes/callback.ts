import { config } from 'dotenv';
config({ path: './.env' });
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import callbackcontroller from '../controllers/callbackcontroller';
// Importing express module
import { Router } from "express";


const callbackrouter=Router() 
  


  callbackrouter.get("/",callbackcontroller.tokencodeflow);
// Importing the router 
export default callbackrouter