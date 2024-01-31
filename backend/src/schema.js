const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    salt: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    }
})

const articlesSchema = new mongoose.Schema({
    pid: {
        type: Number,
        required: [true, 'Pid is required']
    },
    author: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date().getTime(),
        required: true
    },
    comments: [{type: mongoose.Schema.Types.Number, ref: 'Comments'}]
})

const profilesSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    phone: {
        type: Number,
        required: true
    },
    zipcode: {
        type: Number,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Default status.'
    },
    followedUsers: [{type: mongoose.Schema.Types.String, ref: 'Profiles'}],
    avatar: {
        type: String,
        default:'https://res.cloudinary.com/hkqp7d76f/image/upload/v1701366057/defaultAvatar.jpg'
    }
})
const commentsSchema = new mongoose.Schema({
    cid: {
        type: Number,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date().getTime(),
        required: true
    }
})
module.exports = {
    usersSchema: usersSchema,
    articlesSchema: articlesSchema,
    profilesSchema: profilesSchema,
    commentsSchema: commentsSchema
};
