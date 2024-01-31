const md5 = require('md5');
const mongoose = require('mongoose');
const {usersSchema, articlesSchema, profilesSchema} = require('./schema');
const Users = mongoose.model('Users', usersSchema);
const Profiles = mongoose.model('Profiles', profilesSchema);


function isLoggedIn(req, res, next) {
    console.log(req.session)
    console.log(req.session.username)
    // User is logged in
    if (req.session && (req.app.locals.username || req.session.username)){
        req.session.username = req.app.locals.username

        req.username = req.session.username;
        next();
    } else {
        // User is not logged in
        res.sendStatus(401);
    }
}

async function login(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400);
    }

    try {
        const existingUser = await Users.findOne({username: username});

        if (existingUser) {
            // Create hash using md5, user salt and request password, check if hash matches user hash
            const hash = md5(existingUser.salt + password); //salt in db
            if (hash === existingUser.hash) {
                req.session.username = username;
                req.app.locals.username = username;

                let msg = {username: username, result: 'success'};
                res.send(msg);
            } else {
                res.send({error: 'Wrong password!'});
            }
        } else {
            res.send({error: 'User not exist!'});
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({error: "Internal Server Error"});
    }
}

async function register(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const dob = req.body.dob;
    const zipcode = parseInt(req.body.zipcode);
    const phone = parseInt(req.body.phone);

    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400);
    }

    let salt = username + new Date().getTime();
    let hash = md5(salt + password);
    try {
        const newUser = new Users({username: username, salt: salt, hash: hash});
        await newUser.save();
        const newProfile = new Profiles({username: username, phone: phone, zipcode: zipcode, dob: dob, email: email});
        await newProfile.save();
        res.send({username: username, result: 'success'});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({error: "Internal Server Error"});
    }
}

async function validUsername(req, res){
    const username = req.body.username;
    try {
        const existingUser = await Users.findOne({username: username});
        if(existingUser){
            res.send({result:"exist"})
        }else{
            res.send({result:"notExist"})
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({error: "Internal Server Error"});
    }
}

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal Server Error');
        }
    })
    res.sendStatus(200);
}

const password = async (req, res) => {
    const password = req.body;
    if (password && password.password) {
        try {
            const existingUser = await Users.findOne({username: req.username});

            if (existingUser) {
                const salt = existingUser.salt;
                let hash = md5(salt + password.password);

                existingUser.hash = hash;
                await existingUser.save();
                let msg = {username: existingUser.username, result: 'success'};
                res.send(msg);
            } else {
                res.status(401).send({error: 'User not exist!'});
            }
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send({error: "Internal Server Error"});
        }
    } else {
        res.status(404).send({error: 'Missing password'});
    }
}

module.exports = (app) => {
    app.post('/login', login);
    app.post('/register', register);
    app.post('/username', validUsername);
    app.use(isLoggedIn);
    app.put('/password', password);
    app.put('/logout', logout);
}

