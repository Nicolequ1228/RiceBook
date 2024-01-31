const auth = require('./src/auth');
const profile = require('./src/profile');
const following = require('./src/following');
const articles = require('./src/articles');
const cookieParser = require('cookie-parser');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
//const upCloud = require('./src/uploadCloudinary')
const mongoose = require('mongoose');

const connectionString = CONNECTIONSTRING;
mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("MongoDB connected."))
    .catch(err => {
        console.log(err);
    })
const hello = (req, res) => res.send({hello: 'world'});

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'my-secret-key',//A secret key for signing session data.
    resave: true,//Determines whether to save the session on every request, regardless of whether it was modified.
    saveUninitialized: true,//Determines whether to save a new but uninitialized session.
    cookie: {
        httpOnly: false,
        maxAge: 3600 * 1000,
        sameSite: 'none',
        secure: true
    },
}));

const corsOptions = {
    origin: ['http://localhost:3000','http://ricebook-final-nicole.surge.sh','https://ricebook-final-nicole.surge.sh'],
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
};
app.use(cors(corsOptions));


app.get('/', hello);
//upCloud.setup(app)
auth(app);
articles(app);
profile(app);
following(app);

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
    const addr = server.address();
    console.log(`Server listening at http://${addr.address}:${addr.port}`)
});

