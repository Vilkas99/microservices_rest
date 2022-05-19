/** source/server.ts */
import http from "http";
import express, { Express } from "express";

import db from "./db/db";
import { Model } from "objection";

//Enviroment dotenv
require("dotenv").config();
Model.knex(db);
var cors = require("cors");

//Routes
const example_routes = require("./routes/Example");
const login_routes = require("./routes/Login");
const register_routes = require("./routes/Register");

//Router creation
const router: Express = express();

/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());
router.use(cors());
//Apply routes

router.use("/admin", example_routes);
router.use("/login", login_routes);
router.use("/register", register_routes);

/** Error handling */
router.use((req, res, next) => {
  const error = new Error("not found");
  return res.status(404).json({
    message: error.message,
  });
});

/** Server */
const httpServer = http.createServer(router);

const PORT: any = 6070;
httpServer.listen(PORT, () =>
  console.log(`The server is running on port ${PORT}`)
);
