/**
 * This is the main server script that provides the API endpoints
 * The script uses the database helper in /src
 * The endpoints retrieve, update, and return data to the page handlebars files
 *
 * The API returns the front-end UI handlebars pages, or
 * Raw json if the client requests it with a query parameter ?raw=json
 */

// Utilities we need
const fs = require("fs");
const path = require("path");

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false
});

// Setup our static files
fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "public"),
  prefix: "/" // optional: default '/'
});

// fastify-formbody lets us parse incoming forms
fastify.register(require("fastify-formbody"));

// point-of-view is a templating manager for fastify
fastify.register(require("point-of-view"), {
  engine: {
    handlebars: require("handlebars")
  }
});

// We use a module for handling database operations in /src
const data = require("./src/data.json");
const db = require("./src/" + data.database);

/**
 * Home route for the app
 *
 * Return the poll options from the database helper script
 * The home route may be called on remix in which case the db needs setup
 *
 * Client can request raw data using a query parameter
 */
fastify.get("/", async (request, reply) => {
  reply.send("Hello World");
});


fastify.post('/comments', (req, res) => {
    const fName = req.body.fName;
    const lName = req.body.lName;
    const role = req.body.role;
    const score = req.body.score;
    const comment = req.body.comment;

    
    var success = db.addComment(fName, lName, role, score, comment);
    if (success) {
        res.send("Comment submitted successfully")
    } else {
        res.send("error")
    }
});

fastify.get('/comments', async (req, res) => {
    let params = {};
    params.comment = await db.viewComment();
    console.log(JSON.stringify(params.comment));
    res.send(params);
})


fastify.listen(3000, function(err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Your app is listening on ${address}`);
  fastify.log.info(`server listening on ${address}`);
});
