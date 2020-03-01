// Setup
import express = require('express');
import { appLogger } from './logger';
const port = process.env.PORT || 3000;
const app: express.Application = express();
const groupRouter = require('./routers/group.router.js');
const userRouter = require('./routers/user.router.js');

// Config
app.use(express.json());
app.set('case sensitive routing', true);
app.set('strict routing', true);
app.set('x-powered-by', false);

app.use((req, res, next) => {
    appLogger.info(`${req.method} ${req.path} ${JSON.stringify(req.params)}`);
    next();
});

// Routes
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