import { config } from 'dotenv';
config({ path: './.env' });
// Importing express module
import { Router } from "express";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import resourcecontroller from "../controllers/resourcecontroller";
const resourcerouter=Router();


resourcerouter.get("/",resourcecontroller.getpublic);

resourcerouter.get("/public",resourcecontroller.getpublic);

resourcerouter.get("/private",resourcecontroller.getprivate);

resourcerouter.get("/admin",resourcecontroller.getadmin);
  
// Importing the router 
export default resourcerouter