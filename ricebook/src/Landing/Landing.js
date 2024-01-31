import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './Landing_styles.css';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const backend_url = BACKEND_URL

function Landing() {
    const [accountName, setAccountName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [timeStamp, setTimeStamp] = useState('');

    const navigate = useNavigate();

    const getTimestamp = () => {
        const nowtime = Date.now();
        setTimeStamp(nowtime);
    };
    const ifUsernameValid = async () => {
        //console.log('now in ifUsernameValid');
        const postData = {username: accountName};
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
                //console.log('invalid')
                toast('Account name should be unique!');
                return false;
            } else {
                //console.log('valid')
                return true;
            }
        } catch (error) {
            console.error('Error:', error);
            toast('An error occurred. Please try again later.');
            return false;
        }
    }

    const ifAgeValid = () => {
        //console.log('now ifAgeValid')
        const dobDate = new Date(dob);
        const nowDate = new Date();
        nowDate.setFullYear(nowDate.getFullYear() - 18);
        if (nowDate < dobDate) {
            toast('Only individuals over 18 years old are allowed to register.');
            return false;
        } else {
            //console.log('age valid')
            return true;
        }
    };

    const ifPwdValid = () => {
        //console.log('now ifPwdValid')
        if (password === passwordConfirmation) {
            //console.log('password valid')
            return true;
        } else {
            toast('Password Confirmation does not match your Password.');
            return false;
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        getTimestamp();
        const user = await ifUsernameValid();
        //console.log(user)
        const age = ifAgeValid();
        const pwd = ifPwdValid();
        if (user && age && pwd) {
            //console.log('now register');
            const postData = {
                username: accountName,
                password: password,
                email: email,
                dob: dob,
                zipcode: zipcode,
                phone: phone
            }
            fetch(backend_url + '/register', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.result === 'success') {
                        localStorage.setItem('username', accountName);
                        alert('You can login now!')
                        window.location.reload();
                    } else {
                        // Handle other cases of 'result'
                        toast('An error occurred. Please try again later.');
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    toast('An error occurred. Please try again later.');
                });
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const postData = {username: accountName, password: password};
        fetch(backend_url + '/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.result === 'success') {
                    localStorage.setItem('username', accountName);
                    navigate('main');
                } else {
                    // Handle other cases of 'result'
                    toast(data.error || 'An error occurred. Please try again later.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                toast('An error occurred. Please try again later.');
            });
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <h4 className="navbar-brand">Welcome to RiceBook!!</h4>
            </nav>
            <table id="landingPage">
                <tbody>
                <tr>
                    <td>
                        <div id="regisBoard">
                            <h2>Registration</h2>
                            <form id="regForm" method="post" onSubmit={handleRegisterSubmit}>
                                <div className="form-group">
                                    <label htmlFor="accName">Account Name:</label>
                                    <input type="text" className="form-control" id="accName" name="accName"
                                           autoComplete='on'
                                           placeholder="Account Name" pattern="[a-zA-Z][a-zA-Z0-9]*"
                                           title="Account name can only be upper or lower case letters and numbers, but may not start with a number."
                                           required onChange={(e) => setAccountName(e.target.value)}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address:</label>
                                    <input type="email" className="form-control" id="email" name="email"
                                           autoComplete='on'
                                           placeholder="Email Address" required
                                           onChange={(e) => setEmail(e.target.value)}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number:</label>
                                    <input type="text" className="form-control" id="phone" name="phone"
                                           autoComplete='on'
                                           placeholder="1231231234" pattern="\d{10}"
                                           title="Phone Number should be a 10-digit US number." required
                                           onChange={(e) => setPhone(e.target.value)}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="dob">Date Of Birth:</label>
                                    <input type="date" className="form-control" id="dob" name="dob" required
                                           onChange={(e) => setDob(e.target.value)}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="zip">Zipcode:</label>
                                    <input type="text" className="form-control" id="zip" name="zip" placeholder="12345"
                                           autoComplete='on'
                                           pattern="\d{5}" title="Zipcode should be a 5-digit number." required
                                           onChange={(e) => setZipcode(e.target.value)}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="pwd">Password:</label>
                                    <input type="password" className="form-control" id="pwd" name="pwd" required
                                           onChange={(e) => setPassword(e.target.value)}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="pwdc">Password Confirmation:</label>
                                    <input type="password" className="form-control" id="pwdc" name="pwdc" required
                                           onChange={(e) => setPasswordConfirmation(e.target.value)}/>
                                </div>
                                <input type="hidden" id="hTimestamp" name="timestamp" value=""/>
                                <button type="submit" className="btn btn-primary">Submit</button>
                                <button type="reset" className="btn btn-secondary">Clear</button>
                            </form>
                        </div>
                    </td>
                    <td>
                        <div id="loginBoard">
                            <h2>Login</h2>
                            <form id="loginForm" method="post" onSubmit={handleLogin}>
                                <div className="form-group">
                                    <label htmlFor="accName">Account Name:</label>
                                    <input type="text" className="form-control" id="accName2" name="accName" required autoComplete='off'
                                           onChange={(e) => setAccountName(e.target.value)}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="pwd">Password:</label>
                                    <input type="password" className="form-control" id="pwd2" name="pwd" required
                                           onChange={(e) => setPassword(e.target.value)}/>
                                </div>
                                <button type="submit" className="btn btn-primary">Login</button>
                            </form>
                            <br/>
                            <button type="submit" className="btn btn-primary">Login with your Google Account</button>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
            <ToastContainer/>
        </>
    );
}

export default Landing;
