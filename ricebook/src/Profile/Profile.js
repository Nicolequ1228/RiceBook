import React, {useEffect, useState} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import './Profile_styles.css';
import "bootstrap/js/src/collapse.js";
import {toast} from "react-toastify";

const backend_url = BACKEND_URL

function Profile() {
    const [avatar, setAvatar] = useState('');
    const [uploadImage, setUploadImage] = useState('');
    const [accName, setAccName] = useState('');
    const [dob, setDob] = useState('');
    const [emailCurr, setEmailCurr] = useState('');
    const [phoneCurr, setPhoneCurr] = useState('');
    const [zipCurr, setZipCurr] = useState('');
    const [pwdCurr, setPwdCurr] = useState('*');
    const [pwdcCurr, setPwdcCurr] = useState('*');
    const [emailUpdate, setEmailUpdate] = useState('');
    const [phoneUpdate, setPhoneUpdate] = useState('');
    const [zipUpdate, setZipUpdate] = useState('');
    const [pwdUpdate, setPwdUpdate] = useState('');
    const [pwdcUpdate, setPwdcUpdate] = useState('');
    const [inform, setInform] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const username = localStorage.getItem('username');
        setAccName(username);
    }, []);

    const loadDob = async () => {
        try {
            const response = await fetch(backend_url + '/dob', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await response.json();
            if (data.username) {
                const dobPart = data.dob.split('T')[0];
                setDob(dobPart);
            } else {
                // Handle other cases of 'result'
                console.log('loadDob error')
                toast(data.error || 'An error occurred. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast('An error occurred. Please try again later.');
        }
        ;
    }

    const loadEmail = async () => {
        try {
            const response = await fetch(backend_url + '/email', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await response.json();
            if (data.username) {
                setEmailCurr(data.email);
            } else {
                // Handle other cases of 'result'
                console.log('loadEmail error')
                toast(data.error || 'An error occurred. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast('An error occurred. Please try again later.');
        }
        ;
    }

    const loadPhone = async () => {
        try {
            const response = await fetch(backend_url + '/phone', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await response.json();
            if (data.username) {
                setPhoneCurr(data.phone);
            } else {
                // Handle other cases of 'result'
                console.log('loadPhone error')
                toast(data.error || 'An error occurred. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast('An error occurred. Please try again later.');
        }
        ;
    }

    const loadZipcode = async () => {
        try {
            const response = await fetch(backend_url + '/zipcode', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await response.json();
            if (data.username) {
                setZipCurr(data.zipcode);
            } else {
                // Handle other cases of 'result'
                console.log('loadEmail error')
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
        };
    }

    useEffect(() => {
        const fetchData = async () => {
            await loadDob();
            await loadEmail();
            await loadPhone();
            await loadZipcode();
            await loadAvatar();
        }
        fetchData()
    }, []); // Run on component mount

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

    const handleUploadAvatar = async () => {
        if(uploadImage===''){
            return;
        }
        const formData = new FormData();
        formData.append('image', uploadImage);
        try {
            const response = await fetch(backend_url + '/avatar', {
                method: 'PUT',
                credentials: 'include',
                body: formData
            })
            //console.log('Upload successful:', response);
            // Handle the response as needed
        } catch (error) {
            console.error('Error uploading file:', error);
            // Handle the error
        }
        await loadAvatar();
    }

    async function validation() {
        let tempInform = '';
        setInform(tempInform);

        if (emailUpdate !== '' && emailCurr !== emailUpdate) {
            const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
            if (emailRegex.test(emailUpdate)) {
                try {
                    const putData = {email: emailUpdate};
                    const response = await fetch(backend_url + '/email', {
                        method: 'PUT',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(putData),
                    })
                    const data = await response.json();
                    if (data.username) {
                        setEmailCurr(data.email);
                        tempInform += `<p class="text-success">Email address changed from ${emailCurr} to ${emailUpdate}.</p>`;
                    } else {
                        // Handle other cases of 'result'
                        console.log('putEmail error')
                        toast(data.error || 'An error occurred. Please try again later.');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    toast('An error occurred. Please try again later.');
                }
                ;
            } else {
                tempInform += '<p class="text-danger">Invalid email address.</p>';
            }
        }

        if (phoneUpdate !== '' && phoneCurr !== phoneUpdate) {
            const phoneRegex = /^\d{10}$/;
            if (phoneRegex.test(phoneUpdate)) {
                try {
                    const putData = {phone: phoneUpdate};
                    const response = await fetch(backend_url + '/phone', {
                        method: 'PUT',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(putData),
                    })
                    const data = await response.json();
                    if (data.username) {
                        tempInform += `<p class="text-success">Phone number changed from ${phoneCurr} to ${phoneUpdate}.</p>`;
                        setPhoneCurr(data.phone);
                    } else {
                        // Handle other cases of 'result'
                        console.log('putPhone error')
                        toast(data.error || 'An error occurred. Please try again later.');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    toast('An error occurred. Please try again later.');
                }
                ;
            } else {
                tempInform += '<p class="text-danger">Invalid phone number; it should be a 10-digit US number.</p>';
            }
        }

        if (zipUpdate !== '' && zipCurr !== zipUpdate) {
            const zipRegex = /^\d{5}$/;
            if (zipRegex.test(zipUpdate)) {
                try {
                    const putData = {zipcode: parseInt(zipUpdate)};
                    const response = await fetch(backend_url + '/zipcode', {
                        method: 'PUT',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(putData),
                    })
                    const data = await response.json();
                    if (data.username) {
                        tempInform += `<p class="text-success">Zipcode changed from ${zipCurr} to ${zipUpdate}.</p>`;
                        setZipCurr(data.zipcode);
                    } else {
                        // Handle other cases of 'result'
                        console.log('putZipcode error')
                        toast(data.error || 'An error occurred. Please try again later.');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    toast('An error occurred. Please try again later.');
                }
                ;
            } else {
                tempInform += '<p class="text-danger">Invalid zipcode; it should be a 5-digit US zipcode.</p>';
            }
        }

        if (pwdUpdate !== '') {
            if (pwdcUpdate !== pwdUpdate) {
                tempInform += '<p class="text-danger">Invalid password. Password and password confirmation should match.</p>';
            } else {
                try {
                    const putData = {password: pwdUpdate};
                    const response = await fetch(backend_url + '/password', {
                        method: 'PUT',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(putData),
                    })
                    const data = await response.json();
                    if (data.username) {
                        tempInform += `<p class="text-success">Password changed from ${pwdCurr} to ${'*'.repeat(pwdUpdate.length)}.</p>`;
                        setPwdCurr('*'.repeat(pwdUpdate.length));
                        setPwdcCurr('*'.repeat(pwdcUpdate.length));
                    } else {
                        // Handle other cases of 'result'
                        console.log('putPassword error')
                        toast(data.error || 'An error occurred. Please try again later.');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    toast('An error occurred. Please try again later.');
                }
                ;

            }
        }

        setInform(tempInform);

        setEmailUpdate('');
        setPhoneUpdate('');
        setZipUpdate('');
        setPwdUpdate('');
        setPwdcUpdate('');
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
                            <button className="btn btn-outline-danger my-2 my-sm-0" onClick={handleLogout}>Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>

            <div id="table">
                <img id='avatar' width='200' height='200'
                     src={avatar}/>
                <form>
                    <input type="file" className="form-control" id="postPic" name="postPic"
                           onChange={(e) => setUploadImage(e.target.files[0])} accept=".jpg, .jpeg, .png" required/>
                    <button type="button" className="btn btn-primary" onClick={handleUploadAvatar}>Upload new image
                    </button>
                </form>
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">Key</th>
                        <th scope="col">Value</th>
                        <th scope="col">Update</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Account name</td>
                        <td id="accName">{accName}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Date of birth</td>
                        <td id="dob">{dob}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Email address</td>
                        <td id="emailCurr">{emailCurr}</td>
                        <td>
                            <input
                                type='text'
                                id="emailUpdate"
                                value={emailUpdate}
                                onChange={(e) => setEmailUpdate(e.target.value)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Phone number</td>
                        <td id="phoneCurr">{phoneCurr}</td>
                        <td>
                            <input
                                type='text'
                                id="phoneUpdate"
                                value={phoneUpdate}
                                onChange={(e) => setPhoneUpdate(e.target.value)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Zipcode</td>
                        <td id="zipCurr">{zipCurr}</td>
                        <td>
                            <input
                                type='text'
                                id="zipUpdate"
                                value={zipUpdate}
                                onChange={(e) => setZipUpdate(e.target.value)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Password</td>
                        <td id="pwdCurr">{pwdCurr}</td>
                        <td>
                            <input
                                type='password'
                                id="pwdUpdate"
                                value={pwdUpdate}
                                onChange={(e) => setPwdUpdate(e.target.value)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Password confirmation</td>
                        <td id="pwdcCurr">{pwdcCurr}</td>
                        <td>
                            <input
                                type='password'
                                id="pwdcUpdate"
                                value={pwdcUpdate}
                                onChange={(e) => setPwdcUpdate(e.target.value)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button type="button" className="btn btn-primary" onClick={validation}>Update</button>
                        </td>
                        <td>
                            <div dangerouslySetInnerHTML={{__html: inform}}></div>
                        </td>
                        <td></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Profile;
