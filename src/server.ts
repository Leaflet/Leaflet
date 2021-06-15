// 'use strict'; // eslint https://stackoverflow.com/questions/32791507/node-js-and-eslint-disagree-on-use-strict

// require('dist/leaflet-src.ts');

import express from 'express';
// const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);