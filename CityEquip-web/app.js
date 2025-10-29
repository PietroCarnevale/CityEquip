const express = require('express');
const path = require('path');
const router = require('./routes/router');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const utils = require('./utils');
const getMenuForRole = require('./config/menu');
const errorHandlers = require('./errors/errorHandlers');
const { initPassport } = require('./services/passportService');
const passport = require('passport');

// create our Express app
const app = express();

// serves up static files from the public folder.
app.use(express.static(path.join(__dirname, 'public')));

// VIEWS: this is the folder where we keep our pug files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); // we use the engine pug

//Express body-parser implementation -> creates the "req.body" object
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Session middleware
app.use(session({
    secret: process.env.SECRET,
    key: process.env.KEY, //name of the cookie
    resave: false,
    saveUninitialized: false,
    //the session is stored in the DB
    store: MongoStore.create({
        mongoUrl: process.env.DATABASE
    })
}));

initPassport();
app.use(passport.initialize());
app.use(passport.session());

//Locals middleware
app.use((req, res, next) => {
    res.locals.utils = utils;
    res.locals.user = req.user || null;
    let userRole;
    if (req.user) {
        userRole = req.user.role;
    } else {
        userRole = 'guest';
    }
    res.locals.menu = getMenuForRole(userRole);
    res.locals.currentPath = req.path;
    next(); //Go to the next middleware in the REQ-RES CYCLE
});

//Flashes middleware
app.use((req, res, next) => {
    res.locals.flashes = req.session.flashes || [];
    delete req.session.flashes;
    next();
});

//ROUTER: anytime someone goes to "/anything", we will handle it with the module "routes"
app.use('/', router);

// If above routes didnt work -> error 404 and forward to error handler
app.use(errorHandlers.notFound);

//if errors are just BD validation errors -> show them in flashes
app.use(errorHandlers.flashValidationErrors);

// Otherwise this was a really bad error we didn't expect!
if (app.get('env') === 'development') {
    /* Development Error Handler - Prints stack trace */
    app.use(errorHandlers.developmentErrors);
}

/* production error handler */
app.use(errorHandlers.productionErrors);

module.exports = app;