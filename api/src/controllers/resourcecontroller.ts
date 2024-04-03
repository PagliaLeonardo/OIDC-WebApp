import { config } from 'dotenv';
config({ path: './.env' });
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// Importing express module
import {  Request, Response } from "express";


function split(access_token: string){
    let split: string[] = new Array(4);
    split[0] =atob((access_token).split('.')[0]);
    split[1] =atob((access_token).split('.')[1]);
    split[2] =(access_token).split('.')[2];
    return split;

}
function isJWT(access_token:string): Boolean{
    try {
        const parts = access_token.split('.');
         const headerjwt= parts[0];
             const typ=JSON.parse(atob(headerjwt)).typ;
 
             if(typ==="JWT"){
                 return parts.length === 3;
             }
         } catch (error) {
             return false;
         }
         return false;
}

    

export const getpublic = async (req: Request, res: Response): Promise<void> => {

        res.status(200).send("This is the public resource endpoint")


};

export const getprivate = async (req: Request, res: Response): Promise<void> => { 

    if(req.query.access_token!=null && req.query.access_token!="" ){

        const access_token=req.query.access_token?.toString();
        if(!isJWT(access_token)){
            res.status(401).send('Invalid jwt token');
        }else{
        
        const splited =split(access_token);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        
        const urlencoded = new URLSearchParams();
        urlencoded.append("token", access_token);
        urlencoded.append("client_id", "service-api");
        urlencoded.append("client_secret", "wIcBY2g6Q8UtCGDOMK1KGzDZSok59Kn2");
        
        const requestOptions :RequestInit = {
          method: "POST",
          headers: myHeaders,
          body: urlencoded,
          redirect: "follow"
        };
        
        const response = await fetch("https://keycloak.local:8443/realms/test/protocol/openid-connect/token/introspect", requestOptions);
        if (response.ok) {
            const responseData = await response.text();
            

            if(JSON.parse(responseData).active=="false" || JSON.parse(responseData).active==false || responseData=='{"active":false}' ){
                res.status(403).send("invalid token");
                }else{
                    if(JSON.parse(responseData).active=="true" || JSON.parse(responseData).active==true){
                    const azp= JSON.parse(splited[1]).azp;
                    const client_id= JSON.parse(responseData).client_id;
                    const iss= JSON.parse(splited[1]).iss;

                    if(azp==client_id){
                        if(iss=="https://keycloak.local:8443/realms/test"){
                        if(azp=="pkce-test-client" || azp=="implicit-test-client" || azp=="hybrid-flow-client"){
                            res.status(200).send("This is the private resource endpoint");
                        }else{
                            res.status(403).send("invalid token");
                        }

                        }
                        else{
                        res.status(403).send("invalid token");
                        
                        }

                    }else{
                        res.status(403).send("invalid token");
                    }

                    
                    }else{
                        res.status(403).send("invalid token");
                            }
                       
                    }
            

        }  else {
            console.error("ERROR: ", response.statusText);
            res.status(response.status).send(response.statusText);
        } 

    }
    }
    else{
        res.status(401).send('Error: Unauthorized');
    }
    
};


export const getadmin = async (req: Request, res: Response): Promise<void> => {



    if(req.query.access_token!=null && req.query.access_token!="" ){

        const access_token=req.query.access_token?.toString();

        if(!isJWT(access_token)){
            res.status(401).send('Invalid jwt token');
        }else{

        const splited =split(access_token);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        
        const urlencoded = new URLSearchParams();
        urlencoded.append("token", access_token);
        urlencoded.append("client_id", "service-api");
        urlencoded.append("client_secret", "wIcBY2g6Q8UtCGDOMK1KGzDZSok59Kn2");
        
        const requestOptions :RequestInit = {
          method: "POST",
          headers: myHeaders,
          body: urlencoded,
          redirect: "follow"
        };
        
        const response = await fetch("https://keycloak.local:8443/realms/test/protocol/openid-connect/token/introspect", requestOptions);
        if (response.ok) {
            const responseData = await response.text();

            
            
            if(JSON.parse(responseData).active=="false" || JSON.parse(responseData).active==false || responseData=='{"active":false}' ){
                res.status(403).send("invalid token");
                }else{
                    if(JSON.parse(responseData).active=="true" || JSON.parse(responseData).active==true){
                    const azp= JSON.parse(splited[1]).azp;
                    const client_id= JSON.parse(responseData).client_id;
                    const iss= JSON.parse(splited[1]).iss;
                    const scope=JSON.parse(splited[1]).scope;
                    if(azp==client_id){
                        if(iss=="https://keycloak.local:8443/realms/test"){
                            if(azp=="pkce-test-client" && scope.includes("admin-login")){
                                res.status(200).send("This is the admin resource endpoint");
                            }else{
                                res.status(403).send("invalid token");
                            }
                        }
                        else{
                        res.status(403).send("invalid token");
                        
                        }

                    }else{
                        res.status(403).send("invalid token");
                    }

                    
                    }else{
                        res.status(403).send("invalid token");
                            }
                       
                    }
            

        }  else {
            console.error("ERROR: ", response.statusText);
            res.status(response.status).send(response.statusText);
        }   

    }
    }
    else{
        res.status(401).send('Error: Unauthorized');
    }

    

};


export default {
    getpublic,
    getprivate,
    getadmin
};
  