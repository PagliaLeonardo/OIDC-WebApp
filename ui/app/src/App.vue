
<script src="./src/appScript.js" integrity="sha256-3c088ce289a1b85030dc33a0b58d4257be0a80dbce3b4a4e7f7ee840c64cd191"></script> 
<template>



<head>
    <title>Registrazione</title>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

</head>
<body>
    

 <h1>Login with OpenID Connect</h1>

<div>
<h2>
  Login with code flow
</h2>
</div>

<div>
<button @click="loginbutton">Login PKCE</button>
</div>

<div>
  <h2>Login with implicit flow</h2>
</div>


<div>
  <button @click="implicitloginbutton"> Login Implicit </button>
  
</div>

<div>
  <h2>Login with hybrid flow</h2>
</div>


<div>
  <button @click="hybridtokenloginbutton"> Login Hybrid</button>
</div>

<div>
  <h2>
    Tokens: 
  </h2>
</div>

<div>
  
  <p>Authorization Code: </p> <p id="code">{{code}}</p> <p id="code+"></p>

</div>

<div>
  
    <p>Access Token: </p> 
    <p v-if="accesstoken">{{ accesstoken }}</p>
    <p v-else>Not loaded.</p>
</div>

<div>
  
    <p>ID Token: </p>  
    <p v-if="idtoken">{{ idtoken }}</p>
    <p v-else>Not loaded.</p>  
  
</div>

<div>
  <p>Client ID: </p>
    <p v-if="clientid">{{ clientid }}</p>
    <p v-else>Not loaded.</p>
</div>

<div>
  <h2>Refresh Token flow:</h2>
</div>

<div>
  
    <p>Refresh Token: </p> 
    <p v-if="refreshtoken">{{ refreshtoken }}</p>
    <p v-else>Not loaded.</p> 
</div>

<div>
  <button @click="refreshtokenbutton">Refresh</button>
</div>

  <div>
  

  <h2>Account Info</h2>
    <div>
  <button @click="manageAccountButton">Manage Account</button>
</div>

  <div id="user-info-display">
    <p>Username: </p>
    <p v-if="username">{{ username }}</p>
    <p v-else>Not loaded.</p>
  </div>

    <div id="user-info-display">
    <p>Email: </p>
    <p v-if="email">{{ email }}</p>
    <p v-else>Not loaded.</p>
  </div>



  </div>

  <div>
  <button @click="publicResourceButton">Public area</button>
</div>

<div>
  <button @click="privateResourceButton">Private area</button>
</div>

<div>
  <button @click="adminResourceButton">Admin area</button>
</div>

<div>
  <h2>Logout</h2>
</div>

<div>
  <button @click="logoutbutton">Logout</button>
</div>

<footer>

</footer>
</body>




</template>

