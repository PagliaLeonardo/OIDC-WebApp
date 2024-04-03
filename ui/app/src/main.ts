import './assets/main.css'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
//import cors from "../node_modules/cors";



const app = createApp(App);


app.use(router)

app.mount('#app')
