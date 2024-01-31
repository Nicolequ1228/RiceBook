const mongoose = require('mongoose');
const {usersSchema, articlesSchema, profilesSchema} = require('./schema');
const Profiles = mongoose.model('Profiles', profilesSchema);
const uploadImage = require('./uploadCloudinary')

const putHeadline = async (req, res) => {
    const headline = req.body;
    if (headline && headline.headline) {
        try {
            const existingUser = await Profiles.findOne({username: req.username});

            if (existingUser) {
                existingUser.status = headline.headline;
                await existingUser.save();
                let msg = {username: existingUser.username, headline: existingUser.status};
                res.send(msg);
            } else {
                res.send({error: 'User not exist!'});
            }
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send({error: "Internal Server Error"});
        }
    } else {
        res.status(404).send({error: 'Missing headline'});
    }
}
const getHeadline = async (req, res) => {
    let requestedUsername = req.params.user;
    if (!requestedUsername) {
        requestedUsername = req.username;
    }
    try {
        const existingUser = await Profiles.findOne({username: requestedUsername});

        if (existingUser) {
            let msg = {username: existingUser.username, headline: existingUser.status};
            res.send(msg);
        } else {
            res.send({error: 'User not exist!'});
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({error: "Internal Server Error"});
    }
}

const putEmail = async (req, res) => {
    const email = req.body;
    if (email && email.email) {
        try {
            const existingUser = await Profiles.findOne({username: req.username});

            if (existingUser) {
                existingUser.email = email.email
                await existingUser.save();
                let msg = {username: existingUser.username, email: existingUser.email};
                res.send(msg);
            } else {
                res.status(401).send({error: 'User not exist!'});
            }
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send({error: "Internal Server Error"});
        }
    } else {
        res.status(404).send({error: 'Missing email'});
    }
}
const getEmail = async (req, res) => {
    let requestedUsername = req.params.user;
    if (!requestedUsername) {
        requestedUsername = req.username;
    }
    try {
        const existingUser = await Profiles.findOne({username: requestedUsername});

        if (existingUser) {
            let msg = {username: existingUser.username, email: existingUser.email};
            res.send(msg);
        } else {
            res.status(401).send({error: 'User not exist!'});
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({error: "Internal Server Error"});
    }
}
const getDob = async (req, res) => {
    let requestedUsername = req.params.user;
    if (!requestedUsername) {
        requestedUsername = req.username;
    }
    try {
        const existingUser = await Profiles.findOne({username: requestedUsername});

        if (existingUser) {
            let msg = {username: existingUser.username, dob: existingUser.dob};
            res.send(msg);
        } else {
            res.status(401).send({error: 'User not exist!'});
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({error: "Internal Server Error"});
    }
}
const putZipcode = async (req, res) => {
    const zipcode = req.body;
    if (zipcode && zipcode.zipcode) {
        try {
            const existingUser = await Profiles.findOne({username: req.username});

            if (existingUser) {
                existingUser.zipcode = zipcode.zipcode
                await existingUser.save();
                let msg = {username: existingUser.username, zipcode: existingUser.zipcode};
                res.send(msg);
            } else {
                res.status(401).send({error: 'User not exist!'});
            }
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send({error: "Internal Server Error"});
        }
    } else {
        res.status(404).send({error: 'Missing zipcode'});
    }
}
const getZipcode = async (req, res) => {
    let requestedUsername = req.params.user;
    if (!requestedUsername) {
        requestedUsername = req.username;
    }
    try {
        const existingUser = await Profiles.findOne({username: requestedUsername});

        if (existingUser) {
            let msg = {username: existingUser.username, zipcode: existingUser.zipcode};
            res.send(msg);
        } else {
            res.status(401).send({error: 'User not exist!'});
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({error: "Internal Server Error"});
    }
}
const putPhone = async (req, res) => {
    const phone = req.body;
    if (phone && phone.phone) {
        try {
            const existingUser = await Profiles.findOne({username: req.username});

            if (existingUser) {
                existingUser.phone = phone.phone;
                await existingUser.save();
                let msg = {username: existingUser.username, phone: existingUser.phone};
                res.send(msg);
            } else {
                res.status(401).send({error: 'User not exist!'});
            }
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send({error: "Internal Server Error"});
        }
    } else {
        res.status(404).send({error: 'Missing phone'});
    }
}
const getPhone = async (req, res) => {
    let requestedUsername = req.params.user;
    if (!requestedUsername) {
        requestedUsername = req.username;
    }
    try {
        const existingUser = await Profiles.findOne({username: requestedUsername});

        if (existingUser) {
            let msg = {username: existingUser.username, phone: existingUser.phone};
            res.send(msg);
        } else {
            res.status(401).send({error: 'User not exist!'});
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({error: "Internal Server Error"});
    }
}
const putAvatar = async (req, res) => {
    const avatar = req.fileurl;
    try {
        const existingUser = await Profiles.findOne({username: req.username});

        if (existingUser) {
            existingUser.avatar = avatar;
            await existingUser.save();
            let msg = {username: existingUser.username, avatar: existingUser.avatar};
            res.send(msg);
        } else {
            res.status(401).send({error: 'User not exist!'});
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({error: "Internal Server Error"});
    }
}
const getAvatar = async (req, res) => {
    let requestedUsername = req.params.user;
    if (!requestedUsername) {
        requestedUsername = req.username;
    }
    try {
        const existingUser = await Profiles.findOne({username: requestedUsername});

        if (existingUser) {
            let msg = {username: existingUser.username, avatar: existingUser.avatar};
            res.send(msg);
        } else {
            res.status(401).send({error: 'User not exist!'});
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({error: "Internal Server Error"});
    }
}
module.exports = (app) => {
    app.put('/headline', putHeadline);
    app.get('/headline/:user?',getHeadline);
    app.put('/email', putEmail);
    app.get('/email/:user?', getEmail);
    app.get('/dob/:user?', getDob);
    app.put('/zipcode', putZipcode);
    app.get('/zipcode/:user?', getZipcode);
    app.put('/phone', putPhone);
    app.get('/phone/:user?', getPhone);
    app.put('/avatar', uploadImage('Avatar'), putAvatar);
    app.get('/avatar/:user?', getAvatar);
}