import { config } from 'dotenv';
config({ path: './.env' });
import {  Request, Response } from "express";
import KeycloakSessionData from "../index";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export const tokencodeflow = async (req: Request, res: Response): Promise<void> => { 

const sessionkc = req.session as KeycloakSessionData;

const code=req.query.code;

const code_verifier = sessionkc.code_verifier;
/////////////////////////////////////////////////////
//verify nonce and state
const nonce = sessionkc.nonce;
const state = sessionkc.state;
if (state!=req.query.state || req.query.state==null || req.query.state==""){
    res.status(403).send("Error state parameter compromised");
}else{
const myHeaders = new Headers();

var sentinel=false;

myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

const urlencoded = new URLSearchParams();
urlencoded.append('grant_type', 'authorization_code');
urlencoded.append('client_id', 'pkce-test-client');
urlencoded.append('client_secret', "5BtULTaRUycp9tx0G5NgPa1CgfJ6nIvt");
urlencoded.append('redirect_uri', 'https://mysite.local:8080/callback');
if(code!=null){
urlencoded.append('code', code?.toString());
}else{
    sentinel=true;
}
if (code_verifier!=null){
urlencoded.append('code_verifier', code_verifier);
}else{
    sentinel=true;
}
if (state!=null){
    urlencoded.append('state', <string>state);
}else{
    sentinel=true;
}
if (nonce!=null){
    urlencoded.append('nonce', <string>nonce);
}else{
    sentinel=true;
}

if(!sentinel){

const requestOptions: RequestInit = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow',
};

function extracttoken(jsontoken: string){

    return JSON.stringify(jsontoken, null, 2);
}

const response = await fetch('https://keycloak.local:8443/realms/test/protocol/openid-connect/token', requestOptions);

if (response.ok) {
    const responseData = await response.text(); // This is how you get the data from the response
    const idtoken = extracttoken(JSON.parse(atob((JSON.parse(responseData).id_token).split('.')[1])) );
    const noncecheck =JSON.parse(idtoken).nonce;
    if(noncecheck!=sessionkc.nonce){
        res.status(403).send("Error nonce compromised");
    }else{
    
    const url = new URL("https://localhost:5173/");
    url.searchParams.set("access_token", JSON.parse(responseData).access_token);
    url.searchParams.set("id_token", JSON.parse(responseData).id_token);
    url.searchParams.set("refresh_token", JSON.parse(responseData).refresh_token);
    url.searchParams.set("state", <string>state);
    res.status(302).redirect((url.toString()));
}

} else {
    console.error("ERROR: ", response.statusText);
    res.status(response.status).send(response.statusText);
}


}else{
    res.status(500).send("Error invalid request");
}

}

};


export default {
    tokencodeflow
    
};
