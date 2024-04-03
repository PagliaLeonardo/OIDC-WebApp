import { config } from 'dotenv';
config({ path: './.env' });
import { Router } from "express";
const authrouter=Router();
import pkce from '../controllers/pkce';
//functions
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

authrouter.get("/",pkce.codeflow);


// Importing the router 
export default authrouter