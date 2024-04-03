export default{
  data(){
  return{
  code: "",
  accesstoken: "",
  idtoken: "",
  refreshtoken: "",
  clientid: "",
  email: "",
  username: ""
  };
  },
    
  methods:{
  loginbutton() {
    const clientId = 'pkce-test-client';
    localStorage.setItem('clientId',clientId);
    const authUrl = "https://mysite.local:8080/login";
    const url = new URL(authUrl);
    url.searchParams.set('client_id', clientId);
    // Redirect the user to the authorization server
    window.location.href = url.toString();
  
  },
  implicitloginbutton() {
   // Replace with your authorization server and client details
    const authUrl = 'https://keycloak.local:8443/realms/test/protocol/openid-connect/auth';
    const clientId = 'implicit-test-client';
    const redirectUri = 'https://localhost:5173/';
    const scope = 'openid profile'; // Adjust based on your needs
    const secret ='Es6C0gkkIBFweKZp67olUv4hLu9cr9bX';
    //we set the client id
    localStorage.setItem('clientId',clientId);
    // Build the authorization URL with parameters
    const url = new URL(authUrl);
    url.searchParams.set('response_type', 'id_token token');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('client_secret', secret);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('scope', scope);
    url.searchParams.set('state', localStorage.getItem('state'));
    url.searchParams.set('nonce', localStorage.getItem('nonce'));
    // Redirect the user to the authorization server
    window.location.href = url.toString();
  },
  hybridtokenloginbutton() {
  
    // Replace with your authorization server and client details
    const authUrl = 'https://keycloak.local:8443/realms/test/protocol/openid-connect/auth';
    const clientId = 'hybrid-flow-client';
    const redirectUri = 'https://localhost:5173/';
    const scope = 'openid profile'; // Adjust based on your needs
    const type = 'code id_token';
    const secret ='dP2dF8bsbwzGwwYI7N0okY9KWd8qHx5H';
    //we set the client id
    localStorage.setItem('clientId',clientId);
    // Build the authorization URL with parameters
    const url = new URL(authUrl);
    url.searchParams.set('response_type', type);
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('client_secret', secret);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('scope', scope);
    url.searchParams.set('state', localStorage.getItem('state'));
    url.searchParams.set('nonce', localStorage.getItem('nonce'));
    // Redirect the user to the authorization server
    window.location.href = url.toString();
  },
  refreshtokenbutton() {
   if(localStorage.getItem('clientId')==null || localStorage.getItem('rtoken')==null || this.refreshtoken==""){
    console.error("error no clientid / refresh token found");
  }
  else{
  
  
  var secret ='';
  if(localStorage.getItem('clientId')=='hybrid-flow-client'){
  secret ='dP2dF8bsbwzGwwYI7N0okY9KWd8qHx5H';
  }else if(localStorage.getItem('clientId')=='pkce-test-client'){
  secret ='5BtULTaRUycp9tx0G5NgPa1CgfJ6nIvt';
  }else{
  console.error("invalid cliend ID");
  }
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  
  const urlencoded = new URLSearchParams();
  urlencoded.append("client_id", localStorage.getItem('clientId'));
  urlencoded.append("grant_type", "refresh_token");
  urlencoded.append("refresh_token", localStorage.getItem('rtoken'));
  urlencoded.append('client_secret', secret);
  
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow"
  };
  
  fetch("https://keycloak.local:8443/realms/test/protocol/openid-connect/token", requestOptions)
    .then((response) => response.text())
    .then((result) => {
  
            const at = JSON.parse(result).access_token;
            const idtoken= JSON.parse(result).id_token;
            const rtoken=JSON.parse(result).refresh_token;
            localStorage.setItem('accesstoken', at.toString());
            localStorage.setItem('idtoken', idtoken.toString());
            localStorage.setItem('rtoken', rtoken.toString());
            this.accesstoken=at;
            this.idtoken=idtoken;
            this.refreshtoken=rtoken;
  
    })
    .catch((error) => console.error(error));
  }
  
  },
  logoutbutton() {
    const logoutUrl = 'https://keycloak.local:8443/realms/test/protocol/openid-connect/logout';
    const clientId = localStorage.getItem('clientId');
    const redirectUri = 'https://localhost:5173/';
    // Build the authorization URL with parameters
    const url = new URL(logoutUrl);
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('post_logout_redirect_uri', redirectUri);
    // Redirect the user to the authorization server
    localStorage.clear();
    window.location.href = url.toString();
  },
  publicResourceButton(){
  const publicUrl = 'https://mysite.local:8080/resource/public';
  const url = new URL(publicUrl);
  window.location.href = url.toString();
  },
  privateResourceButton(){
  const privateUrl = 'https://mysite.local:8080/resource/private';
  const url = new URL(privateUrl);
  if(localStorage.getItem('accesstoken')==null || localStorage.getItem('accesstoken')==""){
  window.location.href = url.toString();
  }else{
   const accesstoken = localStorage.getItem('accesstoken');
   url.searchParams.set('access_token', accesstoken);
  window.location.href = url.toString();
  }
  },
  adminResourceButton(){
  const adminUrl = 'https://mysite.local:8080/resource/admin';
  const url = new URL(adminUrl);
  if(localStorage.getItem('accesstoken')==null || localStorage.getItem('accesstoken')==""){
  window.location.href = url.toString();
  }else{
   const accesstoken = localStorage.getItem('accesstoken');
   url.searchParams.set('access_token', accesstoken);
  window.location.href = url.toString();
  }
  
  },
  manageAccountButton(){
  const accountUrl = 'https://keycloak.local:8443/realms/test/account';
  const url = new URL(accountUrl);
  window.location.href = url.toString();
  }
  },
  mounted(){
  ////////////////////////////////////////////////////////////////////////////////////
  //methods
  function generateNonce(){
    return Array.from(window.crypto.getRandomValues(new Uint32Array(28)),dec => ('0' + dec.toString(16)).substr(-2)).join('');
  }
  
  function generateState(){
    return Array.from(window.crypto.getRandomValues(new Uint32Array(28)),dec => ('0' + dec.toString(16)).substr(-2)).join('');
  }
  if(localStorage.getItem('nonce')==null || localStorage.getItem('nonce')==""){
  const nonce=generateNonce();
  localStorage.setItem("nonce", nonce);
  }
  if(localStorage.getItem('state')==null || localStorage.getItem('state')==""){
  const state=generateState();
  localStorage.setItem("state", state);
  }
  ////////////////////////////////////////////////////////////////////////////////////////
  //callaback area
  ////////////////////////////////////////////////////////////////////////////////////////
  const cleanedUrl = window.location.href.replace("#", "?");
  
  const params = new URLSearchParams(new URL(cleanedUrl).search);
  const code=params.get('code');
  this.code=code;
  
  this.clientid=localStorage.getItem('clientId');
  
  
  ////////////////////////////////////////////////////////////////////////////////////////
  //implicit flow + id token
  if(localStorage.getItem('clientId')=='implicit-test-client'){
      //we check if the user has already authenticated
      if(localStorage.getItem('accesstoken')!=null && localStorage.getItem('idtoken')!=null){
      this.idtoken = localStorage.getItem('idtoken');
      this.accesstoken= localStorage.getItem('accesstoken');
      }
      else{
      //check state 
      const statecheck = params.get('state');
      if(statecheck==localStorage.getItem('state') && statecheck!=null && statecheck!="" ){
      //check nonce
      const id_token = params.get('id_token');
      const split=atob((id_token).split('.')[1]);
      const noncecheck =JSON.parse(split).nonce;
      
      if(noncecheck!=localStorage.getItem('nonce') || noncecheck==null || noncecheck==""){
          console.error("error: nonce compromised");
  
      }else{
     const access_token = params.get('access_token');
      this.accesstoken= access_token;
      
      this.idtoken = id_token;
      localStorage.setItem('accesstoken', access_token.toString());
      localStorage.setItem('idtoken', id_token.toString());
      }
  
      }else{
       console.error("error: state compromised");
      }
  
      }
  }
  ////////////////////////////////////////////////////////////////////////////////////////
  //hybrid flow + id token
  
  async function hybridflow() {
        
        const myHeaders = new Headers();
        myHeaders.append("content-type", "application/x-www-form-urlencoded");
        
        const urlencoded = new URLSearchParams();
        ;
        urlencoded.append("grant_type", "authorization_code");
        urlencoded.append("client_id", "hybrid-flow-client");
        urlencoded.append("redirect_uri", "https://localhost:5173/");
        urlencoded.append("state", localStorage.getItem('state'));
        urlencoded.append("nonce", localStorage.getItem('nonce'));
        const secret ='dP2dF8bsbwzGwwYI7N0okY9KWd8qHx5H';
        urlencoded.append('client_secret', secret)
        urlencoded.append("code", code);
        
        
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: urlencoded,
          redirect: "follow"
        };
        
       const response = await fetch("https://keycloak.local:8443/realms/test/protocol/openid-connect/token", requestOptions);
       if (response.ok) {
      const responseData = await response.text(); // This is how you get the data from the response
  
            const at = JSON.parse(responseData).access_token;
            const idtoken= JSON.parse(responseData).id_token;
            const rtoken=JSON.parse(responseData).refresh_token;
  
            //split tokens
            const noncecheck =JSON.parse(atob((JSON.parse(responseData).access_token).split('.')[1])).nonce;
            if(noncecheck==localStorage.getItem('nonce') && noncecheck!=null && noncecheck!="" ){
            localStorage.setItem('accesstoken', at.toString());
            localStorage.setItem('idtoken', idtoken.toString());
            localStorage.setItem('rtoken', rtoken.toString());
            }else{
            console.error("error: nonce compromised");
            }
  
    
       }else {
      console.error("ERROR: ", response.statusText);
      }
  
      };
  
  
  
  
  
    if(localStorage.getItem('clientId')=='hybrid-flow-client'){
    
      //we check if the user has already authenticated
      if(localStorage.getItem('accesstoken')!=null && localStorage.getItem('idtoken')!=null && localStorage.getItem('rtoken')!=null){
      this.idtoken = localStorage.getItem('idtoken');
      this.accesstoken= localStorage.getItem('accesstoken');
      this.refreshtoken=localStorage.getItem('rtoken');
      this.code="";
      }
      else{
    if(this.code!=""){
    if(this.code.includes("Error")){
   console.error("ERROR: could not compleate authentication");
    }
    else{
       //check state
      const statecheck = params.get('state');
      if(statecheck==localStorage.getItem('state') && statecheck!=null && statecheck!="" ){
        //check nonce
      const id_token = params.get('id_token');
      const split=atob((id_token).split('.')[1]);
      const noncecheck =JSON.parse(split).nonce;
       if(noncecheck==localStorage.getItem('nonce') && noncecheck!=null && noncecheck!="" ){
       hybridflow().then(()=>{
       this.accesstoken = localStorage.getItem('accesstoken');
       this.idtoken = localStorage.getItem('idtoken');
       this.refreshtoken = localStorage.getItem('rtoken');
       this.code ="";
       });
  
       }else{
       console.error("error: nonce compromised");
       }
  
       }else{
       console.error("error: state compromised");
       }
       
       }
  
      }else{
        console.error("error: no authorization code");
      }
  
  
    }
  
  
  }
  
  
  
  ////////////////////////////////////////////////////////////////////////////////////////
  //pkce
  if(localStorage.getItem('clientId')=='pkce-test-client'){
      //we check if the user has already authenticated
      if(localStorage.getItem('accesstoken')!=null && localStorage.getItem('idtoken')!=null && localStorage.getItem('rtoken')!=null){
      this.idtoken = localStorage.getItem('idtoken');
      this.accesstoken= localStorage.getItem('accesstoken');
      this.refreshtoken=localStorage.getItem('rtoken');
      }
      else{
          //check state
      const statecheck = params.get('state');
      if(statecheck!=null && statecheck!=""){
  
      const id_token = params.get('id_token');
      const split=atob((id_token).split('.')[1]);
      const noncecheck =JSON.parse(split).nonce;
      if(noncecheck!=null && noncecheck!=""){
  
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');  
      this.accesstoken= access_token;
      this.refreshtoken = refresh_token;
      this.idtoken = id_token;
      localStorage.setItem('accesstoken', access_token.toString());
      localStorage.setItem('idtoken', id_token.toString());
      localStorage.setItem('rtoken', refresh_token.toString());
      }else{
      console.error("error: nonce compromised");
      }
  
      }else{
      console.error("error: state compromised");
      }
  
      }
  }
  
  ////////////////////////////////////////////////////////////////////////////////////////
  
  //userinfo endpoint
  
  async function getUserInfo(){
  const access_token = localStorage.getItem('accesstoken');
  const myHeaders = new Headers();
  const authorization= "Bearer "+access_token;
  myHeaders.append("Authorization", authorization);
  
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };
  
  await fetch("https://keycloak.local:8443/realms/test/protocol/openid-connect/userinfo", requestOptions)
    .then((response) => response.text())
    .then((result) => {
    const email =JSON.parse(result).email;
    const username =JSON.parse(result).preferred_username;
    localStorage.setItem('email',email);
    localStorage.setItem('username',username);
    })
    .catch((error) => console.error(error));
  
  }
  
  if(localStorage.getItem('clientId')!=null && localStorage.getItem('clientId')!=""){
  
  if(localStorage.getItem('accesstoken')!=null && localStorage.getItem('accesstoken')!=""){
  getUserInfo().then(()=>{
  this.email=localStorage.getItem('email');
  this.username=localStorage.getItem('username');
  });
  
  }else{
  console.error("error access token not found");
  }
  
  }
  
  },
  };