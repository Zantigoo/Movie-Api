const 
    http = require('http'),
     url = require('url'),
     fs = require('fs');

    

http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello Noob!\n');
}).listen(8080);

console.log('Node Test running on 8080')