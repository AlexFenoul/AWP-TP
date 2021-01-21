importScripts("./service_worker/install.js"); 
importScripts("./service_worker/activate.js"); 
importScripts("./service_worker/fetch.js"); 

const cacheName = "galerie-v1";

const files = [
  "/",
  "/script.js",  
  "https://cdnjs.cloudflare.com/ajax/libs/localforage/1.7.3/localforage.min.js"
];