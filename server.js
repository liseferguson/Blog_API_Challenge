//import express framework to node
const express = require("express");
//import morgan to log activity
const morgan = require("morgan");

const mongoose = require('mongoose');

// Mongoose internally uses a promise-like object,
// but it's better to make Mongoose use built in es6 promises
mongoose.Promise = global.Promise;

// config.js is where we control constants for entire
// app like PORT and DATABASE_URL
const {PORT, TEST_DATABASE_URL} = require('./config');

const { BlogPosts } = require('./models');

//make variable set to endpoint destiantion
const blogPostsRouter = require("./blogPostsRouter");
//create app with express
const app = express();
//tell app we created to use morgan (what's common?)
app.use(morgan("common"));
//tell app to use json in express
app.use(express.json());
// you need to import `blogPostsRouter` router and route
// requests to HTTP requests to `/blog-posts` to `blogPostsRouter`
app.use("/blog-posts", blogPostsRouter);

//app.listen(process.env.PORT || 8080, () => {
//  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
//});

// this function starts our server and returns a Promise.
// In our test code, we need a way of asynchronously starting
// our server, since we'll be dealing with promises there.
function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,
      err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve();
          })
          .on("error", err => {
            mongoose.disconnect();
            reject(err);
          });
      }
    );
  });
}

// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(TEST_DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };