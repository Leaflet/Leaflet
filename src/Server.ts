/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

// import {L.PoligonosApp} from './PoligonosApp';

// import {Response , Request, Router} from 'express';

// import {Exception} from 'typescript';

// const router = Router();

// const bodyParser = require('body-parser');

function serve(): void {

  const {Response , Request, Router} = require('express');

  const Exception = require('typescript');

  const router = Router();
  
  const bodyParser = require('body-parser');

      // Constants
      const PORT = 8080;
      const HOST = '0.0.0.0';
  
  // App
      const express = require('express');
      const app = express();
      
      console.log(`...`);

      // https://stackoverflow.com/questions/54649465/how-to-do-try-catch-and-finally-statements-in-typescript/54649617
      try{

        router.get('/', (req:Request, res:Response):void => {

        res.json({success:true});
        res.send('PoligonosApp');
        // res.sendFile('./polygons.geojson');
        // res.json('./polygons.geojson');
        require('./Leaflet.ts'); // L.PoligonosApp();
        require('./PoligonosApp.ts');
        const polygons = require('./L.Polygon.ts')('./polygons.geojson');
        
        //canvas
        const map = L.map('map', {
        renderer: L.canvas()
        });

        polygons.addTo(map);

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
          maxZoom: 18,
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          id: 'mapbox/light-v9',
          tileSize: 512,
          zoomOffset: -1
        }).addTo(map);

        });
    
        app.listen(PORT, HOST);
        console.log(`Running on http://${HOST}:${PORT}`);
      }
      catch(e){
        // typescript error TS1044
        // const result = (e as Exception).Message;

        // console.log(result);

      }
      finally{

        console.log("finally");

      }

} // end function serve

// https://stackoverflow.com/questions/54649465/how-to-do-try-catch-and-finally-statements-in-typescript/54649617
try{
  serve();
}catch(e){
  //typescript 2304
  // const result = (e as Exception).Message;

  // console.log(result);

}
finally{

  console.log("finally");

}

export default serve;

