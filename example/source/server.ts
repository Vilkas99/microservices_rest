/** source/server.ts */
import http from 'http';
import express, { Express } from 'express';

// Knex & Objection files.
import setupDb from './db/db'

//Enviroment dotenv
require('dotenv').config()

//Routes
const admin_routes = require('./routes/Admin')
const consultant_routes = require('./routes/Consultant')
const credit_routes = require('./routes/Credit')
const debt_routes = require('./routes/Debt')
const modification_routes = require('./routes/Modification')

function requireHTTPS(req:any, res:any, next:any) {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
      return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}





//Initialize DB
setupDb()

//Router creation
const router: Express = express();

//router.use(requireHTTPS)

/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());

/** RULES OF OUR API */
router.use((req, res, next) => {
    // set the CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    // set the CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    // set the CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
        return res.status(200).json({});
    }
    next();
});

//Apply routes
router.use('/admin', admin_routes)
router.use('/consultant', consultant_routes)
router.use('/credit', credit_routes)
router.use('/debts', debt_routes)
router.use('/mod', modification_routes)

/** Error handling */
router.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});



/** Server */
const httpServer = http.createServer(router);
const PORT: any = process.env.PORT ?? 6060;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));