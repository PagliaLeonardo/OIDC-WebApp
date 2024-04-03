import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import * as https from 'https';
import * as fs from 'fs';
import helmet from 'helmet';
//import cors from 'cors';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server:{
  https: {
    key: fs.readFileSync('C:/Users/LPaglia/Desktop/Athesys/project/ui/app/key.pem'),
    cert: fs.readFileSync('C:/Users/LPaglia/Desktop/Athesys/project/ui/app/cert.pem')
  },
  port: 5173,
  headers: {
    "Access-Control-Allow-Origin": "keycloak.local; mysite.local; https://localhost; https://keycloak.local; https://mysite.local; https://localhost;", //cors
    "Content-Security-Policy": "script-src 'sha256-3c088ce289a1b85030dc33a0b58d4257be0a80dbce3b4a4e7f7ee840c64cd191' ; script-src-elem 'self'; script-src-attr 'none'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self'; font-src 'self' https://fonts.gstatic.com; object-src 'none'; frame-ancestors 'none'; upgrade-insecure-requests; block-all-mixed-content;  require-trusted-types-for 'script'; report-uri https://keycloak.report-uri.com/r/d/csp/enforce",
    "X-Content-Type-Options": "nosniff", // Prevent browsers from guessing the MIME type
    "X-XSS-Protection": "1; mode=block", // Enable XSS filtering
    "Pragma": "no-cache", // Ensures backward compatibility with HTTP/1.0 caches where Cache-Control is not present
    "Expires": "0", // Ensures backward compatibility with HTTP/1.0 caches where Cache-Control is not present
    "Cache-Control": "no-cache, no-store, must-revalidate", // Prevents caching of sensitive data
    "X-DNS-Prefetch-Control": "off", // Disable DNS prefetching
    "Strict-Transport-Security": "max-age=86400; includeSubDomains", // Adds HSTS options to your website, with a expiry time of 1 day
    "X-Frame-Options": "DENY", // Stops your site being used as an iframe
  }
  }
})
