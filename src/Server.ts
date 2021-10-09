/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// 'use strict'; // eslint https://stackoverflow.com/questions/32791507/node-js-and-eslint-disagree-on-use-strict

// require('./src/Leaflet.ts');

 // const L.PoligonosApp = require('poligonosapp');
 // L.PoligonosApp();

// import express from 'express';
// export require('iconv').Iconv;
// const express = require('express');

function serve() {
      // Constants
      const PORT = 8080;
      const HOST = '0.0.0.0';
  
  // App
      const express = require('express');
      const app = express();
      
      app.get('/', (req, res) => {
        res.send('Welcome PoligonosApp');
        require('./Leaflet.ts'); // L.PoligonosApp();
      });
  
      app.listen(PORT, HOST);
      console.log(`Running on http://${HOST}:${PORT}`);
}

serve();

