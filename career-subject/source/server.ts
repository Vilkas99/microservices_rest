//Libraries
import http from "http";
import express, { Express } from "express";
import { Server as WebSocketServer } from "socket.io";

//Databes
import db from "./db/db";
import { Model } from "objection";

//Functions
import { createEntryRedis, errorHandler } from "./utils/functions";

//Enviroment dotenv
require("dotenv").config();

//Objection relation w / Knex
Model.knex(db);

var cors = require("cors");

//Router creation
const router: Express = express();

/** Server */
const httpServer = http.createServer(router);
const io = new WebSocketServer(httpServer, {
  cors: {
    origin: "http://localhost:3000", //TODO: Modificar por la URL de despliegue del front
  },
});
exports.io = io;

//Routes
const career_subject_routes = require("./routes/CareerSubject");
/*
const example_routes = require("./routes/Example");
const appointment_routes = require("./routes/Appointments");
*/

/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());

router.use(cors());
//Apply routes
router.use("/career-subject", career_subject_routes);
/*
router.use("/admin", example_routes);
router.use("/appointment", appointment_routes);
*/

/** Error handling */
router.use(errorHandler);

io.on("connection", async (socket) => {
  socket.on("initial", (data) => {
    console.log("Esta es la llave: ", data.myId);
    createEntryRedis(data.myId, socket.id);
  });
});

const PORT: any = process.env.PORT ?? 6100;
httpServer.listen(PORT, () =>
  console.log(`The server is running on port ${PORT}`)
);
