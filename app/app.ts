// Setup
import express = require('express');
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
    console.log(Date.now());
    next();
});

// Routes
app.use('/user', userRouter);
app.use('/group', groupRouter);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    next(err);
});

// Start
app.listen(port, () => console.log(`App listening on port ${port}!`));