import { config } from 'dotenv';
config({ path: './.env' });
import express, {Request,Response} from 'express'; 
import * as https from 'https';
import * as fs from 'fs';
import session,  { Session } from 'express-session';
const app = express();
import cors from "cors";
import helmet from "helmet";
const PORT = 8080;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const key = fs.readFileSync('C:/Users/LPaglia/Desktop/Athesys/project/api/key.pem');
const cert = fs.readFileSync('C:/Users/LPaglia/Desktop/Athesys/project/api/cert.pem');

const cookieParser = require('cookie-parser');

app.use(cookieParser());

interface KeycloakSessionData extends Session {
    state?: string;
    nonce?: string;
    code_challenge?: string;
    code_verifier?: string;
    clientId?: string;
}




//set cookies
app.use(session({
    secret: 'dRa4qroCkjKQ_-EgZCAOhWT8sg0bxWuNJLz2PJsWy4Q',
    resave: false,
    saveUninitialized: true,
    
    cookie: {
        httpOnly: true,
        secure: true, // Set to 'true' in production for HTTPS connections
        maxAge: 60 * 60 * 1000, // Session expiration time in milliseconds
        sameSite: 'lax' //stop the cookie to be send in cross-site requests
      },
    store: new session.MemoryStore(),
     }));


import authrouter from './routes/authrouter';
import callbackrouter from './routes/callback';
import resourcerouter from './routes/resource';

//cors
app.use(
    cors({
        origin: ['https://localhost', 'https://keycloak.local'],
    })
);


app.use(
    helmet({
      frameguard: {
        action: 'deny'
      },
      // custom security headers 
    xssFilter: true, // Enable XSS filtering
    noSniff: true, // Prevent browsers from guessing the MIME type
    hidePoweredBy: true, // Hide "X-Powered-By" header
    dnsPrefetchControl: { allow: false }, // Disable DNS prefetching
    })
  );

  app.use(
helmet.contentSecurityPolicy({
    directives: {
      scriptSrcElem: ['self'], // Only allow script elements from the same origin
      scriptSrcAttr: ['none'], // Disallow inline scripts
      styleSrc: ['self', 'unsafe-inline', 'https://fonts.googleapis.com'], // Allow styles from self, inline, and Google Fonts
      imgSrc: ['self'], // Allow images from the same origin
      fontSrc: ['self', 'https://fonts.gstatic.com'], // Allow fonts from self and Google Fonts
      objectSrc: ['none'], // Disallow object tags
      frameAncestors: ['none'], // Disallow framing from other origins
      upgradeInsecureRequests: ['true'], // Upgrade insecure requests to HTTPS
      blockAllMixedContent: ['true'], // Block mixed content (HTTP and HTTPS on the same page)
      "require-trusted-types-for": ["'script'"], // Enforce Trusted Types for scripts
      reporturi: ["'https://keycloak.report-uri.com/r/d/csp/enforce'"],
    },
    
  })
  );

 




app.use("/login", authrouter);
app.use("/callback", callbackrouter);
app.use("/resource", resourcerouter);

app.get('/', (req :Request, res:Response)=>{
    const url = new URL("https://localhost:5173/");
    res.status(302).redirect(url.toString());
    
});



const server =https.createServer({ key, cert }, app);
const io = require('socket.io')(server);

server.listen(PORT, 'mysite.local', () =>{ 
    
        console.log("Server is Successfully Running,  and App is listening on port "+ PORT) 

    } 
);




export default KeycloakSessionData
