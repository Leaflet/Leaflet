/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// GitHub App server retrieve webhook event request
// https://www.npmjs.com/package/octokit#app-server
function retrieve():void{
    const http = require('http');

    // const {Request, Response} = require('express');

// Create a local server to receive data from
const server = http.createServer((req:Request, res:Response) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!'
  }));
});



server.listen(8000);
} // end function retrieve

retrieve();

