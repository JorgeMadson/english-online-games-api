//based on https://www.section.io/engineering-education/a-raw-nodejs-rest-api-without-frameworks-such-as-express/

const http = require("http");

const PORT = process.env.PORT || 3000;

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
    if (request.url === '/') {
      return populateResponse("GET", response);
    }    
  } else if (request.method === "POST") {
    if (request.url === '/login') {
      console.log(request.body);
      response.statusCode = 200;
      response.setHeader("Content-Type", "text/plain");
      response.end(`POST Login on English Online Games Backend! on ${showDate()}`);
      return 
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
  const STATUS = { OK: 200 };

  response.statusCode = STATUS.OK;
  response.setHeader("Content-Type", "text/plain");
  response.end(`${method} on English Online Games Backend! on ${showDate()}`);
  return response;
}
