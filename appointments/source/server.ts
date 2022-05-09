/** source/server.ts */
import http from "http";
import express, { Express } from "express";

//Databes
import db from "./db/db";
import { Model } from "objection";

//Functions
import { errorHandler } from "./utils/functions";

//Enviroment dotenv
require("dotenv").config();

//Objection relation w / Knex
Model.knex(db);

var cors = require("cors");

//Routes
const example_routes = require("./routes/Example");
const appointment_routes = require("./routes/Appointments");

//Router creation
const router: Express = express();

/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());

router.use(cors());
//Apply routes
router.use("/admin", example_routes);
router.use("/appointment", appointment_routes);

/** Error handling */
router.use(errorHandler);

/** Server */
const httpServer = http.createServer(router);
const PORT: any = process.env.PORT ?? 6060;
httpServer.listen(PORT, () =>
  console.log(`The server is running on port ${PORT}`)
);
