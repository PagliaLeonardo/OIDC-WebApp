import { config } from 'dotenv';
config({ path: './.env' });
import {  Request, Response } from "express";
import crypto from "crypto";
import KeycloakSessionData from "../index";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export const codeflow = async (req: Request, res: Response): Promise<void> => { 
     



//pkce flow

function base64urlencode(buffer: ArrayBuffer): string {
    // Convert buffer to base64 string
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  
    // Replace characters not allowed in base64url encoding
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }
    
  function generateNonce(){
      return Array.from(crypto.getRandomValues(new Uint32Array(28)),dec => ('0' + dec.toString(16)).substr(-2)).join('');
  }
  
  function generateState(){
      return Array.from(crypto.getRandomValues(new Uint32Array(28)),dec => ('0' + dec.toString(16)).substr(-2)).join('');
  }

  async function generatePKCEPair(): Promise<{ code: string; challenge: string }> {
    // Generate random code using crypto API
    const code = Array.from(crypto.getRandomValues(new Uint32Array(28)))
      .map(dec => ('0' + dec.toString(16)).substr(-2))
      .join('');
  
    // Hash the code with SHA-256 using SubtleCrypto
    const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(code));
  
    // Convert buffer to base64url encoded string
    const challenge = base64urlencode(buffer);
  
    // Return the generated code and challenge
    return { code, challenge };
  }

        // Replace with your authorization server and client details
        const authUrl = 'https://keycloak.local:8443/realms/test/protocol/openid-connect/auth';
        const clientId = 'pkce-test-client';
        const redirectUri = 'https://mysite.local:8080/callback';
        const scope = 'openid profile'; 
        const state= generateState();
        const nonce= generateNonce();
        //debug
        const { code, challenge } = await generatePKCEPair();
        
        const sessionkc = req.session as KeycloakSessionData;
        
        sessionkc.state = state;
        sessionkc.nonce = nonce;
        sessionkc.code_challenge= challenge;
        sessionkc.code_verifier = code;
        sessionkc.clientId="pkce-test-client";
        
         function getauthcode(){
        
        // Build the authorization URL with parameters
        const url = new URL(authUrl);
        url.searchParams.set('response_type', 'code');
        url.searchParams.set('client_id', clientId);
        url.searchParams.set('client_secret', "5BtULTaRUycp9tx0G5NgPa1CgfJ6nIvt");
        url.searchParams.set('redirect_uri', redirectUri);
        url.searchParams.set('scope', scope);
        url.searchParams.set('state', state);
        url.searchParams.set('nonce', nonce);
        url.searchParams.set('code_challenge', <string>sessionkc.code_challenge);
        url.searchParams.set('code_challenge_method', 'S256');
        //debug

        res.status(302).redirect((url.toString()));
        
    }
  getauthcode();
};

export default {
    codeflow
    
};
  