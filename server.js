/**
 * This is the main server script that provides the API endpoints
 *
 * Uses sqlite.js to connect to db
 */

const fastify = require("fastify")({
    // Set this to true for detailed logging:
    logger: true
});

const PORT = process.env.PORT || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || 'madinho';

fastify.register(require("fastify-formbody"));

const db = require("./sqlite.js");
const errorMessage =
    "Whoops! Error connecting to the database–please try again!";

// OnRoute hook to list endpoints
const routes = {
    endpoints: []
};
fastify.addHook("onRoute", routeOptions => {
    routes.endpoints.push(routeOptions.method + " " + routeOptions.path);
});

fastify.addHook('onRequest', (request, reply, done) => {
    console.log("onRoute:", request.method + " " + request.url);
    done();
})


// Just send some info at the home route
fastify.get("/", (request, reply) => {
    const data = {
        title: "Hello English Online Games",
        intro: "This is an API with the following endpoints",
        routes: routes.endpoints
    };
    reply.status(200).send(data);
});

// Return the chat messages from the database helper script - no auth
fastify.get("/messages", async(request, reply) => {
    let data = {};
    data.chat = await db.getMessages();
    console.log(data.chat);
    if (!data.chat) data.error = errorMessage;
    const status = data.error ? 400 : 200;
    reply.status(status).send(data);
});

// Add new message (auth)
fastify.post("/message", async(request, reply) => {
    let data = {};
    const auth = authorized(request.headers.admin_key);
    if (!auth || !request.body || !request.body.message) {
        data.success = false;
    } else if (auth) {
        data.success = await db.addMessage(request.body.message);
    }
    console.log(data.success);
    const status = data.success ? 201 : auth ? 400 : 401;
    reply.status(status).send(data);
});

// Update text for an message (auth)
fastify.put("/message", async(request, reply) => {
    let data = {};
    const auth = authorized(request.headers.admin_key);
    if (!auth || !request.body || !request.body.id || !request.body.message) data.success = false;
    else data.success = await db.updateMessage(request.body.id, request.body.message);
    const status = data.success ? 201 : auth ? 400 : 401;
    reply.status(status).send(data);
});

// Delete a message (auth)
fastify.delete("/message", async(request, reply) => {
    let data = {};
    const auth = authorized(request.headers.admin_key);
    if (!auth || !request.query || !request.query.id) data.success = false;
    else data.success = await db.deleteMessage(request.query.id);
    const status = data.success ? 201 : auth ? 400 : 401;
    reply.status(status).send(data);
});

// Helper function to authenticate the user key
const authorized = key => {
    if (!key ||
        key < 1 ||
        !process.env.ADMIN_KEY ||
        key !== process.env.ADMIN_KEY
    )
        return false;
    else return true;
};

// Run the server and report out to the logs
fastify.listen(PORT, function(err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
    fastify.log.info(`server listening on ${address}`);
});