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

import {Response , Request, Router} from 'express';

const router = Router();

const bodyParser = require('body-parser');

public function serve() {
      // Constants
      const PORT = 8080;
      const HOST = '0.0.0.0';
  
  // App
      const express = require('express');
      const app = express();
      
      console.log(`...`);

      // https://stackoverflow.com/questions/54649465/how-to-do-try-catch-and-finally-statements-in-typescript/54649617
      try{
        router.get('/', (req, res) => {
          res.json({success:true});
          res.send('PoligonosApp');
          res.sendFile('./polygons.geojson');
          res.json('./polygons.geojson');
          require('./Leaflet.ts'); // L.PoligonosApp();
        });
    
        app.listen(PORT, HOST);
        console.log(`Running on http://${HOST}:${PORT}`);
      }
      catch(e){
        result = (e as Exception).Message;
      }
      finnaly{

        return;

      }

} // end function serve

// https://stackoverflow.com/questions/54649465/how-to-do-try-catch-and-finally-statements-in-typescript/54649617
try{
  serve();
}catch(e){
  result = (e as Exception).Message;
}
finally{

}

export default router;

