const mongoose = require('mongoose');
const {usersSchema, articlesSchema, profilesSchema} = require('./schema');
const Profiles = mongoose.model('Profiles', profilesSchema);

const getFollowing = async (req, res) => {
    let requestedUsername = req.params.user;
    if (!requestedUsername) {
        requestedUsername=req.username;
    }
    try {
        const existingUser = await Profiles.findOne({ username:requestedUsername });

        if (existingUser) {
            let msg = {username: existingUser.username, following:existingUser.followedUsers };
            res.send(msg);
        }else{
            res.send({ error: 'User not exist!' });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}
const putFollowing = async (req, res) => {
    const addUsername = req.params.user;
    const loggedinUser = req.username;
    try {
        const existingUser = await Profiles.findOne({ username:loggedinUser });

        if (existingUser) {
            existingUser.followedUsers.push(addUsername);
            await existingUser.save();
            let msg = {username: existingUser.username, following:existingUser.followedUsers };
            res.send(msg);
        }else{
            res.status(401).send({ error: 'User not exist!' });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}
const deleteFollowing = async (req, res) => {
    const delUsername = req.params.user;
    const loggedinUser = req.username;
    try {
        const existingUser = await Profiles.findOne({ username:loggedinUser });

        if (existingUser) {
            let followlist = existingUser.followedUsers;
            followlist = followlist.filter(function(item) {
                return item !== delUsername;
            });
            existingUser.followedUsers = followlist;
            await existingUser.save();
            let msg = {username: existingUser.username, following:existingUser.followedUsers };
            res.send(msg);
        }else{
            res.status(401).send({ error: 'User not exist!' });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}
module.exports = (app) => {
    app.put('/following/:user', putFollowing);
    app.get('/following/:user?', getFollowing);
    app.delete('/following/:user', deleteFollowing);
}