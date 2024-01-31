const mongoose = require("mongoose");
const {usersSchema, articlesSchema, profilesSchema, commentsSchema} = require('./schema');
const Articles = mongoose.model('Articles', articlesSchema);
const Profiles = mongoose.model('Profiles', profilesSchema);
const Comments = mongoose.model('Comments', commentsSchema);
const uploadImage = require('./uploadCloudinary')

const getArticles = async (req, res) => {
    const requestedId = req.params.id;
    if (requestedId) {
        if (!isNaN(requestedId)) {
            // requestedId is a number
            try {
                const existingArticle = await Articles.findOne({pid: requestedId});

                if (existingArticle) {
                    res.send({articles: [existingArticle]})
                } else {
                    res.status(401).send({error: 'Article not exist!'});
                }
            } catch (error) {
                console.error("Error:", error);
                res.status(500).send({error: "Internal Server Error"});
            }
        } else {
            // requestedId is a string (username)
            try {
                const existingArticles = await Articles.find({author: requestedId});

                if (existingArticles) {
                    res.send({articles: existingArticles})
                } else {
                    res.status(401).send({error: 'Article not exist!'});
                }
            } catch (error) {
                console.error("Error:", error);
                res.status(500).send({error: "Internal Server Error"});
            }
        }
    } else {//without id param
        const regexQuery = new RegExp(req.query.search!==''? req.query.search:'.*', 'i');
        try {
            const pageNumber = parseInt(req.query.page) || 1;
            const pageSize = 10;
            const skipCount = (pageNumber - 1) * pageSize;

            const myProfile = await Profiles.findOne({username: req.username});
            let followingList = myProfile.followedUsers;
            followingList = [...followingList, req.username];
            const existingArticles = await Articles.find({
                $and: [
                    {author: {$in: followingList}},
                    {
                        $or: [
                            {author: {$regex: regexQuery}},
                            {text: {$regex: regexQuery}}
                        ]
                    }
                ]
            })
                .sort({date: -1})
                .skip(skipCount)
                .limit(10);

            if (existingArticles) {
                res.send({articles: existingArticles})
            } else {
                res.send({error: 'Article not exist!'});
            }
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send({error: "Internal Server Error"});
        }

    }
}

const editArticles = async (req, res) => {//response: array of articles in the loggedInUser's feed
    const articleId = parseInt(req.params.id);
    const {text, commentId} = req.body;
    let username = req.username;
    try {
        const existingArticle = await Articles.findOne({pid: articleId});

        if (existingArticle) {
            // Update article text && Forbidden if the user does not own the article.
            if (commentId === undefined && existingArticle.author === username) {
                existingArticle.text = text;
                await existingArticle.save();
            }
            if (commentId === undefined && existingArticle.author !== username) {
                res.status(401).send({error: 'The user does not own the article'});
            }

            // If commentId is -1, then a new comment is posted with the text message.
            if (commentId === -1) {
                // Add a new comment
                const commentCount = await Comments.countDocuments({});
                const newComment = new Comments({
                    cid: commentCount,
                    author: username,
                    text: text,
                    date: new Date().getTime()
                });
                await newComment.save();
                existingArticle.comments.push(commentCount);
                await existingArticle.save();
            }
            // If commentId is not -1, then update the requested comment on the article, if owned.
            if (commentId !== undefined && commentId !== -1) {
                const comment = await Comments.findOne({cid: commentId});
                if (!comment) {
                    res.status(404).json({error: 'Comment not found'});
                } else if (username !== comment.author) {
                    //if not owned
                    res.status(401).send({error: 'The user does not own the comment'});
                } else {
                    comment.text = text;
                    await comment.save();
                }
            }
            //response
            const myProfile = await Profiles.findOne({username: req.username});
            let followingList = myProfile.followedUsers;
            followingList = [...followingList, req.username];
            const existingArticles = await Articles.find({author: {$in: followingList}}).sort({date: -1});
            res.send({articles: existingArticles});
        } else {
            res.status(401).send({error: 'Article not exist!'});
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({error: "Internal Server Error"});
    }
}

const addArticle = async (req, res) => {//It should return the list of articles authored by the current logged in user.
    if (req.fileurl) {
        const imageUrl = req.fileurl;
        //console.log('Image URL:', imageUrl);

        const textFieldValue = req.body['text'];
        try {
            const articleCount = await Articles.countDocuments({});
            const newArticle = new Articles({
                pid: articleCount,
                author: req.username,
                text: textFieldValue,
                date: new Date().getTime(),
                img: imageUrl,
            });
            await newArticle.save();
            const existingArticles = await Articles.find({author: req.username});
            res.send({articles: existingArticles});
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send({error: "Internal Server Error"});
        }
    } else {
        let post = req.body;
        if (!post.text) {
            return res.status(400).send({error: 'Missing text'});
        } else {
            try {
                const articleCount = await Articles.countDocuments({});
                const newArticle = new Articles({
                    pid: articleCount,
                    author: req.username,
                    text: post.text,
                    date: new Date().getTime()
                });
                await newArticle.save();
                const existingArticles = await Articles.find({author: req.username});
                res.send({articles: existingArticles});
            } catch (error) {
                console.error("Error:", error);
                res.status(500).send({error: "Internal Server Error"});
            }
        }
    }
}

const loadComments = async (req, res) => {//It should return the list of comments corresponding to the article id
    const commentIds = req.body.commentIds;
    if (commentIds) {
        try {
            const comments = await Comments.find({cid: {$in: commentIds}});
            res.send({comments: comments});
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send({error: "Internal Server Error"});
        }
    } else {
        res.send({comments: []});
    }

}

module.exports = (app) => {
    app.put('/articles/:id', editArticles);
    app.get('/articles/:id?', getArticles);
    app.post('/article', uploadImage('Article'), addArticle);
    app.post('/comments/', loadComments);
}