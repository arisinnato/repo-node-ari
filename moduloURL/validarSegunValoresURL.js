const http = require("http");
const url = require("url");
const PORT = 9000;


const server = http.createServer(function (request, response) {

    const header = { "Content-Type": "application/json" };
    const parsed = url.parse(request.url, true);
    const { pathname, query } = parsed; 
    const message = query?.message;

    if (pathname === "/") {
        response.writeHead(200, header);
        response.write(JSON.stringify({ message: message }));
    }
    else {
        response.writeHead(400, header);
        response.write(JSON.stringify({ error: "Bad request" }));
    }
        response.end();
});

server.listen(PORT);
console.log(`Listening at port ${PORT}`);

//http://localhost:9000/?message=holamundo