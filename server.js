//based on https://www.section.io/engineering-education/a-raw-nodejs-rest-api-without-frameworks-such-as-express/
// https://nodejs.dev/learn/get-http-request-body-data-using-nodejs

const http = require("http");

const PORT = process.env.PORT || 3000;
const STATUS_CODES = { OK: 200 };

const server = http.createServer((request, response) => {
  router(request, response);
});

server.listen(PORT, () => {
  console.log(`Servidor de pé em http://localhost:${PORT}/`);
});

//ToDo move to other file
function router(request, response) {

  console.log(request.url, request.method);

  if (request.method === "GET") {
    return populateResponse("GET", response);
  }
  if (request.method === "POST") {
    if (request.url === '/login') {

      let data = '';
      request.on('data', chunk => {
        data += chunk;
        if (data.length > 10000)
                request.connection.destroy();
      });
      //Fetching the request data body
      request.on('end', () => {
        data = JSON.parse(data)
        console.log(data); // 'username?'
        response.statusCode = STATUS_CODES.OK;
        response.setHeader("Content-Type", "application/json");
        response.end(`Success Login from ${data.username} on ${showDate()}`);
      });

      return response;
    }
    return populateResponse("POST", response);
  } else {
    response.statusCode = 400;
    response.setHeader("Content-Type", "text/plain");
    response.write(
      `Just GET or POST on English Online Games Backend! on ${showDate()}`
    );
    response.end();
    return response;
  }
}

function showDate() {
  return new Date().toLocaleString("pt-BR");
}

function populateResponse(method, response) {

  response.statusCode = STATUS_CODES.OK;
  response.setHeader("Content-Type", "text/plain");
  response.end(`${method} on English Online Games Backend! on ${showDate()}`);
  return response;
}
