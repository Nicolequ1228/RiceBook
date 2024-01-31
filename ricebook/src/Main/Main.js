import React, {useState, useEffect} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Main_styles.css';

import {Card, Row, Col, Button} from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import Pagination from 'react-bootstrap/Pagination';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

const backend_url = BACKEND_URL

function PostCard({username, post_key, post_img_src, post_author, post_text, post_time, comments}) {
    const [newComment, setNewComment] = useState('');
    const [commentIds, setCommentIds] = useState(comments);
    const [currentText, setCurrentText] = useState(post_text);
    const [newText, setNewText] = useState(post_text);
    const [commentsForThisPost, setCommentsForThisPost] = useState([]);
    const [isCommentVisible, setIsCommentVisible] = useState(false);
    const [isArticleEdit, setIsArticleEdit] = useState(false);


    const loadComments = async () => {
        try {
            const postData = {commentIds: commentIds};
            const response = await fetch(backend_url + '/comments', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });
            const data = await response.json();

            setCommentsForThisPost(data.comments)
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    useEffect(() => {
        if(isCommentVisible){
            const fetchData = async () => {
                await loadComments();
            }
            fetchData()
        }
    }, [isCommentVisible,commentIds]);

    const handleCommentBtn = () => {
        setIsCommentVisible(!isCommentVisible);
    }

    const handleNewComment = async (e) => {
        e.preventDefault();
        try {
            const putData = {text: newComment, commentId: -1};
            const response = await fetch(backend_url + '/articles/' + post_key, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(putData),
            });

            if (response.ok) {
                //get updated comment id list
                const response2 = await fetch(backend_url + '/articles/' + post_key, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const articleData = await response2.json();
                setCommentIds(articleData.articles[0].comments)
                setNewComment('');

            } else {
                console.log('handleNewComment ERROR')
                toast('An error occurred. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast('An error occurred. Please try again later.');
        }
        ;
    }
    const handlePostEditBtn = () => {
        if(username===post_author) {
            setIsArticleEdit(!isArticleEdit);
            setNewText(currentText);
        }
        else{
            toast('You do not have the permission to edit this article!')
        }
    }

    const handleNewText = async (e) => {
        e.preventDefault();
        try {
            const putData = {text: newText};
            const response = await fetch(backend_url + '/articles/' + post_key, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(putData),
            });

            if (response.ok) {
                setCurrentText(newText);
                setIsArticleEdit(!isArticleEdit)
            } else {
                console.log('handleNewText ERROR')
                toast('An error occurred. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast('An error occurred. Please try again later.');
        }
        ;
    }

    const handleEditCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const putData = {text: newText};
            const response = await fetch(backend_url + '/articles/' + post_key, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(putData),
            });

            if (response.ok) {
                setCurrentText(newText);
                setIsArticleEdit(!isArticleEdit)
            } else {
                console.log('handleNewText ERROR')
                toast('An error occurred. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast('An error occurred. Please try again later.');
        }
        ;
    }

    return (
        <>
            <Col key={post_key}>
                <Card>
                    {post_img_src && <Card.Img variant="top" src={post_img_src}/>}
                    <Card.Body>
                        <Card.Title>{post_author}</Card.Title>
                        {!isArticleEdit && <Card.Text>{currentText}</Card.Text>}
                        {isArticleEdit && <div>
                            <FloatingLabel controlId="floatingTextarea" label="Edit Text">
                                <Form.Control
                                    as="textarea"
                                    value={newText}
                                    className="editTextArea"
                                    onChange={(e) => setNewText(e.target.value)}
                                />
                            </FloatingLabel>
                            <Button variant="primary" onClick={handleNewText}>Submit</Button>
                        </div>}
                        <Card.Text>{(post_time).split('.')[0].split('T').join(' ')}</Card.Text>
                        {isCommentVisible &&
                            <div>
                                <hr/>
                                <ListGroup variant="flush">
                                {commentsForThisPost.map((comment) =>
                                 <ListGroup.Item key={comment.cid}>
                                     {comment.author}: {comment.text}<br/>
                                     {(comment.date).split('.')[0].split('T').join(' ')}
                                 </ListGroup.Item>)
                                }
                                </ListGroup>
                            </div>
                        }
                        {isCommentVisible && <Row className="align-items-center">
                            <Col md={8}>
                                <input type="text" className="form-control" name="commentText"
                                       placeholder="Your comment here..." value={newComment}
                                       onChange={(e) => setNewComment(e.target.value)} required/>
                            </Col>
                            <Col md={4}>
                                <Button variant="primary" onClick={handleNewComment}>Submit</Button>
                            </Col>
                        </Row>}
                        <Button variant="outline-primary"
                                onClick={handleCommentBtn}>Comment</Button>
                        <Button variant="outline-primary" onClick={handlePostEditBtn}>Edit</Button>
                    </Card.Body>
                </Card>
            </Col>
        </>
    );
}

function PostBoard({username,articles}) {
    return (
        <Row xs={1} md={2} className="g-4">
            {articles.map((article) => (
                <PostCard
                    username={username}
                    key={article.pid}
                    post_key={article.pid}
                    post_img_src={article.img}
                    post_text={article.text}
                    post_author={article.author}
                    post_time={article.date}
                    comments={article.comments}
                />
            ))}
        </Row>
    );
}

function UserCard({
                      user_img_src, user_name, user_status, unfollowFunction
                  }) {
    const [status, setStatus] = useState('');
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await user_status();
                setStatus(result);
            } catch (error) {
                console.error('Error fetching user status:', error);
                // Handle the error, update state, or show an error message
            }
        };
        fetchData();
    }, [user_status]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await user_img_src();
                setAvatar(result);
            } catch (error) {
                console.error('Error fetching user status:', error);
                // Handle the error, update state, or show an error message
            }
        };
        fetchData();
    }, [user_img_src]);

    return (
        <>
            <Card id="userCard">
                <Card.Img id="userCardImg" variant="top" src={avatar}/>
                <Card.Body>
                    <Card.Title>{user_name}</Card.Title>
                    <Card.Text>{status}</Card.Text>
                    <Button variant="outline-danger"
                            onClick={() => unfollowFunction(user_name)}>Unfollow</Button>
                </Card.Body>
            </Card>
        </>
    );
}

function FollowingBoard({
                            followingUsers, unfollowFunction
                        }) {

    async function getStatus(username) {
        try {
            const response = await fetch(backend_url + '/headline/' + username, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await response.json();
            if (data.username) {
                return (data.headline);
            } else {
                // Handle other cases of 'result'
                console.log('FollowingBoard->getStatus ERROR');
                toast(data.error || 'An error occurred. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast('An error occurred. Please try again later.');
        }
    }

    async function getAvatar(username) {
        try {
            const response = await fetch(backend_url + '/avatar/' + username, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await response.json();
            if (data.username) {
                return (data.avatar);
            } else {
                // Handle other cases of 'result'
                console.log('FollowingBoard->getAvatar ERROR');
                toast(data.error || 'An error occurred. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast('An error occurred. Please try again later.');
        }
    }

    return (
        <>
            {followingUsers.map((user) => (
                <UserCard
                    key={user}
                    user_img_src={async () => getAvatar(user)}
                    user_name={user}
                    user_status={async () => getStatus(user)}
                    unfollowFunction={unfollowFunction}
                />
            ))}
        </>
    );
}

function Main() {
    const [articles, setArticles] = useState([]);
    const [followingUsers, setFollowingUsers] = useState([]);
    const [avatar, setAvatar] = useState('');
    const [status, setStatus] = useState('');
    const [updateStatus, setUpdateStatus] = useState('');
    const [updatePostText, setUpdatePostText] = useState('');
    const [updatePostPic, setUpdatePostPic] = useState('');
    const [updateFollowing, setUpdateFollowing] = useState('');
    const [updateSearchValue, setUpdateSearchValue] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const navigate = useNavigate();

    const username = localStorage.getItem('username');

    const loadStatus = async () => {
        try {
            const response = await fetch(backend_url + '/headline', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await response.json();
            if (data.username) {
                setStatus(data.headline);
            } else {
                // Handle other cases of 'result'
                console.log('loadStatus error')
                toast(data.error || 'An error occurred. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast('An error occurred. Please try again later.');
        }
        ;
    }
    const loadAvatar = async () => {
        try {
            const response = await fetch(backend_url + '/avatar', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await response.json();
            if (data.username) {
                setAvatar(data.avatar);
            } else {
                // Handle other cases of 'result'
                console.log('loadAvatar error')
                toast(data.error || 'An error occurred. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast('An error occurred. Please try again later.');
        }
        ;
    }

    useEffect(() => {
        const fetchData = async () => {
            await loadStatus();
            await loadAvatar();
        }
        fetchData()
    }, []); // Run on component mount

    const loadFollowing = async () => {
        try {
            const response = await fetch(backend_url + '/following', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await response.json();
            if (data.username) {
                //console.log(data.username);
                setFollowingUsers(data.following);
            } else {
                // Handle other cases of 'result'
                console.log('loadFollowing ERROR')
                toast(data.error || 'An error occurred. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast('An error occurred. Please try again later.');
        }
        ;
    }

    useEffect(() => {
        const fetchData = async () => {
            await loadFollowing();
        }
        fetchData();
    }, []); // Run on component mount

    const loadArticles = async () => {
        try {
            const response = await fetch(backend_url + `/articles?page=${currentPage}&search=${updateSearchValue}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await response.json();
            if (data.articles) {
                //console.log(data.articles);
                setArticles(data.articles);
                setHasMore(data.articles.length === 10);
            } else {
                // Handle other cases of 'result'
                console.log('loadArticles ERROR')
                toast(data.error || 'An error occurred. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast('An error occurred. Please try again later.');
        }
        ;
    }

    useEffect(() => {
        const fetchData = async () => {

            await loadArticles();

        };
        fetchData();
    }, [followingUsers, updateSearchValue, currentPage]);

    const handleLogout = async () => {
        await fetch(backend_url + '/logout', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            if (response.ok) {
                localStorage.removeItem('username');
                navigate('/');
                return;
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        })
            .catch((error) => {
                console.error('Error:', error);
                toast('An error occurred. Please try again later.');
            });
    };

    async function handleNewPost(e) {
        e.preventDefault();
        let response;
        try {
            if (updatePostPic !== '') {
                const formData = new FormData();
                formData.append('image', updatePostPic);
                formData.append('text', updatePostText);
                response = await fetch(backend_url + '/article', {
                    method: 'POST',
                    credentials: 'include',
                    body: formData,
                })
            } else {
                const postData = {text: updatePostText}
                response = await fetch(backend_url + '/article', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(postData),
                })
            }

            if (response.ok) {
                loadArticles();
            } else {
                console.log('handleNewPost ERROR')
                toast('An error occurred. Please try again later.');
            }

        } catch (error) {
            console.error('Error:', error);
            toast('An error occurred. Please try again later.');
        }
        ;
    }

    async function handleNewStatus() {
        const putData = {headline: updateStatus};
        await fetch(backend_url + '/headline', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(putData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.headline) {
                    setStatus(updateStatus);
                    setUpdateStatus('');
                } else {
                    console.log('handleNewStatus ERROR')
                    toast(data.error || 'An error occurred. Please try again later.');
                }
            }).catch((error) => {
                console.error('Error:', error);
                toast('An error occurred. Please try again later.');
            });
    }

    async function handleAddFollowing() {
        if (username === updateFollowing) {
            toast('You cannot follow yourself!');
            setUpdateFollowing('');
            return;
        }
        const ifAlreadyFollowingUser = followingUsers.find((user) => user === updateFollowing);
        if (ifAlreadyFollowingUser) {
            toast('You have already followed this user!');
            setUpdateFollowing('');
            return;
        }
        const postData = {username: updateFollowing};
        try {
            const response = await fetch(backend_url + '/username', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });
            const data = await response.json();
            if (data.result === 'exist') {
                await fetch(backend_url + '/following/' + updateFollowing, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.following) {
                            setFollowingUsers(data.following);
                            setUpdateFollowing('');
                            return true;
                        } else {
                            toast('User does not exist!');
                            setUpdateFollowing('');
                            return false;
                        }
                    }).catch((error) => {
                        console.error('Error:', error);
                        toast('An error occurred. Please try again later.');
                    });
            } else {
                toast('User does not exist!');
                setUpdateFollowing('');
                return false;
            }
        } catch (error) {
            console.error('Error:', error);
            toast('An error occurred. Please try again later.');
            setUpdateFollowing('');
            return false;
        }
    }

    async function handleUnfollow(username) {
        await fetch(backend_url + '/following/' + username, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.following) {
                    setFollowingUsers(data.following);
                    return true;
                } else {
                    console.log('handleUnfollow')
                    toast(data.error || 'An error occurred. Please try again later.');
                    return false;
                }
            }).catch((error) => {
                console.error('Error:', error);
                toast('An error occurred. Please try again later.');
            });
    }

    async function searchPost(searchValue) {
        /*const filteredPost = articles.filter((post) => {
            const lowercaseSearchValue = searchValue.toLowerCase();

            return (
                post.text.toLowerCase().includes(lowercaseSearchValue) ||
                post.author.toLowerCase().includes(lowercaseSearchValue)
            );
        });
        setArticles(filteredPost);*/
        setHasMore(true);
        setCurrentPage(1);
        await loadArticles(searchValue);
    }

    const handleNext = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePrev = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <h4 className="navbar-brand">RiceBook</h4>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <NavLink className="nav-link" to="/main">Posts</NavLink>
                        </li>
                        <li className="nav-item active">
                            <NavLink className="nav-link" to="/profile">My profile</NavLink>
                        </li>
                        <li className="nav-item active">
                            <button className="btn btn-outline-danger my-2 my-sm-0"
                                    onClick={handleLogout}>Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
            <Row>
                <Col xs={3}>
                    <Card id="profileBoard">
                        <Card.Img id="avatar" variant="top" src={avatar}/>
                        <Card.Body>
                            {username && <Card.Title>{username}</Card.Title>}
                            <Card.Text>{status}</Card.Text>
                            <input type="text" className="form-control" id="updateStatus"
                                   value={updateStatus} placeholder="Update Status"
                                   onChange={(e) => setUpdateStatus(e.target.value)} autoComplete="off" required/>
                            <button type="button" className="btn btn-primary" onClick={handleNewStatus}>Update
                            </button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <div id='newPostBoard'>
                        <form id="newPostForm" method="post" onSubmit={handleNewPost}>
                            <div className="form-group">
                                <label htmlFor="postText">Post Text</label>
                                <Form.Control id="postText" name="postText"
                                    as="textarea" value={updatePostText}
                                    onChange={(e) => setUpdatePostText(e.target.value)}
                                              autoComplete="off" required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="postPic">Post Picture</label>
                                <input type="file" className="form-control" id="postPic" name="postPic"
                                       onChange={(e) => setUpdatePostPic(e.target.files[0])}/>
                            </div>
                            <button type="submit" className="btn btn-primary">Post</button>
                            <button type="reset" className="btn btn-secondary">Cancel</button>
                        </form>
                        <input className="form-control" type="search"
                               placeholder="Search By Post Author or Content"
                               name="searchBar"
                               aria-label="Search" autoComplete='off'
                               onChange={(e) => setUpdateSearchValue(e.target.value)}/>
                        <button className="btn btn-outline-success" type="submit"
                                onClick={() => searchPost(articles, updateSearchValue)}>Search
                        </button>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xs={3}>
                    <div id='followingBoard'>
                        <h4>Following</h4>
                        <input type="text" className="form-control" id="addfollowing"
                               value={updateFollowing} placeholder="Add new following"
                               onChange={(e) => setUpdateFollowing(e.target.value)} autoComplete="off" required/>
                        <button type="button" className="btn btn-primary"
                                onClick={async () => handleAddFollowing()}>Add
                        </button>
                        <FollowingBoard followingUsers={followingUsers}
                                        unfollowFunction={handleUnfollow}/>
                    </div>
                </Col>
                <Col>
                    <div id='postBoard'>
                        <PostBoard username={username} articles={articles}/>
                    </div>
                </Col>
            </Row>
            <div id='pagination'>
                <Pagination>
                    <Pagination.Prev disabled={currentPage === 1} onClick={handlePrev}/>
                    <Pagination.Next disabled={!hasMore} onClick={handleNext}/>
                </Pagination>
            </div>
            <ToastContainer/>
        </div>

    );
}

export default Main;
