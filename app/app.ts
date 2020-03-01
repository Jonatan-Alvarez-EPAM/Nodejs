// Setup
import express = require('express');
import { appLogger } from './logger';
import { checkToken } from './data-access'
const port = process.env.PORT || 3000;
const app: express.Application = express();
const cors = require('cors');
const groupRouter = require('./routers/group.router.js');
const userRouter = require('./routers/user.router.js');
const loginRouter = require('./routers/login.router.js');

// Config
app.use(express.json());
app.set('case sensitive routing', true);
app.set('strict routing', true);
app.set('x-powered-by', false);
app.options('*', cors());

// Log all actions.
app.use((req, res, next) => {
    appLogger.info(`${req.method} ${req.path} ${JSON.stringify(req.params)}`);
    next();
});

// Routes
app.use('/login', loginRouter);
app.use(checkToken);
app.use('/user', userRouter);
app.use('/group', groupRouter);

// Error handling
app.use((err, req, res, next) => {
    appLogger.error(`ERROR: ${err}`);
    res.status(500).send('Oops something went wrong :(');
    res.render('error', { error: err });
});

// Start
app.listen(port, () => console.log(`App listening on port ${port}!`));