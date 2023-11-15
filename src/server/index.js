const express = require("express");
const { createServer } = require('http')
const next = require("next");
const {parse} = require('url')

const {initCollaboration} = require("./collaboration/index.js")

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();

  app.all("*", (req, res) => {
    const parsedUrl = parse(req.url, true);
    nextHandler(req, res, parsedUrl);
  });

  const server = createServer(app);
  initCollaboration(server)

  try {
    const port = parseInt(process.env.PORT || "3000", 10);
    server.listen(port);
    console.log("Server listening on port", port);
  } catch (error) {
    console.log(error);
  }
});
