/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// 'use strict'; // eslint https://stackoverflow.com/questions/32791507/node-js-and-eslint-disagree-on-use-strict

import {GeoJSONAbstractClass, map} from "./Leaflet";
import {MapReturnType} from "./layer/GeoJSON";
import Exception from "typescript";

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

function serve(): void | GeoJSONAbstractClass | String {

  const { L , Map, Layer, Canvas, tileLayer, geoJSON, Polygon} = require ('./Leaflet.ts');

  const {PoligonosApp} = require('./PoligonosApp');

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

        // res.json({success:true});
        // res.send('PoligonosApp');
        // res.sendFile('./polygons.geojson');
        // res.json('./polygons.geojson');
        // require('./Leaflet.ts'); // L.PoligonosApp();
        // require('./PoligonosApp.ts');
        const polygons = L.Polygon('./polygons.geojson');
        
        //canvas
        // @ts-ignore
            const map:MapReturnType = L.Map('map', {
        renderer: L.canvas()
        });

        polygons.addTo(map);

        const option:number = 1;

        switch(option){
            case 1:
                const token1 = require('./Pipeline');

                const a1 = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=';
                // const b1 = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

                const s1 = a1.concat(token1);

                L.tileLayer(s1, {
                    maxZoom: 18,
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    id: 'mapbox/light-v9',
                    tileSize: 512,
                    zoomOffset: -1
                }).addTo(map);

        //});
                break;
            case 2:
                const token2 = require('./Token');

                const a2 = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=';
                // const b2 = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

                const s2 = a2.concat(token2);
                L.tileLayer(s2, {
                    maxZoom: 18,
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    id: 'mapbox/light-v9',
                    tileSize: 512,
                    zoomOffset: -1
                }).addTo(map);

        // });
                break;
        }

        // typescript 2304 cannot find name 'res'
        // res.json({success:true});
    

      }
      catch(e){
        // typescript error TS1044
        // const result = (e as Exception).Message;

        // console.log(result);

              throw new Exception("LEAFLET TOKEN NOT FOUND");

      }
      finally{

    app.listen(PORT, HOST);
    console.log(`Running on http://${HOST}:${PORT}`);

      }

} // end function serve

// https://stackoverflow.com/questions/54649465/how-to-do-try-catch-and-finally-statements-in-typescript/54649617
try{
  serve();
}catch(e){
  //typescript 2304
  // const result = (e as Exception).Message;

  // console.log(result);

    throw new Exception("LEAFLET TOKEN NOT FOUND");

}
finally{

  console.log("finally");

}

// export default serve;

