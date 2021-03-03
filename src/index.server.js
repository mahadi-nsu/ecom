const FS = require('fs');

const Express = require('express');
const ExpressJWT = require('express-jwt');

const JWT = require('jsonwebtoken');
const Guard = require('express-jwt-permissions')();
const IO = require('socket.io');
const Multer = require('multer');
const Compression = require('compression');
const Morgan = require('morgan');
const Helmet = require('helmet');
const CORS = require('cors');

const Chalk = require('chalk');

const PORT = 1234;
const JWTSecret = Buffer.from('gx7dWm#F*4x%Ns5+7LGCwP%XPR?rVu3QntyNN+WvzF6$Z%?2u_8yceZ$8z4hHK+F', 'base64');

const App = Express(Compression());

const UploadImages = Multer();

// Express Best Practices Middleware
App.use(Helmet());
App.use(Morgan('combined'));
App.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
App.use(CORS());
App.use(Express.json());
App.use(Express.urlencoded({
    extended: true
}));
App.use(ExpressJWT({
    secret: JWTSecret,
    algorithms: ['RS512'],
    credentialsRequired: false
}));

// Express App Router Starts From Here

App.get('/', (req, res, next) => {
    res.send('Hello World');
});

// Express App Router ENDS Here

// Express Universal Error Capture
App.all('*', (req, res, next) => {
    res.send(`<h1>Invalid Page Requested</h1>`);
});

App.use((err, req, res, next) => {
    res.send('Error');
});

// Server With Socket.io Integration At Port 12345
const SocketIO = IO(App.listen(PORT, () => {
    console.log(Chalk.bgGreen.red('Server Started Successfully'));
}), {
    cors: {
        origin: '*',
        methods: ['GET, POST, OPTIONS, PUT, PATCH, DELETE'],
        withCredentials: true
    }
});