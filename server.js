const 
    http = require('http'),
     url = require('url'),
     fs = require('fs');

http.createServer((request, response) => {
    let 
        addr = request.url,
        pUrl = url.parse(addr, true),
        filePath = '';

    if (pUrl.pathname.includes('documentation')) {
        filePath = (__dirname + '/documentation.html');
    } else {
        filePath = 'index.html';
    }

    fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Added to log.');
        }
    });
    
    if (pUrl.pathname.includes('documentation')) {
        filePath = (__dirname + '/documentation.html');
    } else {
        filePath = 'index.html';
    }


    fs.readFile(filePath, (err, data) => {
        if (err) {
            throw err;
        }

        response.writeHead(200, {'Content-Type' : 'text/html' });
        response.write(data);
        response.end();
    });
    
}).listen(8080);
console.log('Test Server on Port 8080');